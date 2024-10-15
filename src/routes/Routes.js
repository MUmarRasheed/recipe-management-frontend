import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipePage from '../pages/RecipePage';
import MenuPage from '../pages/MenuPage';
import ShoppingListPage from '../pages/ShoppingListPage.js';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
