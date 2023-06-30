import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Single() {
  const [queryRatingGte, setQueryRatingGte] = useState();
  const [queryRatingLte, setQueryRatingLte] = useState();
  const [queryGenres, setQueryGenres] = useState("");
  const [queryTitle, setQueryTitle] = useState("");
  const [queryId, setQueryId] = useState("");
  const [moviesData, setMoviesData] = useState();
  const [suggestedMovie, setSuggestedMovie] = useState();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTFjYTA0NWJmNGJkNzZlYWUxYWM3YWI0ZTliZjVlZSIsInN1YiI6IjY0OWIzZjJiYWY1OGNiMDBmZmY5YTkyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3-cjaKmd_luLs19aUZNpCuLvubL5pjY7IQDBS4UgAIs",
    },
  };

  let query = useParams();
  console.log(query);
  let fetchQuery = async () => {
    let queryString = query.id.toString();
    let results = await fetch(`https://api.themoviedb.org/3/movie/${queryString}&language=en-US`, options);
    const jsonData = await results.json();
    setQueryRatingGte((jsonData.vote_average - 0.5).toString());
    setQueryRatingLte((jsonData.vote_average + 0.5).toString());
    setQueryGenres(jsonData.genres.map((genre) => genre.id.toString()).join("%2C%20"));
    setQueryTitle(jsonData.original_title);
    setQueryId(jsonData.id);
  };

  useEffect(() => {
    fetchQuery();
  }, [query]);

  let fetchSuggestion = async () => {
    let randMovie = [];
    let results = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&vote_average.gte=${queryRatingGte}&vote_average.lte=${queryRatingLte}&vote_count.gte=10&with_genres=${queryGenres}&with_original_language=en`, options);
    const jsonData = await results.json();
    // console.log(jsonData.results);
    setMoviesData(jsonData.results);
    let pickMovie = () => {
      randMovie = jsonData.results[Math.floor(Math.random() * jsonData.results.length)];
    };
    pickMovie();
    setSuggestedMovie(randMovie);
  };

  useEffect(() => {
    fetchSuggestion();
  }, [queryRatingGte, queryRatingLte, queryGenres, queryId]);

  let checkMovie = async () => {
    if (suggestedMovie.id === queryId) {
      fetchSuggestion();
    }
  };

  useEffect(() => {
    checkMovie();
  }, [suggestedMovie]);

  // console.log(suggestedMovie);
  return (
    <>
      {suggestedMovie ? (
        <>
          <p>{queryRatingGte}</p>
          <p>{queryRatingLte}</p>
          <p>{queryGenres}</p>
          <p>{queryTitle}</p>
          <p>{suggestedMovie.original_title}</p>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
export default Single;
