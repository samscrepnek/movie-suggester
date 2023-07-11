import { useState, useEffect } from "react";
import options from "../constants/options.js";

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
  const [numClicks, setNumClicks] = useState(0);
  let query = movie;

  let fetchMovies = async () => {
    // Fetch Query Data
    let queryString = query.movie.toString();
    let queryResults = await fetch(`https://api.themoviedb.org/3/movie/${queryString}&language=en-US`, options);
    const queryJsonData = await queryResults.json();
    let queryRatingGte = (queryJsonData.vote_average - 0.5).toString();
    let queryRatingLte = (queryJsonData.vote_average + 0.5).toString();
    let queryGenresString = queryJsonData.genres.map((genre) => genre.id.toString()).join("%2C%20");
    let queryGenresIds = queryJsonData.genres.map((genre) => genre.id);
    let excludeGenres = "";
    if (!queryGenresIds.find((element) => element === 10751)) {
      excludeGenres = "&without_genres=10751";
    }
    setQueryData(queryJsonData);

    // Fetch Suggested Movies Data
    let suggestedResults = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&vote_average.gte=${queryRatingGte}&vote_average.lte=${queryRatingLte}&vote_count.gte=10&with_genres=${queryGenresString}&with_original_language=en${excludeGenres}`, options);
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
    let movie = suggestedResults[numClicks];
    if (movie.id === queryData.id) {
      movie = suggestedResults[numClicks + 1];
      setNumClicks(numClicks + 2);
    } else {
      setNumClicks(numClicks + 1);
    }
    setSuggestedMovie(movie);
    if (numClicks + 1 === numSuggested) {
      setNoMoreMovies(true);
    }
  };

  return (
    <>
      {suggestedMovie ? (
        <div>
          <section>
            <p>{`Based on your search of "${queryData.title}", we suggest...`}</p>
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
              {suggestedMovie ? <p>{`Doesn't look like something you'll like? Try clicking the "Get a Suggestion" button again to get a different sugggestion based on your original search of "${queryData.title}".`}</p> : <></>}
              <button className="suggestion-btn" onClick={handleClick}>
                Get a Suggestion
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
