import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Recipes</Link></li>
        <li><Link to="/menu">Weekly Menu</Link></li>
        <li><Link to="/shopping-list">Shopping List</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
