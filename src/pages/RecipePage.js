import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/RecipePage.css';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: [{ name: '', quantity: '' }],
    steps: [''],
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const validateRecipe = () => {
    const newErrors = {};
    if (!newRecipe.title.trim()) {
      newErrors.title = 'Recipe title is required';
    }
    if (newRecipe.ingredients.length === 0 || newRecipe.ingredients.some(ing => !ing.name.trim() || !ing.quantity.trim())) {
      newErrors.ingredients = 'All ingredients must have a name and quantity';
    }
    if (newRecipe.steps.length === 0 || newRecipe.steps.some(step => !step.trim())) {
      newErrors.steps = 'Each step must have content';
    }
    return newErrors;
  };

  const handleAddRecipe = async () => {
    const validationErrors = validateRecipe();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/recipes`, newRecipe);
      fetchRecipes();
      setNewRecipe({ title: '', ingredients: [{ name: '', quantity: '' }], steps: [''] });
      setErrors({}); // Clear existing errors after successful submission
      setSuccessMessage('Recipe added successfully!'); // Set success message
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const handleInputChange = (e, index, type) => {
    if (type === 'ingredient') {
      const { name, value } = e.target;
      const ingredients = [...newRecipe.ingredients];
      ingredients[index][name] = value;
      setNewRecipe({ ...newRecipe, ingredients });
    } else if (type === 'step') {
      const steps = [...newRecipe.steps];
      steps[index] = e.target.value;
      setNewRecipe({ ...newRecipe, steps });
    }
  };

  const addIngredientField = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { name: '', quantity: '' }],
    });
  };

  const addStepField = () => {
    setNewRecipe({
      ...newRecipe,
      steps: [...newRecipe.steps, ''],
    });
  };

  const handleDeleteRecipe = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmDelete) return; // If the user cancels, do nothing
  
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/recipes/${id}`);
      setRecipes(recipes.filter(recipe => recipe._id !== id)); // Remove the deleted recipe from state
      setSuccessMessage('Recipe deleted successfully!'); // Set success message
      setTimeout(() => setSuccessMessage(''), 2000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };
  

  return (
    <div className="recipe-page">
      <h2>Favourite Recipes</h2>
      <div className="add-recipe">
        <h3>Add New Recipe</h3>
        <input
          type="text"
          placeholder="Recipe Title"
          value={newRecipe.title}
          onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
        />
        {errors.title && <p className="error-message">{errors.title}</p>}

        {/* Ingredients */}
        <h4>Ingredients</h4>
        {newRecipe.ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-fields">
            <input
              type="text"
              placeholder="Ingredient Name"
              name="name"
              value={ingredient.name}
              onChange={(e) => handleInputChange(e, index, 'ingredient')}
            />
            <input
              type="text"
              placeholder="Quantity"
              name="quantity"
              value={ingredient.quantity}
              onChange={(e) => handleInputChange(e, index, 'ingredient')}
            />
          </div>
        ))}
        {errors.ingredients && <p className="error-message">{errors.ingredients}</p>}
        <button className="add-more" onClick={addIngredientField}>Add More Ingredient</button>

        {/* Steps */}
        <h4>Steps</h4>
        {newRecipe.steps.map((step, index) => (
          <div key={index} className="step-fields">
            <input
              type="text"
              placeholder={`Step ${index + 1}`}
              value={step}
              onChange={(e) => handleInputChange(e, index, 'step')}
            />
          </div>
        ))}
        {errors.steps && <p className="error-message">{errors.steps}</p>}
        <button className="add-more" onClick={addStepField}>Add More Step</button>

        {/* Submit Button */}
        <button className="submit-recipe" onClick={handleAddRecipe}>Add Recipe</button>

        {/* Success Message */}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>

      <div className="navigation-links">
        <Link to="/menu">Go to Menu</Link>
        <Link to="/shopping-list">Go to Shopping List</Link>
      </div>

      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
          <h3>{recipe.title}
          <button className="remove-button" onClick={() => handleDeleteRecipe(recipe._id)}>Remove</button>
          </h3>
            <ul>
              <li>
                <strong>Ingredients:</strong> {recipe.ingredients.map(ing => `${ing.name} - ${ing.quantity}`).join(', ')}
              </li>
            </ul>
            <p>Steps:</p>
            <div className="step-list">
              {recipe.steps.map((step, idx) => (
                <p key={idx} className="step-item">{step}</p>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipePage;
