import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moviesData, setMoviesData] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTFjYTA0NWJmNGJkNzZlYWUxYWM3YWI0ZTliZjVlZSIsInN1YiI6IjY0OWIzZjJiYWY1OGNiMDBmZmY5YTkyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3-cjaKmd_luLs19aUZNpCuLvubL5pjY7IQDBS4UgAIs",
    },
  };

  let fetchData = async () => {
    let results = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1`, options);
    const jsonData = await results.json();
    setMoviesData(jsonData.results);
    console.log(jsonData.results);
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <input type="text" onChange={handleChange}></input>
      <h2>{searchQuery}</h2>
      {moviesData.map((movie) => (
        <div key={movie.id}>
          <Link to={`Single/${movie.id}`}>
            <h3>{movie.original_title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Search;
