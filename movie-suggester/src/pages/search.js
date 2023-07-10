import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Single from "./single.js";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movieQuery, setMovieQuery] = useState("");
  const [moviesData, setMoviesData] = useState([]);
  const [showMovie, setShowMovie] = useState(false);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTFjYTA0NWJmNGJkNzZlYWUxYWM3YWI0ZTliZjVlZSIsInN1YiI6IjY0OWIzZjJiYWY1OGNiMDBmZmY5YTkyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3-cjaKmd_luLs19aUZNpCuLvubL5pjY7IQDBS4UgAIs",
    },
  };

  let fetchData = async () => {
    let results = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1&with_original_language=en-US`, options);
    const jsonData = await results.json();
    setMoviesData(jsonData.results);
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
    setShowMovie(false);
  };

  const handleClick = (props) => {
    setMovieQuery(props);
    setShowMovie(true);
  };

  return (
    <div>
      <input type="text" onChange={handleChange}></input>
      <h2>{searchQuery}</h2>
      {!showMovie ? (
        <>
          {moviesData ? (
            moviesData.map((movie) => (
              <div key={movie.id}>
                <button onClick={() => handleClick(movie)}>{movie.title}</button>
                {/* <h2 onClick={() => handleClick(movie)}>{movie.original_title}</h2> */}
              </div>
            ))
          ) : (
            <></>
          )}
        </>
      ) : (
        <Single movie={movieQuery.id} />
      )}
    </div>
  );
}

export default Search;
