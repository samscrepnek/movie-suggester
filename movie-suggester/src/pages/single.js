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
  };

  useEffect(() => {
    fetchMovies();
  }, [query]);

  let handleClick = () => {
    if (numClicked === numSuggested) {
      setNoMoreMovies(true);
    } else {
      let movie = suggestedResults[numClicked];
      if (movie.id === queryData.id) {
        movie = suggestedResults[numClicked + 1];
        setNumClicked(numClicked + 2);
      } else {
        setNumClicked(numClicked + 1);
      }
      setSuggestedMovie(movie);
    }
  };

  return (
    <>
      <p>{queryData.title}</p>
      {!noMoreMovies ? (
        <>
          <button className="suggestion-btn" onClick={handleClick}>
            get suggestion
          </button>
          {suggestedMovie ? <p>{suggestedMovie.title}</p> : <></>}
        </>
      ) : (
        <>
          <p>No more suggestion for this movie. Try searching for a different movie title to get more suggestions.</p>
        </>
      )}
    </>
  );
}
export default Single;
