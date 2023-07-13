import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Single from "./single.js";
import options from "../constants/options.js";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movieQuery, setMovieQuery] = useState("");
  const [moviesData, setMoviesData] = useState([]);
  const [showMovie, setShowMovie] = useState(false);
  const [showSearchIcon, setShowSearchIcon] = useState(true);

  let fetchData = async () => {
    let results = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1&with_original_language=en-US`, options);
    const jsonData = await results.json();
    setMoviesData(jsonData.results);
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleChange = (event) => {
    setShowMovie(false);
    setShowSearchIcon(false);
    setSearchQuery(event.target.value);
  };

  const handleClick = (movie) => {
    setMovieQuery(movie);
    setShowMovie(true);
    setShowSearchIcon(true);
    document.getElementById("search-bar-input").value = "";
  };

  return (
    <div className="content-wrapper">
      <section className="search-bar">
        <div className="input-group mb-3">
          <input type="text" id="search-bar-input" className="form-control" aria-label="Search bar input" aria-describedby="inputSearch-bar" onChange={handleChange}></input>
          {showSearchIcon ? (
            <span className="input-group-text" id="search-bar-span">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </span>
          ) : (
            <></>
          )}
        </div>
      </section>
      {!showMovie ? (
        <section className="search-results">
          {moviesData.length > 0 ? (
            moviesData.map((movie) => (
              <article className="result" key={movie.id}>
                <button onClick={() => handleClick(movie)}>
                  {movie.poster_path ? <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt={`Poster for ${movie.title}`} async></img> : <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/No_image_poster.png" alt="Default poster when no poster is available." async></img>}
                  <div className="movie-results-info">
                    <div className="results-title/release">
                      <p>{movie.title}</p>
                      <p>{movie.release_date}</p>
                    </div>
                    <p>{movie.overview}</p>
                  </div>
                </button>
              </article>
            ))
          ) : (
            <p>Type a movie title into the search bar to get a suggestion.</p>
          )}
        </section>
      ) : (
        <Single movie={movieQuery.id} />
      )}
    </div>
  );
}

export default Search;
