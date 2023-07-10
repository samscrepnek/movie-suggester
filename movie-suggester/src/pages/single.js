import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Single(movie) {
  const [queryData, setQueryData] = useState([]);
  const [queryRatingGte, setQueryRatingGte] = useState();
  const [queryRatingLte, setQueryRatingLte] = useState();
  const [queryGenres, setQueryGenres] = useState("");
  const [queryTitle, setQueryTitle] = useState("");
  const [suggestedMovie, setSuggestedMovie] = useState();
  const [noMoreMovies, setNoMoreMovies] = useState(false);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTFjYTA0NWJmNGJkNzZlYWUxYWM3YWI0ZTliZjVlZSIsInN1YiI6IjY0OWIzZjJiYWY1OGNiMDBmZmY5YTkyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3-cjaKmd_luLs19aUZNpCuLvubL5pjY7IQDBS4UgAIs",
    },
  };

  let query = movie;
  console.log(query);
  let fetchQuery = async () => {
    let queryString = query.movie.toString();
    // console.log(queryString);
    let results = await fetch(`https://api.themoviedb.org/3/movie/${queryString}&language=en-US`, options);
    const jsonData = await results.json();
    setQueryData(jsonData);
    setQueryRatingGte((jsonData.vote_average - 0.5).toString());
    setQueryRatingLte((jsonData.vote_average + 0.5).toString());
    setQueryGenres(jsonData.genres.map((genre) => genre.id.toString()).join("%2C%20"));
    setQueryTitle(jsonData.original_title);
  };

  useEffect(() => {
    fetchQuery();
  }, [query]);

  let handleClick = async () => {
    let randMovie = [];
    let results = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&vote_average.gte=${queryRatingGte}&vote_average.lte=${queryRatingLte}&vote_count.gte=10&with_genres=${queryGenres}&with_original_language=en`, options);
    const jsonData = await results.json();

    if (jsonData.results.lenght > 0) {
      do {
        let randNum = Math.floor(Math.random() * jsonData.results.length);
        randMovie = jsonData.results[randNum];
        // delete jsonData.results[randNum];
      } while (randMovie.id === queryData.id);
      // } while (suggestedMovie ?? randMovie.id === suggestedMovie.id);
      setSuggestedMovie(randMovie);
    } else {
      setNoMoreMovies(true);
    }
  };

  return (
    <>
      <p>{queryRatingGte}</p>
      <p>{queryRatingLte}</p>
      <p>{queryGenres}</p>
      <p>{queryTitle}</p>

      <button className="suggestion-btn" onClick={handleClick}>
        get suggestion
      </button>
      {suggestedMovie ? <p>{suggestedMovie.original_title}</p> : <></>}
    </>
  );
}
export default Single;
