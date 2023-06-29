import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Single() {
  const [searchQuery, setSearchQuery] = useState("");
  const [queryRating, setQueryRating] = useState("");
  const [queryGenres, setQueryGenres] = useState("");
  const [queryTitle, setQueryTitle] = useState("");
  const [queryId, setQueryId] = useState("");
  const [movieData, setMovieData] = useState();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTFjYTA0NWJmNGJkNzZlYWUxYWM3YWI0ZTliZjVlZSIsInN1YiI6IjY0OWIzZjJiYWY1OGNiMDBmZmY5YTkyZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3-cjaKmd_luLs19aUZNpCuLvubL5pjY7IQDBS4UgAIs",
    },
  };

  let query = useParams();

  let fetchQuery = async () => {
    let queryString = query.id.toString();
    let results = await fetch(`https://api.themoviedb.org/3/movie/${queryString}&language=en-US`, options);
    const jsonData = await results.json();
    setQueryRating(jsonData.vote_average.toString());
    setQueryGenres(jsonData.genres.map((genre) => genre.id.toString()).join("%2C%20"));
    setQueryTitle(jsonData.original_title);
    setQueryId(jsonData.id);
  };

  useEffect(() => {
    fetchQuery();
  }, []);

  let fetchSuggestion = async () => {
    let suggestedMovie = [];
    let results = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.asc&vote_average.gte=${queryRating}&with_genres=${queryGenres}`, options);
    const jsonData = await results.json();
    let pickMovie = () => {
      suggestedMovie = jsonData.results[Math.floor(Math.random() * jsonData.results.length)];
    };
    pickMovie();
    if (suggestedMovie.id === queryId) {
      pickMovie();
    } else {
      setMovieData(suggestedMovie);
    }
  };

  useEffect(() => {
    fetchSuggestion();
  }, [queryRating, queryGenres]);

  console.log(movieData);

  return (
    <>
      <p>{queryRating}</p>
      <p>{queryGenres}</p>
      <p>{queryTitle}</p>
    </>
  );
}
export default Single;
