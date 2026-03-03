import { useState, useMemo } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(5);

  function expensiveCalculation(num) {
    console.log("Calculating...");
    for (let i = 0; i < 1000000000; i++) {}
    return num * 2;
  }
  //const result = expensiveCalculation(number);
  const result = useMemo(() => {
    return expensiveCalculation(number);
  }, [number]);

  return (
    <>
      <h1>{result}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment ({count})
      </button>
    </>
  );
}

export default App;