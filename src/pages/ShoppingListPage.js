import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ShoppingListPage.css';

const ShoppingListPage = () => {
  const [shoppingList, setShoppingList] = useState({ items: [] });
  const [ingredient, setIngredient] = useState({ name: '', quantity: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/shopping-list`);
      
      // Check if the response data has items
      if (response.data && response.data.items) {
        setShoppingList(response.data);
      } else {
        setShoppingList({ items: [] }); // Set to empty array if no items
      }
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      // Only log the error, do not set an error message if the list is empty
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = async () => {
    if (!ingredient.name || !ingredient.quantity) {
      setMessage('Please fill in both the ingredient name and quantity.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/shopping-list`, ingredient);
      fetchShoppingList();
      setIngredient({ name: '', quantity: '' });
      setMessage('Ingredient added successfully!');
      setTimeout(() => setMessage(''), 1000); // Clear message after 1s
    } catch (error) {
      console.error('Error adding ingredient:', error);
      setMessage('Failed to add ingredient. Please try again.');
    }
  };

  const markAsBought = async (name) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/shopping-list/bought`, { name });
      fetchShoppingList();
      setMessage(`Marked "${name}" as bought!`);
      setTimeout(() => setMessage(''), 1000); // Clear message after 1s
    } catch (error) {
      console.error('Error marking ingredient as bought:', error);
      const errorMessage = error.response?.data?.message || 'Failed to mark as bought. Please try again.';
      setMessage(errorMessage); // Show specific error message from response
    }
  };

  const clearShoppingList = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/shopping-list/clear`); // Assuming this is the correct endpoint to clear the list
      setShoppingList({ items: [] }); // Manually reset the shopping list state to an empty array
      setMessage('Shopping list cleared successfully!');
      setTimeout(() => setMessage(''), 1000); // Clear message after 1s
    } catch (error) {
      console.error('Error clearing shopping list:', error);
      setMessage('Failed to clear shopping list. Please try again.');
    }
  };

  return (
    <div className="shopping-list-page">
      <h2>Shopping List</h2>
      {message && <p className="success-message">{message}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="input-container">
            <input
              type="text"
              placeholder="Ingredient Name"
              value={ingredient.name}
              onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => setIngredient({ ...ingredient, quantity: e.target.value })}
            />
            <button className="add-ingredient-button" onClick={addIngredient}>Add Ingredient</button>
          </div>

          {shoppingList.items.length > 0 && ( // Only show clear button if there are items
            <div className="clear-button-container">
              <button className="clear-button" onClick={clearShoppingList}>Clear List</button>
            </div>
          )}

          <ul>
            {shoppingList.items.length === 0 ? ( // Check if there are no items
              <p>No Ingredients available</p>
            ) : (
              shoppingList.items.map((item) => (
                <li key={item._id} className={item.bought ? 'bought-item' : ''}>
                  {item.name} - {item.quantity} 
                  <button className="bought-btn" onClick={() => markAsBought(item.name)}>
                    {item.bought ? 'Bought' : 'Mark as Bought'}
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default ShoppingListPage;
