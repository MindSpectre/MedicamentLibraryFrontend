'use client';

import TopBar from './top-bar';
import Navigation from './navigation';
import './header.css'; // Import the CSS file

export default function Header() {
  return (
      <header className="header">
        <TopBar />
        <Navigation />
      </header>
  );
}
