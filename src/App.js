import React from 'react';
import AppRoutes from './routes/Routes';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Recipe Management System</h1>
      </header>
      <AppRoutes />
    </div>
  );
}

export default App;
