import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="header">
      <div className="logo">last.fm</div>
      <nav className="main-nav">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Live</a></li>
          <li><a href="#">Music</a></li>
          <li><a href="#">Charts</a></li>
          <li><a href="#">Events</a></li>
          <li><a href="#">Features</a></li>
        </ul>
      </nav>
      <form className="search-box" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search artists, tracks..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>
    </header>
  );
};

export default Header;