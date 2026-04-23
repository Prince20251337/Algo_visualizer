    // ---------- GLOBAL STATE ----------
    let arrayL = [], arrayR = [];
    let stopRequest = false;
    let winnerDeclared = false;
    let activeSortPromise = { L: false, R: false };
    
    let stats = {
        L: { c: 0, s: 0 },
        R: { c: 0, s: 0 }
    };
    
    // Step mode variables
    let stepMode = false;
    let stepBarrierPromise = null;
    let stepBarrierResolve = null;
    
    // Complexity & description mapping
    const info = {
        bubble: { comp: "O(n²)", state: "🐟 Bubble: repeatedly steps through list, swaps adjacent if out of order. Large bubbles rise." },
        selection: { comp: "O(n²)", state: "🎯 Selection: finds minimum element and moves to front, repeats for unsorted part." },
        insertion: { comp: "O(n²)", state: "📌 Insertion: builds sorted array one element at a time, inserts into correct position." },
        merge: { comp: "O(n log n)", state: "🧩 Merge: divide & conquer, splits array, sorts halves, merges back." },
        quick: { comp: "O(n log n)", state: "⚡ Quick: picks pivot, partitions into left< pivot < right, recurses." }
    };
    
    // Helper: create a new step barrier promise
    function resetStepBarrier() {
        if (stepBarrierResolve) {
            // If there's an existing unresolved promise, resolve it (cleanup)
            stepBarrierResolve();
        }
        stepBarrierPromise = new Promise(resolve => {
            stepBarrierResolve = resolve;
        });
    }
    
    // Step button click handler
    function advanceStep() {
        if (!stepMode) return;
        if (stepBarrierResolve) {
            stepBarrierResolve();      // release all waiting sleep calls
            resetStepBarrier();        // create new barrier for next step
        }
        // re-disable step button until next sleep awaits (will be re-enabled by sleep)
        const stepBtn = document.getElementById('stepBtn');
        stepBtn.disabled = true;
    }
    
    // Sleep: respects speed and step mode
    async function sleep() {
        if (stopRequest) return;
        const ms = Math.max(10, 110 - document.getElementById('speedRange').value);
        
        if (stepMode) {
            // Step mode: wait for the barrier to be resolved
            if (!stepBarrierPromise) resetStepBarrier();
            const stepBtn = document.getElementById('stepBtn');
            stepBtn.disabled = false;   // enable step button so user can click
            await stepBarrierPromise;
            stepBtn.disabled = true;    // after advancing, disable until next sleep
            return;
        } else {
            // Normal mode: simple delay
            await new Promise(r => setTimeout(r, ms));
        }
    }
    
    // Update step button state based on stepMode and sorting activity
    function updateStepButtonState() {
        const stepBtn = document.getElementById('stepBtn');
        const isSortingActive = activeSortPromise.L || activeSortPromise.R;
        stepBtn.disabled = !stepMode || !isSortingActive;
        if (!stepMode) stepBtn.disabled = true;
    }
    
    // Toggle step mode (event listener)
    function setupStepModeToggle() {
        const checkbox = document.getElementById('stepModeCheckbox');
        checkbox.addEventListener('change', (e) => {
            stepMode = checkbox.checked;
            if (!stepMode) {
                // If step mode turned off during sorting, release any waiting barrier to let it continue
                if (stepBarrierResolve) {
                    stepBarrierResolve();
                    resetStepBarrier();  // clean up
                }
                const stepBtn = document.getElementById('stepBtn');
                stepBtn.disabled = true;
            } else {
                // If step mode enabled while sorting is active, create fresh barrier
                if (activeSortPromise.L || activeSortPromise.R) {
                    resetStepBarrier();
                    updateStepButtonState();
                } else {
                    // no active sorting, nothing to step
                    document.getElementById('stepBtn').disabled = true;
                }
            }
        });
    }
    
    // ---------- VISUALIZATION ----------
    function draw(side, arr, activeIndices = []) {
        const arenaDiv = document.getElementById('arena' + side);
        if (!arenaDiv) return;
        arenaDiv.innerHTML = '';
        for (let i = 0; i < arr.length; i++) {
            const card = document.createElement('div');
            card.className = 'num-card';
            if (activeIndices && activeIndices.includes(i)) {
                card.classList.add('active');
            }
            card.textContent = arr[i];
            arenaDiv.appendChild(card);
        }
    }
    
    function updateStatsUI() {
        document.getElementById('compL').innerText = stats.L.c;
        document.getElementById('swapL').innerText = stats.L.s;
        document.getElementById('compR').innerText = stats.R.c;
        document.getElementById('swapR').innerText = stats.R.s;
    }
    
    function resetBattleState(keepArray = false) {
        stopRequest = true;
        // wait a tiny moment to let ongoing sleeps finish
        setTimeout(() => {
            if (!keepArray) {
                // actual reset logic called from setArraysAndReset
            }
        }, 10);
        winnerDeclared = false;
        document.querySelectorAll('.winner-badge').forEach(b => b.style.display = 'none');
        document.querySelectorAll('.arena-box').forEach(b => b.classList.remove('winner-border'));
        
        // If step mode is active, release any pending barrier to avoid hanging
        if (stepBarrierResolve) {
            stepBarrierResolve();
            resetStepBarrier();
        }
        updateStepButtonState();
    }
    
    function setArraysAndReset(newArray) {
        resetBattleState();
        arrayL = [...newArray];
        arrayR = [...newArray];
        stats = { L: { c: 0, s: 0 }, R: { c: 0, s: 0 } };
        updateStatsUI();
        draw('L', arrayL, []);
        draw('R', arrayR, []);
        stopRequest = false;
        winnerDeclared = false;
        // update algorithm info texts
        const leftVal = document.getElementById('leftAlgo').value;
        const rightVal = document.getElementById('rightAlgo').value;
        document.getElementById('nameL').innerText = document.getElementById('leftAlgo').options[document.getElementById('leftAlgo').selectedIndex].text;
        document.getElementById('nameR').innerText = document.getElementById('rightAlgo').options[document.getElementById('rightAlgo').selectedIndex].text;
        document.getElementById('timeL').innerText = info[leftVal].comp;
        document.getElementById('timeR').innerText = info[rightVal].comp;
        document.getElementById('stateL').innerHTML = info[leftVal].state;
        document.getElementById('stateR').innerHTML = info[rightVal].state;
        
        // reset step barrier if step mode is on
        if (stepMode) {
            resetStepBarrier();
        }
        updateStepButtonState();
    }
    
    function generateRandomArray() {
        const size = Math.floor(Math.random() * 16) + 12;
        const randomArr = Array.from({ length: size }, () => Math.floor(Math.random() * 180) + 25);
        setArraysAndReset(randomArr);
    }
    
    function applyCustomArray() {
        const raw = document.getElementById('customArrayInput').value.trim();
        if (!raw) {
            alert("Please enter numbers separated by commas, e.g., 12, 5, 88, 23");
            return;
        }
        const parts = raw.split(',').map(s => s.trim()).filter(s => s !== "");
        const numbers = [];
        for (let part of parts) {
            const num = Number(part);
            if (isNaN(num)) {
                alert(`Invalid number: "${part}". Use integers only.`);
                return;
            }
            numbers.push(num);
        }
        if (numbers.length < 2) {
            alert("At least 2 numbers required for sorting battle!");
            return;
        }
        if (numbers.length > 32) {
            alert("Maximum 32 numbers allowed for clean visualization.");
            return;
        }
        setArraysAndReset(numbers);
        document.getElementById('customArrayInput').value = numbers.join(', ');
    }
    
    function declareWinner(side) {
        if (!winnerDeclared && !stopRequest) {
            winnerDeclared = true;
            document.getElementById(`badge${side}`).style.display = 'block';
            document.getElementById(`box${side}`).classList.add('winner-border');
        }
    }
    
    function stopAll() {
        stopRequest = true;
        // resolve step barrier if waiting
        if (stepBarrierResolve) {
            stepBarrierResolve();
            resetStepBarrier();
        }
        updateStepButtonState();
    }
    
    // ---------- SORTING ALGORITHMS (with step awareness) ----------
    async function runSortAlgorithm(side, arr, algo) {
        try {
            if (algo === 'bubble') await bubbleSort(arr, side);
            else if (algo === 'selection') await selectionSort(arr, side);
            else if (algo === 'insertion') await insertionSort(arr, side);
            else if (algo === 'quick') await quickSort(arr, 0, arr.length - 1, side);
            else if (algo === 'merge') await mergeSortWrapper(arr, 0, arr.length - 1, side);
        } catch(e) { /* ignore if stop */ }
        
        if (!stopRequest) {
            draw(side, arr, []);
            declareWinner(side);
        }
    }
    
    async function bubbleSort(arr, side) {
        for (let i = 0; i < arr.length && !stopRequest; i++) {
            for (let j = 0; j < arr.length - i - 1 && !stopRequest; j++) {
                stats[side].c++;
                updateStatsUI();
                draw(side, arr, [j, j+1]);
                await sleep();
                if (arr[j] > arr[j+1]) {
                    [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                    stats[side].s++;
                    updateStatsUI();
                    draw(side, arr, [j, j+1]);
                    await sleep();
                }
            }
        }
    }
    
    async function selectionSort(arr, side) {
        for (let i = 0; i < arr.length && !stopRequest; i++) {
            let minIdx = i;
            for (let j = i+1; j < arr.length && !stopRequest; j++) {
                stats[side].c++;
                draw(side, arr, [j, minIdx]);
                await sleep();
                if (arr[j] < arr[minIdx]) minIdx = j;
                updateStatsUI();
            }
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                stats[side].s++;
                updateStatsUI();
                draw(side, arr, [i, minIdx]);
                await sleep();
            } else {
                draw(side, arr, [i]);
                await sleep();
            }
        }
    }
    
    async function insertionSort(arr, side) {
        for (let i = 1; i < arr.length && !stopRequest; i++) {
            let key = arr[i];
            let j = i-1;
            while (j >= 0 && arr[j] > key && !stopRequest) {
                stats[side].c++;
                arr[j+1] = arr[j];
                stats[side].s++;
                updateStatsUI();
                draw(side, arr, [j, j+1]);
                await sleep();
                j--;
            }
            arr[j+1] = key;
            draw(side, arr, [j+1]);
            await sleep();
        }
    }
    
    async function quickSort(arr, low, high, side) {
        if (stopRequest || low >= high) return;
        let pivotIdx = await partition(arr, low, high, side);
        await quickSort(arr, low, pivotIdx - 1, side);
        await quickSort(arr, pivotIdx + 1, high, side);
    }
    
    async function partition(arr, low, high, side) {
        let pivot = arr[high];
        let i = low;
        for (let j = low; j < high && !stopRequest; j++) {
            stats[side].c++;
            draw(side, arr, [j, high]);
            await sleep();
            if (arr[j] < pivot) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                stats[side].s++;
                updateStatsUI();
                draw(side, arr, [i, j]);
                await sleep();
                i++;
            }
            updateStatsUI();
        }
        [arr[i], arr[high]] = [arr[high], arr[i]];
        stats[side].s++;
        updateStatsUI();
        draw(side, arr, [i, high]);
        await sleep();
        return i;
    }
    
    async function mergeSortWrapper(arr, l, r, side) {
        if (stopRequest || l >= r) return;
        const mid = Math.floor((l + r) / 2);
        await mergeSortWrapper(arr, l, mid, side);
        await mergeSortWrapper(arr, mid + 1, r, side);
        await merge(arr, l, mid, r, side);
    }
    
    async function merge(arr, left, mid, right, side) {
        let leftArr = arr.slice(left, mid+1);
        let rightArr = arr.slice(mid+1, right+1);
        let i = 0, j = 0, k = left;
        while (i < leftArr.length && j < rightArr.length && !stopRequest) {
            stats[side].c++;
            updateStatsUI();
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            stats[side].s++;
            updateStatsUI();
            draw(side, arr, [k]);
            await sleep();
            k++;
        }
        while (i < leftArr.length && !stopRequest) {
            arr[k] = leftArr[i];
            stats[side].s++;
            draw(side, arr, [k]);
            await sleep();
            i++; k++;
        }
        while (j < rightArr.length && !stopRequest) {
            arr[k] = rightArr[j];
            stats[side].s++;
            draw(side, arr, [k]);
            await sleep();
            j++; k++;
        }
        updateStatsUI();
    }
    
    // ---------- BATTLE START ----------
    async function startBattle() {
        if ((activeSortPromise.L || activeSortPromise.R) && !stopRequest) {
            stopAll();
            await new Promise(r => setTimeout(r, 100));
        }
        stopRequest = false;
        winnerDeclared = false;
        document.querySelectorAll('.winner-badge').forEach(b => b.style.display = 'none');
        document.querySelectorAll('.arena-box').forEach(b => b.classList.remove('winner-border'));
        stats = { L: { c: 0, s: 0 }, R: { c: 0, s: 0 } };
        updateStatsUI();
        draw('L', arrayL, []);
        draw('R', arrayR, []);
        
        const leftAlgo = document.getElementById('leftAlgo').value;
        const rightAlgo = document.getElementById('rightAlgo').value;
        
        // fresh copies to avoid any cross reference
        const leftArr = [...arrayL];
        const rightArr = [...arrayR];
        arrayL = leftArr;
        arrayR = rightArr;
        
        activeSortPromise.L = true;
        activeSortPromise.R = true;
        updateStepButtonState();
        
        if (stepMode) {
            resetStepBarrier();  // fresh barrier for step-by-step
        }
        
        const leftTask = runSortAlgorithm('L', arrayL, leftAlgo);
        const rightTask = runSortAlgorithm('R', arrayR, rightAlgo);
        
        await Promise.allSettled([leftTask, rightTask]);
        
        activeSortPromise.L = false;
        activeSortPromise.R = false;
        draw('L', arrayL, []);
        draw('R', arrayR, []);
        updateStepButtonState();
        // if step barrier still exists, resolve it to avoid hanging (clean)
        if (stepBarrierResolve) {
            stepBarrierResolve();
            stepBarrierPromise = null;
            stepBarrierResolve = null;
        }
    }
    
    // update algorithm info when dropdowns change
    function updateAlgorithmMeta() {
        if (stopRequest) return;
        const leftVal = document.getElementById('leftAlgo').value;
        const rightVal = document.getElementById('rightAlgo').value;
        document.getElementById('nameL').innerText = document.getElementById('leftAlgo').options[document.getElementById('leftAlgo').selectedIndex].text;
        document.getElementById('nameR').innerText = document.getElementById('rightAlgo').options[document.getElementById('rightAlgo').selectedIndex].text;
        document.getElementById('timeL').innerText = info[leftVal].comp;
        document.getElementById('timeR').innerText = info[rightVal].comp;
        document.getElementById('stateL').innerHTML = info[leftVal].state;
        document.getElementById('stateR').innerHTML = info[rightVal].state;
        draw('L', arrayL, []);
        draw('R', arrayR, []);
    }
    
    // Initialization
    function init() {
        const defaultArr = [64, 23, 85, 12, 47, 93, 31, 58, 19, 77, 5, 44, 68];
        setArraysAndReset(defaultArr);
        document.getElementById('customArrayInput').value = defaultArr.join(', ');
        setupStepModeToggle();
        document.getElementById('stepBtn').addEventListener('click', advanceStep);
        document.getElementById('leftAlgo').addEventListener('change', updateAlgorithmMeta);
        document.getElementById('rightAlgo').addEventListener('change', updateAlgorithmMeta);
    }
    
    init();
    window.generateRandomArray = generateRandomArray;
    window.applyCustomArray = applyCustomArray;
    window.startBattle = startBattle;
    window.stopAll = stopAll;