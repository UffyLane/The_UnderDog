import { useState } from "react";
import "./SearchForm.css";

export default function SearchForm({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
      <label className="search__label" htmlFor="artist">
        Artist
      </label>

      <div className="search__controls">
        <input
          id="artist"
          className="search__input"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search an artist (e.g., Radiohead)"
          required
        />
        <button className="search__button" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}
