import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Single(movie) {
  // Query Information
  const [queryData, setQueryData] = useState([]);

  // Sugested Information
  const [suggestedResults, setSuggestedResults] = useState();
  const [numSuggested, setNumSuggested] = useState();
  const [suggestedMovie, setSuggestedMovie] = useState();
  const [noMoreMovies, setNoMoreMovies] = useState(false);
  const [noSuggestions, setNoSuggestions] = useState(false);

  // other
  const [numClicked, setNumClicked] = useState(0);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTFjYTA0NWJmNGJkNzZlYWUxYWM3YWI0ZTliZjVlZSIsInN1YiI6IjY0OWIzZjJiYWY1OGNiMDBmZmY5YTkyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3-cjaKmd_luLs19aUZNpCuLvubL5pjY7IQDBS4UgAIs",
    },
  };

  let query = movie;
  console.log(query);
  let fetchMovies = async () => {
    // Fetch Query Data
    let queryString = query.movie.toString();
    let queryResults = await fetch(`https://api.themoviedb.org/3/movie/${queryString}&language=en-US`, options);
    const queryJsonData = await queryResults.json();
    let queryRatingGte = (queryJsonData.vote_average - 0.5).toString();
    let queryRatingLte = (queryJsonData.vote_average + 0.5).toString();
    let queryGenres = queryJsonData.genres.map((genre) => genre.id.toString()).join("%2C%20");
    setQueryData(queryJsonData);

    // Fetch Suggested Movies Data
    let suggestedResults = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&vote_average.gte=${queryRatingGte}&vote_average.lte=${queryRatingLte}&vote_count.gte=10&with_genres=${queryGenres}&with_original_language=en`, options);
    const suggestedJsonData = await suggestedResults.json();
    setSuggestedResults(suggestedJsonData.results.sort(() => Math.random() - 0.5));
    setNumSuggested(suggestedJsonData.results.length);
    if (suggestedJsonData.results.length <= 1) {
      setNoSuggestions(true);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [query]);

  let handleClick = () => {
    let movie = suggestedResults[numClicked];
    if (movie.id === queryData.id) {
      movie = suggestedResults[numClicked + 1];
      setNumClicked(numClicked + 2);
    } else {
      setNumClicked(numClicked + 1);
    }
    setSuggestedMovie(movie);
    if (numClicked + 1 === numSuggested) {
      setNoMoreMovies(true);
    }
  };

  return (
    <>
      {suggestedMovie ? (
        <div>
          <section>
            <p>{`Based on your search of ${queryData.title}, we suggest...`}</p>
          </section>
          <section className="suggested-movie">
            <h2>{suggestedMovie.title}</h2>
            <p>{suggestedMovie.release_date}</p>
            <img src={`https://image.tmdb.org/t/p/original/${suggestedMovie.poster_path}`} style={({ width: 250 + "px" }, { height: 300 + "px" })} alt={`poster for ${suggestedMovie.title}`}></img>
            <p>{suggestedMovie.overview}</p>
          </section>
        </div>
      ) : (
        <section className="query-movie">
          <h2>{queryData.title}</h2>
          <p>{queryData.release_date}</p>
          <img src={`https://image.tmdb.org/t/p/original/${queryData.poster_path}`} style={({ width: 250 + "px" }, { height: 300 + "px" })} alt={`poster for ${queryData.title}`}></img>
          <p>{queryData.overview}</p>
        </section>
      )}
      {noSuggestions ? (
        <p>Looks likes there are no suggestions for this movie. It realy is one of a kind. try searching for a different movie title to get sugggestions.</p>
      ) : (
        <>
          {!noMoreMovies ? (
            <>
              {suggestedMovie ? <p>{`Doesn't look like something you'll like? Try clicking the "get suggestion" button again to get a different sugggestion based on your original search of ${queryData.title}.`}</p> : <></>}
              <button className="suggestion-btn" onClick={handleClick}>
                get suggestion
              </button>
            </>
          ) : (
            <>
              <p>No more suggestion for this movie. Try searching for a different movie title to get more suggestions.</p>
            </>
          )}
        </>
      )}
    </>
  );
}
export default Single;
