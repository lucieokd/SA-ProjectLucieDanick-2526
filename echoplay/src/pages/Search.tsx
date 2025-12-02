import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Searchbar from "../components/Search/Searchbar";

const Search = () => {
  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <div className="col-12">
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-10 col-xl-8 mx-auto">
          <Searchbar />
        </div>
      </div>
    </div>
  );
};

export default Search;
