 // --------------------------------------------------------------
    // 100 ACCURATE, COMPREHENSIVE DAA VIVA QUESTIONS & ANSWERS
    // Enhanced clarity & exam-oriented depth
    // --------------------------------------------------------------
    const questionsDB = [
        { q: "What is an algorithm?", a: "An algorithm is a finite, unambiguous sequence of well-defined instructions to solve a specific computational problem, taking input(s) and producing output within finite time." },
        { q: "Define time complexity.", a: "Time complexity quantifies the amount of time an algorithm takes relative to input size (n), expressed via asymptotic notations like Big-O, Theta, Omega. It predicts growth rate." },
        { q: "What is Big-O notation?", a: "Big-O describes the asymptotic upper bound of an algorithm's growth rate, representing worst-case time complexity (e.g., O(n²), O(log n)). It formalizes efficiency guarantees." },
        { q: "Difference between Omega and Theta notation.", a: "Omega (Ω) gives asymptotic lower bound (best-case performance). Theta (Θ) provides both upper and lower tight bound, meaning algorithm grows exactly at that rate." },
        { q: "What is recurrence relation?", a: "A recurrence defines a function in terms of smaller inputs; extensively used in divide-and-conquer analysis (e.g., T(n) = 2T(n/2) + O(n))." },
        { q: "Solve using Master Theorem: T(n) = 2T(n/2) + n", a: "a=2, b=2, f(n)=n, n^(log₂2)=n¹ → Case 2 of Master Theorem → Θ(n log n)." },
        { q: "Why is Merge Sort preferred over Quick Sort for linked lists?", a: "Merge Sort uses sequential access and no random indexing, ideal for linked lists. Quick Sort requires random access and may degrade to O(n²) on sorted sequences." },
        { q: "Worst-case complexity of Quick Sort and how to avoid it?", a: "O(n²) when pivot is smallest or largest element. Avoid by randomized pivot selection or median-of-three pivot strategy." },
        { q: "Explain stable sorting algorithm.", a: "Stable sorting preserves relative order of equal elements. Examples: Merge Sort, Insertion Sort, Bubble Sort. Essential for multi-key sorting." },
        { q: "Time complexity of Heap Sort.", a: "O(n log n) in worst, average, and best cases with O(1) auxiliary space. However, it is not stable." },
        { q: "What is Counting Sort? When is it used?", a: "Non-comparison integer sorting algorithm O(n + k) where k is range of keys. Efficient when k is not significantly larger than n." },
        { q: "Difference between Linear Search and Binary Search.", a: "Linear Search O(n) works on unsorted data; Binary Search O(log n) requires sorted array, using divide-and-conquer." },
        { q: "What is Hashing and collision resolution?", a: "Hashing maps keys to indices for O(1) average access. Collision resolutions: chaining, open addressing (linear probing, quadratic probing, double hashing)." },
        { q: "Explain Dijkstra’s algorithm limitations.", a: "Fails with negative edge weights; assumes non-negative edges. For negative weights, use Bellman-Ford. Greedy approach ensures shortest paths only with non-negative edges." },
        { q: "Time complexity of Dijkstra with binary heap.", a: "O((V+E) log V) using binary min-heap; O(V²) with adjacency matrix." },
        { q: "What is Bellman-Ford algorithm used for?", a: "Finds shortest paths from a source even with negative edges, and detects negative cycles. Complexity O(VE)." },
        { q: "Define Floyd-Warshall algorithm.", a: "All-pairs shortest path using dynamic programming; O(V³) time. Handles negative edges but no negative cycles." },
        { q: "What is topological sorting? Condition?", a: "Linear ordering of vertices in a DAG where for every directed edge u→v, u precedes v. Only possible for Directed Acyclic Graphs (DAG)." },
        { q: "Prim’s vs Kruskal’s algorithm.", a: "Both find MST. Prim grows a tree from source with priority queue O(E log V). Kruskal sorts edges and uses union-find O(E log E)." },
        { q: "Union-Find data structure optimizations.", a: "Path compression + union by rank gives amortized nearly constant time (inverse Ackermann α(n))." },
        { q: "What is Dynamic Programming principle?", a: "DP solves complex problems by breaking into overlapping subproblems, storing results (memoization/tabulation) to avoid recomputation; follows optimal substructure." },
        { q: "Write recurrence for Longest Common Subsequence (LCS).", a: "If i==0 or j==0: 0; if X[i]==Y[j]: 1+LCS(i-1,j-1); else: max(LCS(i-1,j), LCS(i,j-1))." },
        { q: "0/1 Knapsack vs Fractional Knapsack.", a: "0/1: items indivisible, solved by DP O(nW). Fractional: items divisible, greedy by value/weight ratio O(n log n)." },
        { q: "Matrix Chain Multiplication objective.", a: "Minimize scalar multiplications by parenthesizing matrix product; DP O(n³)." },
        { q: "What is Greedy choice property?", a: "Making locally optimal choice leads to global optimum; used in Huffman coding, activity selection, Dijkstra." },
        { q: "Activity Selection problem algorithm.", a: "Sort by finish times, iteratively pick non-overlapping activity with earliest finish; O(n log n)." },
        { q: "Huffman coding technique.", a: "Lossless compression using variable-length codes based on frequencies; greedy builds optimal prefix tree (Huffman tree)." },
        { q: "What is amortized analysis?", a: "Averaging time over a sequence of operations. Methods: aggregate, accounting, potential. Example: dynamic table expansion." },
        { q: "Explain String matching: KMP algorithm.", a: "Knuth-Morris-Pratt uses LPS (prefix function) to avoid redundant comparisons; O(n+m) time." },
        { q: "Rabin-Karp algorithm advantage.", a: "Uses rolling hash to find pattern matches; average O(n+m), excellent for multiple pattern search." },
        { q: "What is Backtracking?", a: "Systematic trial-and-error search that incrementally builds candidates and abandons (backtracks) invalid branches; used in N-Queens, Sudoku." },
        { q: "Difference between Branch and Bound vs Backtracking.", a: "Branch and Bound uses bounding functions to prune suboptimal branches; used for optimization (TSP, Knapsack). Backtracking is for decision problems." },
        { q: "What are P and NP problems?", a: "P: problems solvable in polynomial time. NP: problems verifiable in polynomial time." },
        { q: "Define NP-Complete.", a: "Problems in NP that are as hard as any NP problem; if any NP-complete problem is in P, then P=NP. Classic: SAT, Hamiltonian Cycle." },
        { q: "What is NP-Hard?", a: "At least as hard as NP-complete but not necessarily in NP. e.g., Halting problem." },
        { q: "State Master Theorem cases.", a: "Compare f(n) with n^(log_b a). Case1: f(n)=O(n^(c)) with c<log_b a -> Θ(n^(log_b a)). Case2: f(n)=Θ(n^(log_b a) log^k n) -> Θ(n^(log_b a) log^(k+1)n). Case3: f(n)=Ω(n^(c)), c>log_b a & regularity -> Θ(f(n))." },
        { q: "What is the traveling salesman problem (TSP)?", a: "Find shortest Hamiltonian cycle in graph; NP-hard. Exact DP O(n²2ⁿ), approximation heuristics (Christofides)." },
        { q: "Explain BFS and DFS time complexity on adjacency list.", a: "Both O(V+E). BFS uses queue for shortest path in unweighted graphs; DFS uses stack recursion." },
        { q: "Articulation point in graphs.", a: "Vertex whose removal increases connected components. Found using DFS discovery time and low-link values (Tarjan)." },
        { q: "What is a bipartite graph check algorithm?", a: "BFS/DFS 2-coloring: assign alternating colors; if adjacent same color → not bipartite. O(V+E)." },
        { q: "Difference between Depth-first search and Backtracking.", a: "DFS is graph traversal; Backtracking uses DFS with pruning to solve combinatorial constraint problems." },
        { q: "What is Strassen’s matrix multiplication?", a: "Divide-and-conquer matrix multiplication, O(n^2.81) vs naive O(n³). Reduces 8 multiplications to 7 per recursion." },
        { q: "What is the median of medians algorithm?", a: "Deterministic selection (kth smallest) in O(n) worst-case using pivot groups of 5." },
        { q: "Explain divide and conquer paradigm.", a: "Divide problem into subproblems, solve recursively, combine results. Examples: Merge Sort, Quick Sort, Closest Pair." },
        { q: "What is the purpose of Sentinel in algorithms?", a: "Dummy element to eliminate boundary checks, e.g., in linear search or merge sort." },
        { q: "Complexity of insertion sort best/worst case.", a: "Best O(n) (already sorted), worst O(n²) (reverse sorted). Adaptive and stable." },
        { q: "What is Radix Sort? Stability required?", a: "Sorts integers digit by digit using stable counting sort; O(d*(n+b)). Requires stable sorting for correctness." },
        { q: "What is a Fenwick tree (Binary Indexed Tree)?", a: "Data structure for prefix sum queries and point updates in O(log n), ideal for range queries." },
        { q: "Explain AVL tree rotation cases.", a: "LL, RR, LR, RL rotations to maintain balance factor ±1; ensures height O(log n)." },
        { q: "Red-Black tree properties.", a: "Each node red/black, root black, red nodes have black children, equal black depth; guarantees O(log n) operations." },
        { q: "B-Tree and its use.", a: "Self-balancing tree with many children, optimized for disk I/O; used in databases and file systems." },
        { q: "What is a Bloom Filter?", a: "Probabilistic space-efficient set membership; false positives possible, never false negatives." },
        { q: "Explain external sorting.", a: "Sorting massive data using external memory: multiway merge sort with intermediate files." },
        { q: "What is the closest pair problem and divide-and-conquer solution?", a: "Find minimal Euclidean distance between points in plane; O(n log n) via recursive divide and strip comparison." },
        { q: "What is integer multiplication using Karatsuba?", a: "Divide-and-conquer multiplication: O(n^1.585) using formula (ac, bd, (a+b)(c+d)-ac-bd)." },
        { q: "Difference between Greedy and DP.", a: "Greedy makes irreversible local choices; DP explores all subproblems, ensures optimality with overlapping substructure." },
        { q: "Rod cutting problem solution.", a: "DP maximizes revenue by cutting rod of length n; O(n²) similar to unbounded knapsack." },
        { q: "What is subset sum problem? Complexity.", a: "Check subset with given sum. NP-complete, pseudo-polynomial DP O(n*sum)." },
        { q: "What is the concept of 'relaxation' in graph algorithms?", a: "Updating shortest path estimate if better path found; core of Dijkstra and Bellman-Ford." },
        { q: "Explain Johnson’s algorithm.", a: "All-pairs shortest paths for sparse graphs: reweight using Bellman-Ford, then run Dijkstra; O(V² log V + VE)." },
        { q: "What is maximum flow? Ford-Fulkerson method.", a: "Max flow from source to sink; augmenting paths in residual network; complexity O(E * max_flow)." },
        { q: "Edmonds-Karp algorithm complexity.", a: "Ford-Fulkerson with BFS augmenting paths: O(VE²)." },
        { q: "What is a bipartite matching?", a: "Maximum set of edges without shared vertices in bipartite graph; Hopcroft-Karp O(E√V)." },
        { q: "State the Stable Marriage problem.", a: "Find stable matching using Gale-Shapley algorithm (O(n²)), ensures no blocking pairs." },
        { q: "What is a linear programming relaxation?", a: "Relax integer constraints to real values for approximations; used in design of approximation algorithms." },
        { q: "Define approximation ratio.", a: "Ratio of algorithm's solution to optimal solution for NP-hard problems; e.g., Vertex cover greedy ratio 2." },
        { q: "What is the concept of 'Randomized algorithm'?", a: "Uses random bits to influence behavior; examples: Randomized QuickSort, Karger's min cut." },
        { q: "Las Vegas vs Monte Carlo algorithms.", a: "Las Vegas always correct (runtime random). Monte Carlo may err with bounded probability." },
        { q: "What is the computational model RAM?", a: "Random Access Machine: infinite memory, unit cost for basic operations, standard for analysis." },
        { q: "Define in-place algorithm.", a: "Uses O(1) extra memory beyond input; examples: QuickSort, HeapSort, reversal algorithm." },
        { q: "What is tail recursion? Why optimize?", a: "Recursive call as last operation; compiler can optimize to iteration to avoid stack overflow." },
        { q: "What is Strassen's algorithm advantage over naive?", a: "Reduces multiplications from 8 to 7 per recursion step, leading to O(n^2.81) for large n." },
        { q: "What is the concept of 'loop invariant'?", a: "Property true before and after each iteration; used to prove algorithm correctness." },
        { q: "Explain Euclid's algorithm for GCD complexity.", a: "O(log min(a,b)) based on modulo operations: gcd(a,b)=gcd(b, a mod b)." },
        { q: "What is modular exponentiation?", a: "Compute (b^e) mod m efficiently using binary exponentiation O(log e)." },
        { q: "Define pseudopolynomial algorithm.", a: "Runs in polynomial in numeric value but exponential in bits; example: DP knapsack O(nW)." },
        { q: "What is the substitution method for recurrences?", a: "Guess solution form, then prove by induction." },
        { q: "What is the recursion tree method?", a: "Visual method summing cost per recursion level; used for divide-and-conquer analysis." },
        { q: "Difference between Heaps and Priority Queues.", a: "Heap is concrete data structure; priority queue is ADT, typically implemented via heap." },
        { q: "What is a binomial heap?", a: "Collection of binomial trees supporting union in O(log n), efficient merge." },
        { q: "Explain Fibonacci heap.", a: "Amortized O(1) decrease-key and merge; used in Dijkstra to achieve O(E + V log V)." },
        { q: "What is a suffix array?", a: "Sorted array of all suffixes; supports pattern matching & LCP array, built in O(n log n)." },
        { q: "What is the concept of 'online algorithm'?", a: "Processes input piecewise without future knowledge; competitive analysis (e.g., paging)." },
        { q: "What is a cache-oblivious algorithm?", a: "Performs well without cache parameters; optimal across memory hierarchies (cache-oblivious matrix multiplication)." },
        { q: "What is the shortest superstring problem?", a: "Find shortest string containing all given strings as substrings; NP-hard, approximation algorithms exist." },
        { q: "Explain Boyer-Moore string matching.", a: "Uses bad-character & good-suffix heuristics to skip characters; sublinear average O(n/m)." },
        { q: "What is Z-algorithm?", a: "Linear pattern matching computing Z-array (longest prefix match). O(n+m)." },
        { q: "What is A* search algorithm?", a: "Informed search using f(n)=g(n)+h(n); optimal if heuristic admissible & consistent." },
        { q: "Define 'state space search' in AI.", a: "Exploring states to find goal; strategies: BFS, DFS, iterative deepening, bidirectional search." },
        { q: "What is the concept of reduction in complexity?", a: "Transforming problem A to B; if A reduces to B and B∈P then A∈P. Basis for NP-completeness proofs." },
        { q: "What is the SAT problem?", a: "Boolean satisfiability: decide if formula can be true; first NP-complete problem (Cook-Levin theorem)." },
        { q: "What is the Clique problem?", a: "Does graph contain clique of size k? NP-complete." },
        { q: "Explain Vertex Cover and its relation to Clique.", a: "Vertex cover: vertices covering all edges. Complement of vertex cover is independent set; relates via complement graph." },
        { q: "What is the Hamiltonian Cycle problem?", a: "Does graph contain cycle visiting each vertex exactly once? NP-complete." },
        { q: "What is the Subset Sum problem reduction?", a: "Given numbers and target; NP-complete, used in knapsack-based cryptography." },
        { q: "What is the Partition problem?", a: "Can set be split into two subsets of equal sum? NP-complete." },
        { q: "What is the concept of 'kernelization' in parameterized complexity?", a: "Reducing instance to smaller equivalent kernel in polynomial time; used in FPT algorithms." },
        { q: "Define Fixed Parameter Tractable (FPT).", a: "Problem solvable in O(f(k) * n^c); e.g., Vertex cover O(2^k * n)." },
        { q: "Explain the use of randomization in primality testing.", a: "Miller-Rabin probabilistic test: determines prime with high probability; efficient for large numbers." },
        { q: "What is the concept of 'streaming algorithm'?", a: "Process data in single pass with sublinear memory; e.g., count distinct elements (HyperLogLog)." }
    ];

    // Ensure exactly 100 entries (the DB contains 100 entries exactly)
    console.assert(questionsDB.length === 100, "Questions loaded:", questionsDB.length);

    // Helper: escape HTML to maintain clarity
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // Render with search filter
    function renderQuestions(filterText = "") {
        const container = document.getElementById("qaContainer");
        const filterStatusSpan = document.getElementById("filterStatus");
        const totalSpan = document.getElementById("totalCounter");
        const lowerFilter = filterText.toLowerCase().trim();

        let filtered = questionsDB;
        if (lowerFilter !== "") {
            filtered = questionsDB.filter(item =>
                item.q.toLowerCase().includes(lowerFilter) ||
                item.a.toLowerCase().includes(lowerFilter)
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `<div class="status-msg" style="grid-column:1/-1; text-align:center;">🔍 No matching questions — try different keywords (asymptotic, DP, graph, NP)</div>`;
            filterStatusSpan.innerText = `❌ No results for "${filterText}"`;
            totalSpan.innerText = `📋 0 / ${questionsDB.length}`;
            return;
        }

        let html = "";
        filtered.forEach((item) => {
            const originalIndex = questionsDB.findIndex(q => q.q === item.q && q.a === item.a) + 1;
            html += `
                <div class="qa-card">
                    <div class="qa-num">#${originalIndex}</div>
                    <div class="question"> ${escapeHtml(item.q)}</div>
                    <div class="answer"><strong>📌 Answer:</strong> ${escapeHtml(item.a)}</div>
                </div>
            `;
        });
        container.innerHTML = html;
        filterStatusSpan.innerText = lowerFilter !== "" ? `🔎 Showing ${filtered.length} of ${questionsDB.length} matching questions` : `✅ Showing all ${questionsDB.length} expertly crafted Q&A`;
        totalSpan.innerText = `📋 ${filtered.length} / ${questionsDB.length}`;
    }

    // event binding and initial load
    document.addEventListener("DOMContentLoaded", () => {
        renderQuestions("");
        const searchBox = document.getElementById("searchInput");
        searchBox.addEventListener("input", (e) => renderQuestions(e.target.value));
    });