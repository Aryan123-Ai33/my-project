import React, { useState } from "react";
import "./collection.css";

function Collection() {
  const [movies, setMovies] = useState([
    { id: 1, title: "Conjuring", genre: "Horror", rating: 7.9 },
    { id: 2, title: "Interstellar", genre: "Sci-Fi", rating: 8.6 }
  ]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState(0);

  function addMovie(e) {
    e.preventDefault();
    const numRating = parseFloat(rating);
    if (title && genre && !isNaN(numRating) && numRating >= 0 && numRating <= 10) {
      const newMovie = {
        id: Date.now(),
        title: title,
        genre: genre,
        rating: numRating
      };
      setMovies([...movies, newMovie]);
      setTitle("");
      setGenre("");
      setRating(0);
    }
  }

  function removeMovie(removeId) {
    setMovies(movies.filter(m => m.id !== removeId));
  }

  return (
    <div>
      <h2>Movie Collection</h2>
      <form onSubmit={addMovie}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          placeholder="Genre"
          value={genre}
          onChange={e => setGenre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={e => setRating(parseFloat(e.target.value) || 0)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {movies.map(m => (
          <li key={m.id}>
            {m.title} | {m.genre} | {m.rating}
            <button onClick={() => removeMovie(m.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Collection;
