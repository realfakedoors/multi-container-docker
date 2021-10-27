import { useState, useEffect } from 'react';
import axios from 'axios';

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  async function fetchValues() {
    const currentValues = await axios.get('/api/values/current');
    setValues( currentValues.data );
  }

  async function fetchIndexes() {
    const seenIndexes = await axios.get('/api/values/all');
    setSeenIndexes( seenIndexes.data.map(i => i.number) );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post('/api/values', {
      index,
    });
    setIndex('');
  };

  function renderValues() {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, [index]);

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Enter your index:</label>
        <input value={index}
               onChange={(event) => setIndex( event.target.value )}
        />
        <button>Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {JSON.stringify(seenIndexes)}
      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  )
}

export default Fib;