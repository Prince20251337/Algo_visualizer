    let// ---------- GRAPH DATA ----------
     nodes = [];      // { id, x, y }
    let edges = [];      // { from, to, weight }
    let nextNodeId = 0;
    let startNode = null;
    let endNode = null;

    // UI modes
    let currentMode = "addNode";   // addNode, addEdge, setStart, setEnd
    let pendingEdgeSource = null;   // store node id during add edge mode

    // canvas & drawing
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    let canvasWidth = canvas.width, canvasHeight = canvas.height;

    // Step-by-step algorithm state
    let stepSnapshots = [];     // array of step objects: { visitedSet, frontierSet, currentNode, parentMap, finalPath, pathCost }
    let currentStepIndex = -1;
    let computedAlgo = null;

    // Helper: update UI counts
    function updateCounters() {
        document.getElementById('nodeCount').innerText = nodes.length;
        document.getElementById('edgeCount').innerText = edges.length;
        const startLabel = startNode !== null ? startNode : '—';
        const endLabel = endNode !== null ? endNode : '—';
        document.getElementById('startIdLabel').innerText = startLabel;
        document.getElementById('endIdLabel').innerText = endLabel;
        // edge list preview
        const edgeDiv = document.getElementById('edgeListDisplay');
        if (edges.length === 0) edgeDiv.innerHTML = '<i>no edges yet</i>';
        else {
            edgeDiv.innerHTML = edges.map(e => `🔹 ${e.from} → ${e.to} (w=${e.weight})`).join('<br>');
        }
    }

    // draw entire graph with current highlight (step snapshot)
    function drawGraph(highlight = null) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // background
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // draw edges
        for (let e of edges) {
            const fromNode = nodes.find(n => n.id === e.from);
            const toNode = nodes.find(n => n.id === e.to);
            if (!fromNode || !toNode) continue;
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.strokeStyle = "#5b6e8c";
            ctx.lineWidth = 2;
            ctx.stroke();
            // weight label
            const mx = (fromNode.x + toNode.x)/2;
            const my = (fromNode.y + toNode.y)/2;
            ctx.font = "bold 11px 'JetBrains Mono'";
            ctx.fillStyle = "#cbd5e6";
            ctx.shadowBlur = 0;
            ctx.fillText(e.weight, mx-6, my-4);
        }
        // draw nodes
        for (let n of nodes) {
            let color = "#334155";
            let borderColor = "#94a3b8";
            let radius = 14;
            if (startNode === n.id) color = "#10b981";
            if (endNode === n.id) color = "#f43f5e";
            if (highlight) {
                if (highlight.visitedSet && highlight.visitedSet.has(n.id) && n.id !== startNode && n.id !== endNode) color = "#3b82f6";
                if (highlight.frontierSet && highlight.frontierSet.has(n.id)) borderColor = "#ff8c42", radius = 16;
                if (highlight.currentNode === n.id && n.id !== startNode && n.id !== endNode) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = "#ff8c42";
                    color = "#ffb347";
                }
                if (highlight.finalPath && highlight.finalPath.includes(n.id) && (n.id !== startNode && n.id !== endNode)) color = "#facc15";
            }
            ctx.beginPath();
            ctx.arc(n.x, n.y, radius, 0, 2*Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "#f1f5f9";
            ctx.font = "bold 13px 'Segoe UI'";
            ctx.shadowBlur = 0;
            ctx.fillText(n.id, n.x-6, n.y+5);
        }
        // reset shadow
        ctx.shadowBlur = 0;
    }

    // refresh without highlight
    function refreshCanvas() { drawGraph(null); }

    // ----- graph manipulation -----
    function addNodeAt(x, y) {
        const id = nextNodeId++;
        nodes.push({ id, x, y });
        updateCounters();
        refreshCanvas();
    }
    function addEdge(fromId, toId, weight) {
        if (fromId === toId) return alert("Self-loop not allowed");
        const already = edges.some(e => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId));
        if (already) return alert("Edge already exists!");
        edges.push({ from: fromId, to: toId, weight: Math.max(1, Math.min(20, weight)) });
        updateCounters();
        refreshCanvas();
    }
    function setStartNode(id) { startNode = id; updateCounters(); refreshCanvas(); }
    function setEndNode(id) { endNode = id; updateCounters(); refreshCanvas(); }
    function clearGraph() {
        nodes = [];
        edges = [];
        nextNodeId = 0;
        startNode = null;
        endNode = null;
        pendingEdgeSource = null;
        updateCounters();
        refreshCanvas();
        stepSnapshots = [];
        currentStepIndex = -1;
        computedAlgo = null;
        document.getElementById("stepPrevBtn").disabled = true;
        document.getElementById("stepNextBtn").disabled = true;
        document.getElementById("resetStepsBtn").disabled = true;
        document.getElementById("stepCounter").innerText = "Step 0 / 0";
        document.getElementById("statsPanel").innerHTML = "📊 <strong>Algorithm:</strong> — &nbsp;| 🧭 <strong>Visited nodes:</strong> — &nbsp;| 🎯 <strong>Path cost:</strong> — &nbsp;| 📏 <strong>Path length:</strong> —";
    }
    function resetStartEndToFirstLast() {
        if (nodes.length === 0) return;
        startNode = nodes[0].id;
        endNode = nodes[nodes.length-1].id;
        updateCounters();
        refreshCanvas();
    }

    // generate complex random graph (connected, weighted, nice positions)
    function generateComplexRandom() {
        clearGraph();
        const nodeCount = 12 + Math.floor(Math.random() * 7); // 12-18 nodes
        const w = canvasWidth - 80, h = canvasHeight - 80;
        for (let i=0; i<nodeCount; i++) {
            let x = 50 + Math.random() * w;
            let y = 50 + Math.random() * h;
            addNodeAt(x, y);
        }
        // ensure connectivity via spanning tree
        const nodeIds = nodes.map(n => n.id);
        const adjSet = new Set();
        const connected = new Set([nodeIds[0]]);
        while (connected.size < nodeIds.length) {
            let from = null, to = null;
            for (let u of connected) {
                const candidates = nodeIds.filter(id => !connected.has(id));
                if (candidates.length) {
                    from = u;
                    to = candidates[Math.floor(Math.random() * candidates.length)];
                    break;
                }
            }
            if (from !== null && to !== null) {
                const weight = 1 + Math.floor(Math.random() * 12);
                addEdge(from, to, weight);
                connected.add(to);
            }
        }
        // extra random edges (dense)
        const extra = Math.floor(nodeCount * 1.2);
        for (let i=0; i<extra; i++) {
            const u = nodeIds[Math.floor(Math.random() * nodeIds.length)];
            const v = nodeIds[Math.floor(Math.random() * nodeIds.length)];
            if (u !== v && !edges.some(e => (e.from===u && e.to===v) || (e.from===v && e.to===u))) {
                const weight = 1 + Math.floor(Math.random() * 15);
                addEdge(u, v, weight);
            }
        }
        if (nodes.length > 0) {
            startNode = nodes[0].id;
            endNode = nodes[nodes.length-1].id;
        }
        updateCounters();
        refreshCanvas();
    }

    // ---------- ALGORITHM STEP GENERATORS (store snapshots) ----------
    // each step: { visitedSet, frontierSet, currentNode, parentMap, finalPath, totalCost }
    function buildSnapshot(visitedSet, frontierSet, currentNode, parentMap, finalPath=null, totalCost=null) {
        return {
            visitedSet: new Set(visitedSet),
            frontierSet: new Set(frontierSet),
            currentNode: currentNode,
            parentMap: new Map(parentMap),
            finalPath: finalPath ? [...finalPath] : null,
            totalCost: totalCost
        };
    }

    function computeStepsBFS(start, end) {
        const adj = buildAdjacency();
        const steps = [];
        const queue = [start];
        const visited = new Set();
        const parent = new Map();
        parent.set(start, null);
        let finalPathArr = null;
        let totalCostVal = null;
        while (queue.length) {
            const cur = queue.shift();
            if (visited.has(cur)) continue;
            visited.add(cur);
            // snapshot BEFORE expanding? we capture after adding to visited
            const frontier = new Set(queue.filter(n => !visited.has(n)));
            steps.push(buildSnapshot(visited, frontier, cur, parent, null, null));
            if (cur === end) {
                finalPathArr = reconstructPath(parent, start, end);
                totalCostVal = computePathCost(finalPathArr);
                steps.push(buildSnapshot(visited, frontier, cur, parent, finalPathArr, totalCostVal));
                break;
            }
            for (let nei of adj[cur] || []) {
                if (!visited.has(nei.node) && !parent.has(nei.node)) {
                    parent.set(nei.node, cur);
                    queue.push(nei.node);
                }
            }
        }
        if (!finalPathArr && visited.has(end)) {
            finalPathArr = reconstructPath(parent, start, end);
            totalCostVal = computePathCost(finalPathArr);
            steps.push(buildSnapshot(visited, new Set(), end, parent, finalPathArr, totalCostVal));
        }
        return steps;
    }

    function computeStepsDFS(start, end) {
        const adj = buildAdjacency();
        const steps = [];
        const stack = [start];
        const visited = new Set();
        const parent = new Map();
        parent.set(start, null);
        while (stack.length) {
            const cur = stack.pop();
            if (visited.has(cur)) continue;
            visited.add(cur);
            const frontier = new Set(stack.filter(n => !visited.has(n)));
            steps.push(buildSnapshot(visited, frontier, cur, parent, null, null));
            if (cur === end) {
                const finalPath = reconstructPath(parent, start, end);
                const cost = computePathCost(finalPath);
                steps.push(buildSnapshot(visited, frontier, cur, parent, finalPath, cost));
                break;
            }
            for (let nei of adj[cur] || []) {
                if (!visited.has(nei.node) && !parent.has(nei.node)) {
                    parent.set(nei.node, cur);
                    stack.push(nei.node);
                }
            }
        }
        return steps;
    }

    function computeStepsDijkstra(start, end) {
        const adj = buildAdjacency();
        const steps = [];
        const dist = new Map();
        const parent = new Map();
        const visited = new Set();
        for (let n of nodes) dist.set(n.id, Infinity);
        dist.set(start, 0);
        const pq = [{ id: start, cost: 0 }];
        parent.set(start, null);
        while (pq.length) {
            pq.sort((a,b) => a.cost - b.cost);
            const { id: cur } = pq.shift();
            if (visited.has(cur)) continue;
            visited.add(cur);
            const frontierSet = new Set(pq.map(item => item.id).filter(id => !visited.has(id)));
            steps.push(buildSnapshot(visited, frontierSet, cur, parent, null, null));
            if (cur === end) break;
            for (let nei of adj[cur] || []) {
                const newDist = dist.get(cur) + nei.weight;
                if (newDist < dist.get(nei.node)) {
                    dist.set(nei.node, newDist);
                    parent.set(nei.node, cur);
                    pq.push({ id: nei.node, cost: newDist });
                }
            }
        }
        let finalPath = null, totalCost = null;
        if (visited.has(end)) {
            finalPath = reconstructPath(parent, start, end);
            totalCost = dist.get(end);
            steps.push(buildSnapshot(visited, new Set(), end, parent, finalPath, totalCost));
        }
        return steps;
    }

    function computeStepsAStar(start, end) {
        const adj = buildAdjacency();
        const steps = [];
        const gScore = new Map();
        const fScore = new Map();
        const parent = new Map();
        const visited = new Set();
        for (let n of nodes) { gScore.set(n.id, Infinity); fScore.set(n.id, Infinity); }
        gScore.set(start, 0);
        fScore.set(start, heuristic(start, end));
        const openSet = [{ id: start, f: fScore.get(start) }];
        parent.set(start, null);
        while (openSet.length) {
            openSet.sort((a,b) => a.f - b.f);
            const { id: cur } = openSet.shift();
            if (visited.has(cur)) continue;
            visited.add(cur);
            const frontierSet = new Set(openSet.map(o => o.id).filter(id => !visited.has(id)));
            steps.push(buildSnapshot(visited, frontierSet, cur, parent, null, null));
            if (cur === end) break;
            for (let nei of adj[cur] || []) {
                const tentative = gScore.get(cur) + nei.weight;
                if (tentative < gScore.get(nei.node)) {
                    parent.set(nei.node, cur);
                    gScore.set(nei.node, tentative);
                    const h = heuristic(nei.node, end);
                    fScore.set(nei.node, tentative + h);
                    openSet.push({ id: nei.node, f: fScore.get(nei.node) });
                }
            }
        }
        let finalPath = null, totalCost = null;
        if (visited.has(end)) {
            finalPath = reconstructPath(parent, start, end);
            totalCost = gScore.get(end);
            steps.push(buildSnapshot(visited, new Set(), end, parent, finalPath, totalCost));
        }
        return steps;
    }

    // helpers
    function buildAdjacency() {
        const adj = {};
        for (let n of nodes) adj[n.id] = [];
        for (let e of edges) {
            adj[e.from].push({ node: e.to, weight: e.weight });
            adj[e.to].push({ node: e.from, weight: e.weight });
        }
        return adj;
    }
    function reconstructPath(parentMap, start, end) {
        let path = [];
        let cur = end;
        while (cur !== undefined && cur !== null) {
            path.unshift(cur);
            if (cur === start) break;
            cur = parentMap.get(cur);
        }
        if (path[0] !== start) return [];
        return path;
    }
    function computePathCost(path) {
        if (!path.length) return 0;
        let cost = 0;
        for (let i = 0; i < path.length-1; i++) {
            const from = path[i], to = path[i+1];
            const edge = edges.find(e => (e.from===from && e.to===to) || (e.from===to && e.to===from));
            if (edge) cost += edge.weight;
        }
        return cost;
    }
    function heuristic(nodeA, nodeB) {
        const a = nodes.find(n=>n.id===nodeA);
        const b = nodes.find(n=>n.id===nodeB);
        if (!a || !b) return 0;
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    // compute steps for selected algo and store snapshots
    function computeAndStoreSteps() {
        if (nodes.length === 0) { alert("No graph nodes! Add nodes first."); return; }
        if (startNode === null || endNode === null) { alert("Please set Start and Goal nodes."); return; }
        const algo = document.getElementById("algoSelect").value;
        let steps = [];
        if (algo === "bfs") steps = computeStepsBFS(startNode, endNode);
        else if (algo === "dfs") steps = computeStepsDFS(startNode, endNode);
        else if (algo === "dijkstra") steps = computeStepsDijkstra(startNode, endNode);
        else if (algo === "astar") steps = computeStepsAStar(startNode, endNode);
        if (steps.length === 0) steps.push(buildSnapshot(new Set(), new Set(), null, new Map()));
        stepSnapshots = steps;
        currentStepIndex = 0;
        computedAlgo = algo;
        updateStepControls();
        applyStepToCanvas(currentStepIndex);
        // update stats panel
        const lastStep = stepSnapshots[stepSnapshots.length-1];
        const visitedCount = lastStep.visitedSet.size;
        const pathCost = lastStep.totalCost !== undefined ? lastStep.totalCost : (lastStep.finalPath ? computePathCost(lastStep.finalPath) : null);
        const pathLen = lastStep.finalPath ? lastStep.finalPath.length-1 : 0;
        document.getElementById("statsPanel").innerHTML = `📊 <strong>Algorithm:</strong> ${algo.toUpperCase()} &nbsp;| 🧭 <strong>Visited nodes:</strong> ${visitedCount} &nbsp;| 🎯 <strong>Path cost:</strong> ${pathCost !== null ? pathCost : '—'} &nbsp;| 📏 <strong>Path length:</strong> ${pathLen>0 ? pathLen : '—'}`;
    }

    function applyStepToCanvas(index) {
        if (!stepSnapshots.length || index < 0 || index >= stepSnapshots.length) return;
        const step = stepSnapshots[index];
        drawGraph(step);
        const total = stepSnapshots.length;
        document.getElementById("stepCounter").innerText = `Step ${index+1} / ${total}`;
    }

    function updateStepControls() {
        const hasSteps = stepSnapshots.length > 0;
        document.getElementById("stepPrevBtn").disabled = !hasSteps || currentStepIndex <= 0;
        document.getElementById("stepNextBtn").disabled = !hasSteps || currentStepIndex >= stepSnapshots.length-1;
        document.getElementById("resetStepsBtn").disabled = !hasSteps;
    }

    function nextStep() {
        if (stepSnapshots.length && currentStepIndex < stepSnapshots.length-1) {
            currentStepIndex++;
            applyStepToCanvas(currentStepIndex);
            updateStepControls();
        }
    }
    function prevStep() {
        if (stepSnapshots.length && currentStepIndex > 0) {
            currentStepIndex--;
            applyStepToCanvas(currentStepIndex);
            updateStepControls();
        }
    }
    function resetSteps() {
        if (stepSnapshots.length) {
            currentStepIndex = 0;
            applyStepToCanvas(0);
            updateStepControls();
        }
    }

    // ----- canvas interaction (mode based)-----
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        return { x: mouseX, y: mouseY };
    }
    function findNodeAt(px, py) {
        for (let n of nodes) {
            const dx = n.x - px, dy = n.y - py;
            if (Math.hypot(dx, dy) < 18) return n.id;
        }
        return null;
    }
    canvas.addEventListener('click', (e) => {
        const { x, y } = getMousePos(e);
        if (currentMode === "addNode") {
            addNodeAt(x, y);
        } else if (currentMode === "addEdge") {
            const nodeId = findNodeAt(x, y);
            if (nodeId === null) { pendingEdgeSource = null; return; }
            if (pendingEdgeSource === null) {
                pendingEdgeSource = nodeId;
                alert(`Source node ${nodeId} selected. Now click target node.`);
            } else {
                if (pendingEdgeSource === nodeId) { pendingEdgeSource = null; alert("Same node, edge cancelled"); return; }
                let weight = prompt("Edge weight (1-20):", "3");
                if (weight && !isNaN(weight)) addEdge(pendingEdgeSource, nodeId, parseInt(weight));
                pendingEdgeSource = null;
            }
        } else if (currentMode === "setStart") {
            const nid = findNodeAt(x, y);
            if (nid !== null) setStartNode(nid);
        } else if (currentMode === "setEnd") {
            const nid = findNodeAt(x, y);
            if (nid !== null) setEndNode(nid);
        }
        // after any action, clear step snapshots
        stepSnapshots = [];
        currentStepIndex = -1;
        document.getElementById("stepPrevBtn").disabled = true;
        document.getElementById("stepNextBtn").disabled = true;
        document.getElementById("resetStepsBtn").disabled = true;
        document.getElementById("stepCounter").innerText = "Step 0 / 0";
    });

    // mode buttons style
    function setMode(mode) {
        currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active-mode'));
        if (mode === 'addNode') document.getElementById('modeAddNode').classList.add('active-mode');
        if (mode === 'addEdge') document.getElementById('modeAddEdge').classList.add('active-mode');
        if (mode === 'setStart') document.getElementById('modeSetStart').classList.add('active-mode');
        if (mode === 'setEnd') document.getElementById('modeSetEnd').classList.add('active-mode');
        pendingEdgeSource = null;
    }

    document.getElementById('modeAddNode').onclick = () => setMode('addNode');
    document.getElementById('modeAddEdge').onclick = () => setMode('addEdge');
    document.getElementById('modeSetStart').onclick = () => setMode('setStart');
    document.getElementById('modeSetEnd').onclick = () => setMode('setEnd');
    document.getElementById('clearGraphBtn').onclick = clearGraph;
    document.getElementById('randomGraphBtn').onclick = () => { generateComplexRandom(); stepSnapshots=[]; currentStepIndex=-1; updateStepControls(); };
    document.getElementById('resetStartEndBtn').onclick = resetStartEndToFirstLast;
    document.getElementById('centerViewBtn').onclick = () => refreshCanvas();
    document.getElementById('computeStepsBtn').onclick = computeAndStoreSteps;
    document.getElementById('stepPrevBtn').onclick = prevStep;
    document.getElementById('stepNextBtn').onclick = nextStep;
    document.getElementById('resetStepsBtn').onclick = resetSteps;

    // initial random complex graph to show off
    generateComplexRandom();
    updateCounters();
    refreshCanvas();
