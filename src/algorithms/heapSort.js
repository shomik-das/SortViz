const heapSort = (array) => {
    const steps = [];
    const arr = [...array];
    const n = arr.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i, steps);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]];
        steps.push([0, i, [...arr], i]); // Swap step

        // Call heapify on reduced heap
        heapify(arr, i, 0, steps);
    }

    steps.push([null, null, [...arr], 0]); // Final step
    return steps;
};

const heapify = (arr, n, i, steps) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push([left, right, null, null]); // Compare step

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        steps.push([i, largest, [...arr], null]); // Swap step
        heapify(arr, n, largest, steps);
    }
};

export default heapSort; 