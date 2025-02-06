import NavBar from "./components/NavBar";
import Bars from "./components/Bars.jsx";
import React, { useState, useEffect, useRef } from "react";
import './App.css'

import bubbleSort from "./algorithms/bubbleSort";
import insertionSort from "./algorithms/insertionSort";
import selectionSort from "./algorithms/selectionSort";
import quickSort from "./algorithms/quickSort";
import mergeSort from "./algorithms/mergeSort";

const App = () => {
  //states
  const [algo, setAlgo] = useState("bubbleSort");
  const [len, setLength] = useState(20);
  const [blocks, setBlocks] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [completed, setCompleted] = useState(true);
  const [speed, setSpeed] = useState(250);
  const [compare, setCompare] = useState([]);
  const [swap, setSwap] = useState([]);
  const [sortedIndex, setSortedIndex] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const sortingStepsRef = useRef([]);
  const currentStepRef = useRef(0);

  // generating shuffled array of 1 to n or 1 to len
  // const generateRandomArray = (len) => {
  //     setCompleted(false)
  //     setSorting(false)
  //     setSortedIndex([])

  //     const randomArray = Array.from(Array(len + 1).keys()).slice(1)

  //     for (let i = randomArray.length - 1; i > 0; i--) {
  //         const randomIndex = Math.floor(Math.random() * (i - 1))
  //         const temp = randomArray[i]

  //         randomArray[i] = randomArray[randomIndex]
  //         randomArray[randomIndex] = temp
  //     }

  //     setBlocks(randomArray)
  // }

  const generateRandomArray = (len) => {
    setCompleted(false)
    setSorting(false)
    setSortedIndex([])

    const randomArray = [];
    for (let i = 1; i <= len; i++) {
        randomArray.push(i);
    }
    for (let i = randomArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i - 1))
        const temp = randomArray[i]
        randomArray[i] = randomArray[randomIndex]
        randomArray[randomIndex] = temp
    }

    setBlocks(randomArray)
}

  // Generating random array every time the length is changed by th user
  useEffect(() => {
      generateRandomArray(len);
  }, [len, algo])

  // setting the selected algorithm
  const handleAlgo = (event) => {
      setAlgo(event.target.value);
  }

  // handling the length of the array
  const handleLength = (event) => {
      setLength(Number(event.target.value));
  }

  // handling the speed of sorting
  const handleSpeed = (event) => {
      setSpeed(Math.ceil(500 / Number(event.target.value)));
  }

  const handlePause = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handlePlay = () => {
    if (!sorting) return;
    setIsPaused(false);
    processSortingSteps();
  };

  const processSortingSteps = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (currentStepRef.current >= sortingStepsRef.current.length) {
        clearInterval(intervalRef.current);
        setSorting(false);
        setCompleted(true);
        return;
      }

      const [j, k, arr, index] = sortingStepsRef.current[currentStepRef.current];
      setCompare([j, k]);
      setSwap([]);

      if (index !== null) {
        setSortedIndex((prevState) => [...prevState, index]);
      }

      if (arr) {
        setBlocks(arr);
        if (j !== null || k != null) setSwap([j, k]);
      }

      currentStepRef.current++;
    }, speed);
  };

  const handleSort = () => {
    setSorting(true);
    setIsPaused(false);
    currentStepRef.current = 0;
    
    switch (algo) {
      case "bubbleSort":
        sortingStepsRef.current = bubbleSort(blocks);
        break;
      case "selectionSort":
        sortingStepsRef.current = selectionSort(blocks);
        break;
      case "insertionSort":
        sortingStepsRef.current = insertionSort(blocks);
        break;
      case "quickSort":
        sortingStepsRef.current = quickSort(blocks);
        break;
      case "mergeSort":
        sortingStepsRef.current = mergeSort(blocks);
        break;
      default:
        setSorting(false);
        setCompleted(true);
        return;
    }

    processSortingSteps();
  };

  const handleFinish = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Process all remaining steps instantly
    while (currentStepRef.current < sortingStepsRef.current.length) {
      const [j, k, arr, index] = sortingStepsRef.current[currentStepRef.current];
      
      if (index !== null) {
        setSortedIndex(prevState => [...prevState, index]);
      }

      if (arr) {
        setBlocks(arr);
      }

      currentStepRef.current++;
    }

    // Set final state
    setCompare([]);
    setSwap([]);
    setSorting(false);
    setCompleted(true);
    setIsPaused(false);
  };

  return (
    <div className="App">
      <NavBar
        generateRandomArray={() => generateRandomArray(len)}
        handleLength={handleLength}
        handleSpeed={handleSpeed}
        handleAlgo={handleAlgo}
        handleSort={handleSort}
        handlePause={handlePause}
        handlePlay={handlePlay}
        handleFinish={handleFinish}
        sorting={sorting}
        completed={completed}
        isPaused={isPaused}
        len={len}
        speed={speed}
        algo={algo}
      />
      <Bars
        blocks={blocks}
        compare={sorting && compare}
        swap={sorting && swap}
        sorted={sortedIndex}
      />
    </div>
  );
};

export default App;
