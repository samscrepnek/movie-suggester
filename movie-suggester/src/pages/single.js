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
  const [poster, setPoster] = useState();
  const [posterSet, setPosterSet] = useState(false);
  let query = movie;

  let getPoster = async (props) => {
    setPosterSet(false);
    let poster = `https://image.tmdb.org/t/p/original/${props}`;
    setPoster(poster);
  };

  useEffect(() => {
    setPosterSet(true);
  }, [poster]);

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
    if (queryJsonData.poster_path) {
      getPoster(queryJsonData.poster_path);
    } else {
      setPosterSet(true);
    }
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
    getPoster(movie.poster_path);
  };

  return (
    <div className="single-wrapper">
      <section className="movie-single">
        {suggestedMovie ? (
          <div>
            <section className="single-query-title">
              <p>{`Based on your search of "${queryData.title}", we suggest...`}</p>
            </section>
            <section className="suggested movie-single-info">
              <h2>{suggestedMovie.title}</h2>
              {/* {suggestedMovie.poster_path ? <img src={`https://image.tmdb.org/t/p/original/${suggestedMovie.poster_path}`} alt={`poster for ${suggestedMovie.title}`} async></img> : <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/No_image_poster.png" alt="Default poster when no poster is available." async></img>} */}
              {posterSet ? <>{suggestedMovie.poster_path ? <img src={poster} alt={`poster for ${suggestedMovie.title}`} async></img> : <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/No_image_poster.png" alt="Default poster when no poster is available." async></img>}</> : <></>}
              <p>{suggestedMovie.overview}</p>
              <p>Released: {suggestedMovie.release_date}</p>
            </section>
          </div>
        ) : (
          <section className="query movie-single-info">
            <h2>{queryData.title}</h2>
            {queryData.poster_path ? <img src={`https://image.tmdb.org/t/p/original/${queryData.poster_path}`} alt={`poster for ${queryData.title}`} async></img> : <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/No_image_poster.png" alt="Default poster when no poster is available." async></img>}
            <p>{queryData.overview}</p>
            <p>Released: {queryData.release_date}</p>
          </section>
        )}
      </section>
      <div className="dividing-line"></div>
      <section className="single-suggestion">
        {noSuggestions ? (
          <p>Looks likes there are no suggestions for this movie. It realy is one of a kind. try searching for a different movie title to get sugggestions.</p>
        ) : (
          <>
            {!noMoreMovies ? (
              <>
                <button className="btn btn-light suggestion-btn" type="button" onClick={handleClick}>
                  Get a Suggestion
                </button>
                {suggestedMovie ? <p className="suggestion-btn-info">{`Doesn't look like something you'll like? Try clicking the "Get a Suggestion" button again to get a different sugggestion based on your original search of "${queryData.title}".`}</p> : <></>}
              </>
            ) : (
              <>
                <p>No more suggestion for this movie. Try searching for a different movie title to get more suggestions.</p>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
export default Single;
