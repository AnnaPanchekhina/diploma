import React from 'react';

interface FooterProps {
  onBackToHome: () => void;
}

const Footer: React.FC<FooterProps> = ({ onBackToHome }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Help</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onBackToHome(); }}>Back to home</a>
        </div>
        <div className="copyright">
          © 2025 Last.fm Ltd. All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;