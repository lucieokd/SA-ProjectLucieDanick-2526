import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Searchbar from "../components/Search/Searchbar";
import GenreSearch from "../components/Search/GenresSearch";

const Search = () => {
  return (
    <div className="container-fluid px-4 py-5">
      <Searchbar />
    </div>
  );
};

export default Search;
