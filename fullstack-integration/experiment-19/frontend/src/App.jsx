import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from the backend using axios
    axios.get('http://localhost:5000/api/data')
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {data ? <p>{data.message}</p> : <p>Waiting...</p>}
      </header>
    </div>
  );
}

export default App;