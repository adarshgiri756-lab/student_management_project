const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <label className="search-box">
    <span>Search</span>
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
  </label>
);

export default SearchBar;
