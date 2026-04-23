    // ---------- GLOBAL STATE ----------
    let array = [];               // shared array
    let stopFlag = false;        // for auto race
    const VISUAL_SPEED = 320;
    
    // Step state for each side: { stepsList: [], currentStep: -1, targetValue: number, algoName: string, finished: false, foundIndex: -1 }
    let leftStepState = { steps: [], currentIdx: -1, target: null, algo: null, finished: false, foundPos: -1 };
    let rightStepState = { steps: [], currentIdx: -1, target: null, algo: null, finished: false, foundPos: -1 };
    
    // Explanation library
    const explanations = {
        sequential: { comp: "O(n)", desc: "Linear scan. Works on unsorted. Checks each element." },
        binary: { comp: "O(log n)", desc: "Repeatedly halves interval. Requires sorted array." },
        jump: { comp: "O(√n)", desc: "Jumps by √n then linear. Needs sorted." },
        interpolation: { comp: "O(log log n)", desc: "Formula-based position guess. Sorted & uniform data ideal." }
    };
    
    // ---------- Helper: draw arrays ----------
    function draw(containerId, activeIdx = -1, foundIdx = -1) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";
        if (!array.length) {
            const msg = document.createElement("div");
            msg.innerText = "⚠️ No data";
            msg.style.padding = "20px";
            container.appendChild(msg);
            return;
        }
        array.forEach((val, i) => {
            const box = document.createElement("div");
            box.className = "box";
            box.innerText = val;
            if (i === activeIdx) box.classList.add("active");
            if (i === foundIdx) box.classList.add("found");
            container.appendChild(box);
        });
    }
    
    function refreshBoth(activeLeft = -1, foundLeft = -1, activeRight = -1, foundRight = -1) {
        draw("leftArray", activeLeft, foundLeft);
        draw("rightArray", activeRight, foundRight);
    }
    
    // ---------- STEP GENERATORS (yield each step: {activeIndex, found?}) ----------
    function* stepGeneratorSequential(target, sortedFlag) {
        for (let i = 0; i < array.length; i++) {
            yield { active: i, found: (array[i] === target) };
            if (array[i] === target) return;
            if (sortedFlag && array[i] > target) break;
        }
    }
    
    function* stepGeneratorBinary(target) {
        let l = 0, r = array.length - 1;
        while (l <= r) {
            let m = Math.floor((l + r) / 2);
            yield { active: m, found: (array[m] === target) };
            if (array[m] === target) return;
            if (array[m] < target) l = m + 1;
            else r = m - 1;
        }
    }
    
    function* stepGeneratorJump(target) {
        let n = array.length;
        let step = Math.floor(Math.sqrt(n));
        let prev = 0;
        // jumping phase
        while (array[Math.min(step, n) - 1] < target) {
            let jumpIdx = Math.min(step, n) - 1;
            yield { active: jumpIdx, found: false };
            prev = step;
            step += Math.floor(Math.sqrt(n));
            if (prev >= n) return;
        }
        // linear search in block
        for (let i = prev; i < Math.min(step, n); i++) {
            yield { active: i, found: (array[i] === target) };
            if (array[i] === target) return;
        }
    }
    
    function* stepGeneratorInterpolation(target) {
        let lo = 0, hi = array.length - 1;
        while (lo <= hi && target >= array[lo] && target <= array[hi]) {
            if (array[hi] === array[lo]) {
                if (array[lo] === target) yield { active: lo, found: true };
                else yield { active: lo, found: false };
                return;
            }
            let pos = lo + Math.floor(((target - array[lo]) * (hi - lo)) / (array[hi] - array[lo]));
            pos = Math.min(Math.max(pos, lo), hi);
            yield { active: pos, found: (array[pos] === target) };
            if (array[pos] === target) return;
            if (array[pos] < target) lo = pos + 1;
            else hi = pos - 1;
        }
    }
    
    // Build step list for given side (left/right) based on current array, target, algorithm
    function buildStepList(side) {
        const algoSelect = document.getElementById(side + "Algo");
        const algo = algoSelect.value;
        const target = Number(document.getElementById("target").value);
        if (isNaN(target)) return [];
        const sortedFlag = document.getElementById("isSorted").checked;
        // early validation: if algorithm needs sorted but array not sorted -> empty list (invalid)
        if (algo !== "sequential" && !sortedFlag) {
            return null; // invalid
        }
        let generator;
        if (algo === "sequential") generator = stepGeneratorSequential(target, sortedFlag);
        else if (algo === "binary") generator = stepGeneratorBinary(target);
        else if (algo === "jump") generator = stepGeneratorJump(target);
        else if (algo === "interpolation") generator = stepGeneratorInterpolation(target);
        else return [];
        
        const steps = [];
        let stepResult;
        while (!(stepResult = generator.next()).done) {
            steps.push(stepResult.value);
        }
        return steps;
    }
    
    // Refresh step state for a side (rebuild steps, reset to beginning)
    function resetStepSide(side) {
        const state = (side === 'left') ? leftStepState : rightStepState;
        const target = Number(document.getElementById("target").value);
        const algo = document.getElementById(side + "Algo").value;
        const sortedFlag = document.getElementById("isSorted").checked;
        // check sorted requirement
        if (algo !== "sequential" && !sortedFlag) {
            // cannot step because algorithm needs sorted array
            state.steps = [];
            state.currentIdx = -1;
            state.finished = false;
            state.foundPos = -1;
            state.algo = algo;
            state.target = target;
            // update visual display: show error message inside panel maybe
            draw(side + "Array", -1, -1);
            document.getElementById(side + "StepDisplay").innerText = "0";
            // show a small temporary alert on status area
            const winnerDiv = document.getElementById("winner");
            if (winnerDiv.innerText.includes("SORTED")) {} else {
                winnerDiv.innerHTML = `⚠️ ${algo.toUpperCase()} requires SORTED array! Enable "Sorted Array" or click "SORT CURRENT"`;
                setTimeout(() => { if(winnerDiv.innerHTML.includes("SORTED")) winnerDiv.innerHTML = "🏆 Ready for step or race"; }, 2000);
            }
            return;
        }
        const steps = buildStepList(side);
        if (!steps) {
            state.steps = [];
            state.currentIdx = -1;
            draw(side + "Array", -1, -1);
            document.getElementById(side + "StepDisplay").innerText = "0";
            return;
        }
        state.steps = steps;
        state.currentIdx = -1;   // no step shown yet
        state.finished = false;
        state.foundPos = -1;
        state.algo = algo;
        state.target = target;
        // clear highlight
        draw(side + "Array", -1, -1);
        document.getElementById(side + "StepDisplay").innerText = "0";
    }
    
    // Apply current step for a side (update visuals and step counter)
    function applyStepVisual(side) {
        const state = (side === 'left') ? leftStepState : rightStepState;
        const stepCountSpan = document.getElementById(side + "StepDisplay");
        if (!state.steps.length || state.currentIdx < 0) {
            draw(side + "Array", -1, -1);
            stepCountSpan.innerText = "0";
            return;
        }
        const step = state.steps[state.currentIdx];
        const activeIdx = step.active;
        const isFound = step.found;
        let foundIdx = -1;
        if (isFound) {
            foundIdx = activeIdx;
            state.foundPos = activeIdx;
            state.finished = true;
        }
        draw(side + "Array", activeIdx, foundIdx);
        stepCountSpan.innerText = (state.currentIdx + 1).toString();
        // if last step and not found, finished flag
        if (state.currentIdx === state.steps.length - 1 && !isFound) {
            state.finished = true;
        }
        if (isFound) state.finished = true;
    }
    
    // Next step
    function stepSideNext(side) {
        const state = (side === 'left') ? leftStepState : rightStepState;
        const algo = document.getElementById(side + "Algo").value;
        const sortedFlag = document.getElementById("isSorted").checked;
        if (algo !== "sequential" && !sortedFlag) {
            document.getElementById("winner").innerHTML = `❌ ${algo.toUpperCase()} needs sorted array! Enable checkbox or click SORT.`;
            setTimeout(() => { if(document.getElementById("winner").innerHTML.includes("needs sorted")) document.getElementById("winner").innerHTML = "🏆 Ready"; }, 1800);
            return;
        }
        // if steps empty or outdated (array changed etc) -> rebuild
        if (!state.steps.length || state.algo !== algo || state.target !== Number(document.getElementById("target").value)) {
            resetStepSide(side);
            // after reset, state may be empty if invalid
            if (!leftStepState.steps.length && side==='left') return;
            if (!rightStepState.steps.length && side==='right') return;
        }
        // refresh state reference after possible reset
        const newState = (side === 'left') ? leftStepState : rightStepState;
        if (!newState.steps.length) return;
        if (newState.finished && newState.currentIdx >= 0 && newState.currentIdx < newState.steps.length-1) {
            // already finished but allow navigation? disable next if finished & at final step
            if (newState.currentIdx === newState.steps.length-1) return;
        }
        if (newState.currentIdx + 1 < newState.steps.length) {
            newState.currentIdx++;
            applyStepVisual(side);
        } else {
            // reached end
            if (newState.steps.length > 0 && newState.currentIdx === newState.steps.length-1) {
                // already at last
                return;
            }
        }
    }
    
    // Previous step
    function stepSidePrev(side) {
        const state = (side === 'left') ? leftStepState : rightStepState;
        const algo = document.getElementById(side + "Algo").value;
        const sortedFlag = document.getElementById("isSorted").checked;
        if (algo !== "sequential" && !sortedFlag) {
            document.getElementById("winner").innerHTML = `❌ ${algo.toUpperCase()} needs sorted array.`;
            setTimeout(() => {}, 1000);
            return;
        }
        if (!state.steps.length || state.algo !== algo || state.target !== Number(document.getElementById("target").value)) {
            resetStepSide(side);
            if (!leftStepState.steps.length && side==='left') return;
            if (!rightStepState.steps.length && side==='right') return;
        }
        const newState = (side === 'left') ? leftStepState : rightStepState;
        if (newState.currentIdx > 0) {
            newState.currentIdx--;
            // remove finished flag if going back
            newState.finished = false;
            applyStepVisual(side);
        } else if (newState.currentIdx === 0) {
            // can't go below zero
        } else {
            // if no steps yet, show nothing
        }
    }
    
    // Global reset for both sides (when array changes)
    function resetBothStepStates() {
        resetStepSide('left');
        resetStepSide('right');
    }
    
    // ---------- AUTO RACE (original functionality, but updated to respect step states) ----------
    async function runAlgoRace(algoName, containerId, target, stepsCounter, stepElement) {
        const sortedFlag = document.getElementById("isSorted").checked;
        if (algoName !== "sequential" && !sortedFlag) return -2;
        const n = array.length;
        if (algoName === "sequential") {
            for (let i = 0; i < n && !stopFlag; i++) {
                stepsCounter.count++;
                stepElement.innerText = stepsCounter.count;
                draw(containerId, i, -1);
                await new Promise(r => setTimeout(r, VISUAL_SPEED));
                if (array[i] === target) { draw(containerId, i, i); return i; }
                if (sortedFlag && array[i] > target) break;
            }
            return -1;
        } else if (algoName === "binary") {
            let l = 0, r = n-1;
            while (l <= r && !stopFlag) {
                let m = Math.floor((l+r)/2);
                stepsCounter.count++; stepElement.innerText = stepsCounter.count;
                draw(containerId, m, -1);
                await new Promise(r => setTimeout(r, VISUAL_SPEED));
                if (array[m] === target) { draw(containerId, m, m); return m; }
                if (array[m] < target) l = m+1; else r = m-1;
            }
            return -1;
        } else if (algoName === "jump") {
            let step = Math.floor(Math.sqrt(n)), prev = 0;
            while (array[Math.min(step, n)-1] < target && !stopFlag) {
                stepsCounter.count++; stepElement.innerText = stepsCounter.count;
                draw(containerId, Math.min(step, n)-1, -1);
                await new Promise(r => setTimeout(r, VISUAL_SPEED));
                prev = step; step += Math.floor(Math.sqrt(n));
                if (prev >= n) return -1;
            }
            for (let i = prev; i < Math.min(step, n) && !stopFlag; i++) {
                stepsCounter.count++; stepElement.innerText = stepsCounter.count;
                draw(containerId, i, -1);
                await new Promise(r => setTimeout(r, VISUAL_SPEED));
                if (array[i] === target) { draw(containerId, i, i); return i; }
            }
            return -1;
        } else if (algoName === "interpolation") {
            let lo = 0, hi = n-1;
            while (lo <= hi && target >= array[lo] && target <= array[hi] && !stopFlag) {
                let pos = lo + Math.floor(((target - array[lo]) * (hi - lo)) / (array[hi] - array[lo]));
                pos = Math.min(Math.max(pos, lo), hi);
                stepsCounter.count++; stepElement.innerText = stepsCounter.count;
                draw(containerId, pos, -1);
                await new Promise(r => setTimeout(r, VISUAL_SPEED));
                if (array[pos] === target) { draw(containerId, pos, pos); return pos; }
                if (array[pos] < target) lo = pos+1; else hi = pos-1;
            }
            return -1;
        }
        return -1;
    }
    
    async function startBattle() {
        if (!array.length) { document.getElementById("winner").innerHTML = "⚠️ No array! Generate random or custom."; return; }
        stopFlag = false;
        const target = Number(document.getElementById("target").value);
        if (isNaN(target)) { document.getElementById("winner").innerHTML = "❌ Invalid target"; return; }
        const leftAlgo = document.getElementById("leftAlgo").value;
        const rightAlgo = document.getElementById("rightAlgo").value;
        const leftName = document.getElementById("leftAlgo").options[document.getElementById("leftAlgo").selectedIndex].text;
        const rightName = document.getElementById("rightAlgo").options[document.getElementById("rightAlgo").selectedIndex].text;
        document.getElementById("leftStepDisplay").innerText = "0";
        document.getElementById("rightStepDisplay").innerText = "0";
        document.getElementById("winner").innerHTML = "⚔️ RACING ... ⚔️";
        draw("leftArray", -1, -1); draw("rightArray", -1, -1);
        const leftSteps = { count: 0 }, rightSteps = { count: 0 };
        const leftPromise = runAlgoRace(leftAlgo, "leftArray", target, leftSteps, document.getElementById("leftStepDisplay"));
        const rightPromise = runAlgoRace(rightAlgo, "rightArray", target, rightSteps, document.getElementById("rightStepDisplay"));
        const [lRes, rRes] = await Promise.all([leftPromise, rightPromise]);
        if (stopFlag) { document.getElementById("winner").innerHTML = "🛑 Race stopped (array changed)"; return; }
        if (lRes === -2 || rRes === -2) {
            document.getElementById("winner").innerHTML = "❌ SORTED ARRAY NEEDED! Enable 'Sorted Array' or sort current.";
            return;
        }
        const leftFound = lRes !== -1, rightFound = rRes !== -1;
        if (!leftFound && !rightFound) document.getElementById("winner").innerHTML = `🔍 ${target} NOT FOUND.`;
        else if (leftFound && !rightFound) document.getElementById("winner").innerHTML = `🏆 ${leftName.toUpperCase()} WINS! (${leftSteps.count} steps)`;
        else if (rightFound && !leftFound) document.getElementById("winner").innerHTML = `🏆 ${rightName.toUpperCase()} WINS! (${rightSteps.count} steps)`;
        else {
            if (leftSteps.count < rightSteps.count) document.getElementById("winner").innerHTML = `🏆 ${leftName.toUpperCase()} WINS! (${leftSteps.count} vs ${rightSteps.count})`;
            else if (rightSteps.count < leftSteps.count) document.getElementById("winner").innerHTML = `🏆 ${rightName.toUpperCase()} WINS! (${rightSteps.count} vs ${leftSteps.count})`;
            else document.getElementById("winner").innerHTML = `🤝 DRAW! Both ${leftSteps.count} steps.`;
        }
        // after race, sync step states maybe but keep step mode independent: reset step states to avoid confusion
        resetBothStepStates();
    }
    
    // ---------- Array management ----------
    function generateArray() {
        stopFlag = true;
        array = [];
        const sorted = document.getElementById("isSorted").checked;
        for (let i=0; i<20; i++) array.push(Math.floor(Math.random() * 90) + 10);
        if (sorted) array.sort((a,b)=>a-b);
        refreshBoth(-1,-1,-1,-1);
        document.getElementById("leftStepDisplay").innerText = "0";
        document.getElementById("rightStepDisplay").innerText = "0";
        document.getElementById("winner").innerHTML = "✨ New array ready. Step or race!";
        resetBothStepStates();
    }
    
    function setCustomArray() {
        stopFlag = true;
        const raw = document.getElementById("customArrayInput").value;
        if (!raw.trim()) { document.getElementById("customArrayStatus").innerHTML = "❌ Enter numbers"; return; }
        let parts = raw.split(",").map(p=>p.trim()).filter(p=>p!=="");
        let nums = [];
        for (let p of parts) { let n = Number(p); if(isNaN(n)) { alert("Invalid number: "+p); return; } nums.push(n); }
        if(nums.length===0) return;
        array = [...nums];
        const sortedFlag = document.getElementById("isSorted").checked;
        if(sortedFlag) array.sort((a,b)=>a-b);
        refreshBoth(-1,-1,-1,-1);
        document.getElementById("leftStepDisplay").innerText = "0";
        document.getElementById("rightStepDisplay").innerText = "0";
        document.getElementById("winner").innerHTML = "📌 Custom array loaded!";
        document.getElementById("customArrayStatus").innerHTML = `✅ ${array.length} values`;
        setTimeout(()=>{document.getElementById("customArrayStatus").innerHTML="✨ ready";},1500);
        resetBothStepStates();
    }
    
    function sortCurrentArray() {
        if(!array.length) return;
        stopFlag = true;
        array.sort((a,b)=>a-b);
        document.getElementById("isSorted").checked = true;
        refreshBoth(-1,-1,-1,-1);
        document.getElementById("winner").innerHTML = "🔽 Array sorted.";
        resetBothStepStates();
    }
    
    function updateExplanation(side) {
        const select = document.getElementById(side+"Algo");
        const val = select.value;
        const info = explanations[val];
        document.getElementById(side+"Title").innerText = select.options[select.selectedIndex].text;
        document.getElementById(side+"Comp").innerText = "Complexity: " + info.comp;
        document.getElementById(side+"Explain").innerText = info.desc;
        document.getElementById(side+"DisplayTitle").innerText = select.options[select.selectedIndex].text.toUpperCase();
        resetStepSide(side);
    }
    
    function goBack() { window.history.back(); }
    
    // initialization
    generateArray();
    updateExplanation("left");
    updateExplanation("right");
    resetBothStepStates();
