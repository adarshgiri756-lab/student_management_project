const FilterBar = ({ filters, onChange, options }) => (
  <div className="filter-bar">
    {options.map((option) => (
      <label key={option.name}>
        {option.label}
        <select value={filters[option.name] || ''} onChange={(event) => onChange(option.name, event.target.value)}>
          <option value="">All</option>
          {option.values.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    ))}
  </div>
);

export default FilterBar;
