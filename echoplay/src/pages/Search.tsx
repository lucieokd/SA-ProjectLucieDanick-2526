import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBarAudius from "../components/SearchBarAudius";

const Search = () => {
  return (
    <div className="container-fluid px-4 py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3" style={{ color: "#6c2bd9" }}>
          Search Tracks on EchoPlay
        </h1>
        <p className="lead text-muted">
          Discover amazing music from the Audius network.
        </p>
      </div>
      <SearchBarAudius />
    </div>
  );
};

export default Search;
