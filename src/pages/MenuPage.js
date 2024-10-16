import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MenuPage.css';

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [mealType, setMealType] = useState('');
  const [recipeId, setRecipeId] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchMenu();
    fetchRecipes();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/menu`);
      console.log(response.data); // Use the response if needed
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const addToMenu = async () => {
    if (!selectedDay || !mealType || !recipeId) {
      alert('Please select a day, meal type, and recipe before adding to the menu.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/menu`, { day: selectedDay, mealType, recipeId });
      console.log(response.data); // Use the response if needed
      setSuccessMessage('Menu item added successfully!');
      fetchMenu();
      setSelectedDay('');
      setMealType('');
      setRecipeId('');

      setTimeout(() => {
        setSuccessMessage('');
      }, 1000);
    } catch (error) {
      console.error('Error adding to menu:', error);
    }
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day === selectedDay ? '' : day);
  };

  const handleMealTypeSelect = (type) => {
    setMealType(type === mealType ? '' : type);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this menu item?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/menu/${id}`);
      setSuccessMessage('Menu item deleted successfully!');
      fetchMenu();
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div className="menu-page">
      <h2>Weekly Menu</h2>

      <div className="menu-selection-container">
        <h3>Select Day</h3>
        <div className="day-selection">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <button
              key={day}
              className={`day-button ${selectedDay === day ? 'selected' : ''}`}
              onClick={() => handleDaySelect(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <h3>Select Meal Type</h3>
        <div className="meal-type-selection">
          {['breakfast', 'lunch', 'dinner'].map((type) => (
            <button
              key={type}
              className={`meal-type-button ${mealType === type ? 'selected' : ''}`}
              onClick={() => handleMealTypeSelect(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <select
          value={recipeId}
          onChange={(e) => setRecipeId(e.target.value)}
          className="recipe-select"
        >
          <option value="">Select a recipe</option>
          {recipes.map((recipe) => (
            <option key={recipe._id} value={recipe._id}>
              {recipe.title}
            </option>
          ))}
        </select>

        <button className="add-menu-button" onClick={addToMenu}>Add to Menu</button>

        {successMessage && <div className="success-message">{successMessage}</div>}
      </div>

      <h2>Current Menu</h2>
      <ul className="menu-list">
        {menu.map((item) => (
          <li key={item._id} className="menu-item-card">
            <div className="menu-item-details">
              <strong>{item.day} - {item.mealType}</strong>
              <p><strong>Recipe:</strong> {item.recipe ? item.recipe.title : 'No recipe selected'}</p>
              <p><strong>Ingredients:</strong> {item.recipe && item.recipe.ingredients
                ? item.recipe.ingredients.map((ingredient) => `${ingredient.quantity} ${ingredient.name}`).join(', ')
                : 'No ingredients available'}
              </p>
            </div>
            <button className="remove-button" onClick={() => handleDelete(item._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPage;
