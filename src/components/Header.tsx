import React from 'react';

const Header = () => {
  return (
    <header style={{
      backgroundColor: '#000',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ color: '#d51007', fontSize: '24px', fontWeight: 'bold' }}>
        FakeLast.fm
      </div>
      <nav>
        <ul style={{ 
          display: 'flex', 
          listStyle: 'none', 
          gap: '20px',
          margin: 0,
          padding: 0
        }}>
          <li><a href="/music" style={{ color: 'white', textDecoration: 'none' }}>Музыка</a></li>
          <li><a href="/charts" style={{ color: 'white', textDecoration: 'none' }}>Чарты</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;