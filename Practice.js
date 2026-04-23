    const levels = [
    // --- SORTING ALGORITHMS (01-10) ---
    { name: "Bubble_Sort", ans: "O(n²)", opts: ["O(n)", "O(n log n)", "O(n²)", "O(1)"], code: [{t: "for(i=0; i<n-1; i++)", p:0}, {t: "for(j=0; j<n-i-1; j++)", p:1}, {t: "if(a[j] > a[j+1]) swap(a[j], a[j+1])", p:2}]},
    { name: "Selection_Sort", ans: "O(n²)", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], code: [{t: "for(i=0; i<n-1; i++) { min_idx = i;", p:0}, {t: "for(j=i+1; j<n; j++) if(a[j] < a[min_idx]) min_idx = j;", p:1}, {t: "swap(a[min_idx], a[i]); }", p:2}]},
    { name: "Insertion_Sort", ans: "O(n²)", opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"], code: [{t: "for(i=1; i<n; i++) { key = a[i]; j = i-1;", p:0}, {t: "while(j >= 0 && a[j] > key) { a[j+1] = a[j]; j--; }", p:1}, {t: "a[j+1] = key; }", p:2}]},
    { name: "Merge_Sort_Divide", ans: "O(n log n)", opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], code: [{t: "if(l < r) { mid = l + (r-l)/2;", p:0}, {t: "mergeSort(a, l, mid); mergeSort(a, mid+1, r);", p:1}, {t: "merge(a, l, mid, r); }", p:2}]},
    { name: "Quick_Sort_Partition", ans: "O(n log n)", opts: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], code: [{t: "pivot = a[high]; i = low - 1;", p:0}, {t: "for(j=low; j<high; j++) if(a[j]<pivot) { i++; swap(a[i], a[j]); }", p:1}, {t: "swap(a[i+1], a[high]); return i+1;", p:2}]},
    { name: "Heapify_Logic", ans: "O(log n)", opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], code: [{t: "largest = i; l = 2*i+1; r = 2*i+2;", p:0}, {t: "if(l<n && a[l]>a[largest]) largest=l;", p:1}, {t: "if(largest != i) { swap(a[i], a[largest]); heapify(a, n, largest); }", p:2}]},
    { name: "Shell_Sort", ans: "O(n log² n)", opts: ["O(n²)", "O(n log² n)", "O(n)", "O(1)"], code: [{t: "for(gap = n/2; gap > 0; gap /= 2)", p:0}, {t: "for(i = gap; i < n; i++) { temp = a[i];", p:1}, {t: "for(j=i; j>=gap && a[j-gap]>temp; j-=gap) a[j]=a[j-gap]; a[j]=temp; }", p:2}]},
    { name: "Counting_Sort", ans: "O(n+k)", opts: ["O(n log n)", "O(n+k)", "O(n²)", "O(k)"], code: [{t: "for(x : a) count[x]++;", p:0}, {t: "for(i=1; i<=k; i++) count[i] += count[i-1];", p:1}, {t: "for(i=n-1; i>=0; i--) { out[count[a[i]]-1] = a[i]; count[a[i]]--; }", p:2}]},
    { name: "Bucket_Sort", ans: "O(n+k)", opts: ["O(n²)", "O(n+k)", "O(n log n)", "O(k)"], code: [{t: "for(x : a) buckets[n*x].push(x);", p:0}, {t: "for(b : buckets) sort(b);", p:1}, {t: "for(b : buckets) for(x : b) out.push(x);", p:2}]},
    { name: "Radix_Sort", ans: "O(nk)", opts: ["O(n log n)", "O(nk)", "O(n²)", "O(k)"], code: [{t: "max_val = get_max(a);", p:0}, {t: "for(exp=1; max_val/exp > 0; exp*=10)", p:1}, {t: "countingSort(a, exp);", p:2}]},
    // --- SEARCHING ALGORITHMS (11-20) ---
    { name: "Linear_Search", ans: "O(n)", opts: ["O(1)", "O(log n)", "O(n)", "O(n²)"], code: [{t: "for(i=0; i<n; i++)", p:0}, {t: "if(a[i] == target) return i;", p:1}, {t: "return -1;", p:2}]},
    { name: "Binary_Search", ans: "O(log n)", opts: ["O(n)", "O(log n)", "O(vn)", "O(1)"], code: [{t: "while(l <= r) { m = l+(r-l)/2;", p:0}, {t: "if(a[m] == target) return m;", p:1}, {t: "a[m] < target ? l=m+1 : r=m-1; }", p:2}]},
    { name: "Jump_Search", ans: "O(vn)", opts: ["O(log n)", "O(vn)", "O(n)", "O(1)"], code: [{t: "step = sqrt(n); prev = 0;", p:0}, {t: "while(a[min(step,n)-1] < target) { prev = step; step += sqrt(n); }", p:1}, {t: "while(a[prev] < target) { prev++; if(prev == min(step,n)) return -1; }", p:2}]},
    { name: "Interpolation_Search", ans: "O(log log n)", opts: ["O(log n)", "O(log log n)", "O(n)", "O(1)"], code: [{t: "pos = l + ((target-a[l])*(r-l) / (a[r]-a[l]));", p:0}, {t: "if(a[pos] == target) return pos;", p:1}, {t: "a[pos] < target ? l=pos+1 : r=pos-1;", p:2}]},
    { name: "Exponential_Search", ans: "O(log n)", opts: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], code: [{t: "if(a[0] == target) return 0; i = 1;", p:0}, {t: "while(i < n && a[i] <= target) i *= 2;", p:1}, {t: "return binarySearch(a, i/2, min(i, n-1), target);", p:2}]},
    { name: "Ternary_Search", ans: "O(log3 n)", opts: ["O(log n)", "O(log3 n)", "O(n)", "O(n²)"], code: [{t: "m1 = l + (r-l)/3; m2 = r - (r-l)/3;", p:0}, {t: "if(target == a[m1]) return m1; if(target == a[m2]) return m2;", p:1}, {t: "target < a[m1] ? r=m1-1 : (target > a[m2] ? l=m2+1 : (l=m1+1, r=m2-1));", p:2}]},
    { name: "Fibonacci_Search", ans: "O(log n)", opts: ["O(n)", "O(log n)", "O(vn)", "O(1)"], code: [{t: "while(fibM > 1) { i = min(offset + fibM2, n-1);", p:0}, {t: "if(a[i] < target) { fibM=fibM1; fibM1=fibM2; fibM2=fibM-fibM1; offset=i; }", p:1}, {t: "else if(a[i] > target) { fibM=fibM2; fibM1=fibM1-fibM2; fibM2=fibM-fibM1; } else return i; }", p:2}]},
    { name: "BFS_Grid_Search", ans: "O(V+E)", opts: ["O(V)", "O(V+E)", "O(E)", "O(1)"], code: [{t: "q.push(start); visited[start]=true;", p:0}, {t: "while(!q.empty()) { curr = q.pop();", p:1}, {t: "for(neighbor : adj[curr]) if(!visited[neighbor]) { visited[neighbor]=true; q.push(neighbor); } }", p:2}]},
    { name: "DFS_Recursion", ans: "O(V+E)", opts: ["O(V)", "O(V+E)", "O(E)", "O(V*E)"], code: [{t: "visited[u] = true;", p:0}, {t: "for(v : adj[u])", p:1}, {t: "if(!visited[v]) DFS(v);", p:2}]},
    { name: "Sublist_Search", ans: "O(n*m)", opts: ["O(n+m)", "O(n*m)", "O(n log m)", "O(1)"], code: [{t: "ptr1 = first; ptr2 = second;", p:0}, {t: "while(ptr2 != null) { temp = ptr2;", p:1}, {t: "while(ptr1 != null && temp != null && ptr1.data == temp.data) { ptr1=ptr1.next; temp=temp.next; }", p:2}]},
    // --- DATA STRUCTURES (21-30) ---
    { name: "Reverse_Linked_List", ans: "O(n)", opts: ["O(1)", "O(n)", "O(n²)", "O(log n)"], code: [{t: "prev = null; curr = head;", p:0}, {t: "while(curr != null) { next = curr.next; curr.next = prev;", p:1}, {t: "prev = curr; curr = next; } return prev;", p:2}]},
    { name: "Detect_Loop_Floyd", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(1)", "O(log n)"], code: [{t: "slow = head; fast = head;", p:0}, {t: "while(fast && fast.next) { slow=slow.next; fast=fast.next.next;", p:1}, {t: "if(slow == fast) return true; } return false;", p:2}]},
    { name: "Stack_Push_Array", ans: "O(1)", opts: ["O(1)", "O(n)", "O(n²)", "O(log n)"], code: [{t: "if(top >= size-1) return overflow;", p:0}, {t: "top++;", p:1}, {t: "a[top] = val;", p:2}]},
    { name: "Queue_Enqueue_Array", ans: "O(1)", opts: ["O(1)", "O(n)", "O(log n)", "O(n²)"], code: [{t: "if(rear == size-1) return overflow;", p:0}, {t: "rear++;", p:1}, {t: "a[rear] = val;", p:2}]},
    { name: "BST_Insert", ans: "O(h)", opts: ["O(n)", "O(h)", "O(1)", "O(log n)"], code: [{t: "if(root == null) return new Node(val);", p:0}, {t: "if(val < root.val) root.left = insert(root.left, val);", p:1}, {t: "else root.right = insert(root.right, val); return root;", p:2}]},
    { name: "Inorder_Traversal", ans: "O(n)", opts: ["O(n)", "O(h)", "O(log n)", "O(1)"], code: [{t: "if(node == null) return;", p:0}, {t: "inorder(node.left);", p:1}, {t: "process(node.val); inorder(node.right);", p:2}]},
    { name: "Level_Order_Tree", ans: "O(n)", opts: ["O(n)", "O(h)", "O(log n)", "O(n²)"], code: [{t: "q.push(root);", p:0}, {t: "while(!q.empty()) { curr = q.pop(); process(curr);", p:1}, {t: "if(curr.left) q.push(curr.left); if(curr.right) q.push(curr.right); }", p:2}]},
    { name: "Max_Heap_Insert", ans: "O(log n)", opts: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], code: [{t: "size++; a[size-1] = val; i = size-1;", p:0}, {t: "while(i != 0 && a[parent(i)] < a[i]) {", p:1}, {t: "swap(a[i], a[parent(i)]); i = parent(i); }", p:2}]},
    { name: "Priority_Queue_Pop", ans: "O(log n)", opts: ["O(1)", "O(n)", "O(log n)", "O(h)"], code: [{t: "root = a[0]; a[0] = a[size-1]; size--;", p:0}, {t: "heapify(0);", p:1}, {t: "return root;", p:2}]},
    { name: "Check_Balanced_Tree", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"], code: [{t: "if(node == null) return 0;", p:0}, {t: "lh = check(node.left); rh = check(node.right);", p:1}, {t: "if(lh==-1 || rh==-1 || abs(lh-rh)>1) return -1; return max(lh,rh)+1;", p:2}]},
    // --- ARRAY MANIPULATION (31-40) ---
    { name: "Kadane_Algorithm", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(n log n)", "O(1)"], code: [{t: "max_glob = a[0]; max_curr = a[0]", p:0}, {t: "for(i=1; i<n; i++)", p:1}, {t: "max_curr = max(a[i], max_curr + a[i]); max_glob = max(max_glob, max_curr);", p:2}]},
    { name: "Two_Sum_Sorted", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"], code: [{t: "l=0; r=n-1;", p:0}, {t: "while(l < r) { sum = a[l]+a[r];", p:1}, {t: "if(sum == target) return true; sum < target ? l++ : r--; }", p:2}]},
    { name: "Rotate_Array_Reversal", ans: "O(n)", opts: ["O(n)", "O(1)", "O(n*k)", "O(n²)"], code: [{t: "reverse(a, 0, k-1);", p:0}, {t: "reverse(a, k, n-1);", p:1}, {t: "reverse(a, 0, n-1);", p:2}]},
    { name: "Dutch_National_Flag", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(1)", "O(n log n)"], code: [{t: "low=0; mid=0; high=n-1;", p:0}, {t: "while(mid <= high) { if(a[mid]==0) { swap(a[low],a[mid]); low++; mid++; }", p:1}, {t: "else if(a[mid]==1) mid++; else { swap(a[mid],a[high]); high--; } }", p:2}]},
    { name: "Move_Zeroes_End", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(1)", "O(n log n)"], code: [{t: "count = 0;", p:0}, {t: "for(i=0; i<n; i++) if(a[i] != 0) a[count++] = a[i];", p:1}, {t: "while(count < n) a[count++] = 0;", p:2}]},
    { name: "Sliding_Window_Sum", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(k*n)", "O(1)"], code: [{t: "win_sum = sum(a, 0, k); max_sum = win_sum;", p:0}, {t: "for(i=k; i<n; i++) { win_sum += a[i] - a[i-k];", p:1}, {t: "max_sum = max(max_sum, win_sum); }", p:2}]},
    { name: "Find_Missing_Number", ans: "O(n)", opts: ["O(n)", "O(1)", "O(n²)", "O(log n)"], code: [{t: "total = n*(n+1)/2;", p:0}, {t: "arr_sum = sum(a);", p:1}, {t: "return total - arr_sum;", p:2}]},
    { name: "Prefix_Sum_Build", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(1)", "O(log n)"], code: [{t: "pref[0] = a[0];", p:0}, {t: "for(i=1; i<n; i++)", p:1}, {t: "pref[i] = pref[i-1] + a[i];", p:2}]},
    { name: "Trap_Rain_Water", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(1)", "O(log n)"], code: [{t: "l_max[0]=a[0]; r_max[n-1]=a[n-1];", p:0}, {t: "for(i=1; i<n; i++) l_max[i]=max(a[i], l_max[i-1]);", p:1}, {t: "for(i=n-2; i>=0; i--) r_max[i]=max(a[i], r_max[i+1]);", p:2}]},
    { name: "Majority_Element_Boyer", ans: "O(n)", opts: ["O(n)", "O(n²)", "O(n log n)", "O(1)"], code: [{t: "res = 0; count = 1;", p:0}, {t: "for(i=1; i<n; i++) { if(a[res] == a[i]) count++; else count--;", p:1}, {t: "if(count == 0) { res=i; count=1; } }", p:2}]},
    // --- DYNAMIC PROGRAMMING & GRAPHS (41-50) ---
    { name: "Fibonacci_DP", ans: "O(n)", opts: ["O(2^n)", "O(n)", "O(log n)", "O(n²)"], code: [{t: "f[0]=0; f[1]=1;", p:0}, {t: "for(i=2; i<=n; i++)", p:1}, {t: "f[i] = f[i-1] + f[i-2];", p:2}]},
    { name: "0/1_Knapsack_DP", ans: "O(n*W)", opts: ["O(2^n)", "O(n*W)", "O(n²)", "O(W)"], code: [{t: "for(i=1; i<=n; i++) for(w=1; w<=W; w++) {", p:0}, {t: "if(wt[i-1] <= w) dp[i][w] = max(val[i-1]+dp[i-1][w-wt[i-1]], dp[i-1][w]);", p:1}, {t: "else dp[i][w] = dp[i-1][w]; }", p:2}]},
    { name: "Longest_Common_Subseq", ans: "O(m*n)", opts: ["O(m*n)", "O(m+n)", "O(2^n)", "O(log n)"], code: [{t: "if(S1[i-1] == S2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];", p:0}, {t: "else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);", p:1}, {t: "return dp[m][n];", p:2}]},
    { name: "Dijkstra_Algorithm", ans: "O(E log V)", opts: ["O(V²)", "O(E log V)", "O(V+E)", "O(E²)"], code: [{t: "pq.push({0, start}); dist[start]=0;", p:0}, {t: "while(!pq.empty()) { u = pq.pop().node;", p:1}, {t: "for(v, w : adj[u]) if(dist[v] > dist[u]+w) { dist[v]=dist[u]+w; pq.push({dist[v], v}); }", p:2}]},
    { name: "Prim_Algorithm", ans: "O(E log V)", opts: ["O(V²)", "O(E log V)", "O(V+E)", "O(1)"], code: [{t: "pq.push({0, start}); key[start]=0;", p:0}, {t: "while(!pq.empty()) { u = pq.pop().node; inMST[u]=true;", p:1}, {t: "for(v, w : adj[u]) if(!inMST[v] && key[v]>w) { key[v]=w; pq.push({key[v], v}); }", p:2}]},
    { name: "Kruskal_Algorithm", ans: "O(E log E)", opts: ["O(V²)", "O(E log E)", "O(E log V)", "O(V log V)"], code: [{t: "sort(edges);", p:0}, {t: "for(edge : edges) { u = find(edge.u); v = find(edge.v);", p:1}, {t: "if(u != v) { union(u, v); mst.push(edge); } }", p:2}]},
    { name: "Floyd_Warshall", ans: "O(V³)", opts: ["O(V²)", "O(V³)", "O(E*V)", "O(2^V)"], code: [{t: "for(k=0; k<V; k++)", p:0}, {t: "for(i=0; i<V; i++)", p:1}, {t: "for(j=0; j<V; j++) dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j]);", p:2}]},
    { name: "Bellman_Ford", ans: "O(V*E)", opts: ["O(E log V)", "O(V*E)", "O(V²)", "O(V³)"], code: [{t: "for(i=1; i<V; i++)", p:0}, {t: "for(u, v, w : edges) if(dist[v] > dist[u]+w) dist[v]=dist[u]+w;", p:1}, {t: "for(u, v, w : edges) if(dist[v] > dist[u]+w) return neg_cycle;", p:2}]},
    { name: "Topological_Sort_Kahn", ans: "O(V+E)", opts: ["O(V)", "O(V+E)", "O(V²)", "O(E)"], code: [{t: "for(u : nodes) for(v : adj[u]) in_degree[v]++;", p:0}, {t: "for(i : nodes) if(in_degree[i]==0) q.push(i);", p:1}, {t: "while(!q.empty()) { u=q.pop(); res.push(u); for(v:adj[u]) { in_degree[v]--; if(in_degree[v]==0) q.push(v); } }", p:2}]},
    { name: "Coin_Change_DP", ans: "O(n*amount)", opts: ["O(2^n)", "O(n*amount)", "O(n²)", "O(amount)"], code: [{t: "dp[0] = 0;", p:0}, {t: "for(i=1; i<=amount; i++) for(c : coins)", p:1}, {t: "if(c <= i) dp[i] = min(dp[i], dp[i-c]+1);", p:2}]}
];

    let cur = 0, userSlots = [], selected = "", logicOk = false;

    function goBack() {
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            window.location.href = 'MainPage.html';  
        }, 300);
    }

    function init() {
        const lvl = levels[cur];
        document.getElementById('lvl-info').innerText = `SYSTEM: ${lvl.name.toUpperCase()}`;
        userSlots = new Array(lvl.code.length).fill(null);
        logicOk = false; selected = "";
        
        document.getElementById('mcq-area').style.opacity = "0.2";
        document.getElementById('mcq-area').style.pointerEvents = "none";
        document.getElementById('run-btn').disabled = true;
        document.getElementById('run-btn').innerText = "INITIALIZE_ALGORITHM";

        const b = document.getElementById('bank');
        b.innerHTML = '';
        [...lvl.code].sort(() => Math.random() - 0.5).forEach(c => {
            const d = document.createElement('div');
            d.className = 'code-item'; d.innerText = c.t;
            d.onclick = () => { if(!logicOk) addBlock(c); };
            b.appendChild(d);
        });

        const oc = document.getElementById('opt-container');
        oc.innerHTML = '';
        lvl.opts.forEach(o => {
            const opt = document.createElement('div');
            opt.className = 'opt'; opt.innerText = o;
            opt.onclick = () => pick(o, opt);
            oc.appendChild(opt);
        });
        render();
    }

    function addBlock(block) {
        if (userSlots.some(s => s && s.t === block.t)) return;
        let idx = userSlots.indexOf(null);
        if(idx !== -1) { userSlots[idx] = block; render(); }
    }

    function render() {
        const e = document.getElementById('editor');
        e.innerHTML = '';
        userSlots.forEach((s, i) => {
            const d = document.createElement('div');
            d.className = `slot ${s ? 'filled' : ''}`;
            d.innerHTML = s ? `<span>${s.t}</span>` : `<span>// PENDING_INPUT...</span>`;
            d.onclick = () => { if(!logicOk && s) { userSlots[i] = null; render(); } };
            e.appendChild(d);
        });
    }

    function checkLogic() {
        if (userSlots.includes(null)) {
            alert("BUFFER_EMPTY: Fill all logic slots.");
            return;
        }
        const slots = document.querySelectorAll('#editor .slot');
        let allCorrect = true;
        userSlots.forEach((s, i) => {
            if (!s || s.p !== i) { slots[i].classList.add('wrong'); allCorrect = false; }
            else { slots[i].classList.remove('wrong'); }
        });

        if(allCorrect) {
            logicOk = true;
            document.getElementById('mcq-area').style.opacity = "1";
            document.getElementById('mcq-area').style.pointerEvents = "all";
            alert("LOGIC_STABLE: Profiler Unlocked.");
        } else {
            alert("LOGIC_ERROR: Sequence Mismatch.");
        }
    }

    function pick(val, el) {
        selected = val;
        document.querySelectorAll('.opt').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
    }

    function checkComp() {
        if(selected === levels[cur].ans) {
            document.getElementById('run-btn').disabled = false;
            document.getElementById('run-btn').innerText = "SYSTEM_READY: EXECUTE";
        } else {
            alert("ANALYSIS_FAILED: Incorrect Complexity.");
        }
    }

    function completeLvl() {
        alert("ALGORITHM DEPLOYED.");
        changeLvl(1);
    }

    function changeLvl(n) {
        cur = (cur + n + levels.length) % levels.length;
        init();
    }

    init();