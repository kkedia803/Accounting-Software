import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const MenuManagement = () => {
    const { user, isAuthenticated } = useAuth();
    const [menu, setMenu] = useState({
        categories: []
    });

    // State for managing form inputs
    const [categoryName, setCategoryName] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [halfAvailable, setHalfAvailable] = useState(false);
    const [halfPrice, setHalfPrice] = useState('');
    const [error, setError] = useState(null);

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" />;
    }

    // Add a new category
    const addCategory = () => {
        if (!categoryName.trim()) {
            setError('Category name cannot be empty');
            return;
        }

        setMenu(prevMenu => ({
            ...prevMenu,
            categories: [
                ...prevMenu.categories,
                {
                    name: categoryName,
                    items: []
                }
            ]
        }));
        setCategoryName('');
        setError(null);
    };

    // Add an item to a specific category
    const addItem = (categoryIndex) => {
        if (!itemName.trim() || !itemPrice) {
            setError('Item name and price are required');
            return;
        }

        const newItem = {
            name: itemName,
            description: itemDescription,
            price: parseFloat(itemPrice),
            halfAvailable,
            halfPrice: halfAvailable ? parseFloat(halfPrice) : null
        };

        const updatedCategories = [...menu.categories];
        updatedCategories[categoryIndex].items.push(newItem);

        setMenu(prevMenu => ({
            ...prevMenu,
            categories: updatedCategories
        }));

        // Reset item inputs
        setItemName('');
        setItemDescription('');
        setItemPrice('');
        setHalfAvailable(false);
        setHalfPrice('');
        setError(null);
    };

    // Remove a category
    const removeCategory = (categoryIndex) => {
        const updatedCategories = menu.categories.filter((_, index) => index !== categoryIndex);
        setMenu(prevMenu => ({
            ...prevMenu,
            categories: updatedCategories
        }));
    };

    // Remove an item from a category
    const removeItem = (categoryIndex, itemIndex) => {
        const updatedCategories = [...menu.categories];
        updatedCategories[categoryIndex].items.splice(itemIndex, 1);

        setMenu(prevMenu => ({
            ...prevMenu,
            categories: updatedCategories
        }));
    };

    // Submit menu to backend
    const handleSubmitMenu = async () => {
        try {
            console.log('Submitting menu:', menu.categories); // Log payload
            const token = localStorage.getItem('token');

            const response = await axios.post(
                'http://localhost:5000/api/menu/create',
                { categories: menu.categories },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 201) {
                alert('Menu created successfully!');
                setMenu({ categories: [] });
            }
        } catch (err) {
            console.error('Error submitting menu:', err);
            setError(err.response?.data?.message || 'Failed to create menu');
        }
    };

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Create Your Restaurant Menu</h1>
                <div className="text-gray-600">
                    {/* Welcome, {user?.name || 'User'} */}
                </div>
            </div>

            <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Category Input */}
                <div className="md:flex mb-4 md:space-y-0 space-y-5">
                    <input
                        type="text"
                        placeholder="Category Name (e.g., Appetizers)"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="flex-grow w-full p-2 border rounded-l"
                    />
                    <button
                        onClick={addCategory}
                        className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600 flex items-center"
                    >
                        <Plus className="mr-2" /> Add Category
                    </button>
                </div>

                {/* Categories Display */}
                {menu.categories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="mb-6 bg-white shadow-md rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{category.name}</h2>
                            <button
                                onClick={() => removeCategory(categoryIndex)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 />
                            </button>
                        </div>

                        {/* Item Input for this Category */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Description (Optional)"
                                value={itemDescription}
                                onChange={(e) => setItemDescription(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Full Price"
                                value={itemPrice}
                                onChange={(e) => setItemPrice(e.target.value)}
                                className="p-2 border rounded"
                            />
                            <div className="md:flex items-center">
                                <input
                                    type="checkbox"
                                    checked={halfAvailable}
                                    onChange={(e) => setHalfAvailable(e.target.checked)}
                                    className="mr-2"
                                />
                                <span>Half Portion?</span>
                                {halfAvailable && (
                                    <input
                                        type="number"
                                        placeholder="Half Price"
                                        value={halfPrice}
                                        onChange={(e) => setHalfPrice(e.target.value)}
                                        className="ml-2 p-2 border rounded"
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => addItem(categoryIndex)}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
                        >
                            <Plus className="mr-2" /> Add Item to {category.name}
                        </button>

                        {/* Items List */}
                        <div className="mt-4">
                            {category.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
                                >
                                    <div>
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-gray-600 ml-2">${item.price}</span>
                                        {item.halfAvailable && (
                                            <span className="text-gray-500 ml-2">
                                                Half: Rs{item.halfPrice}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeItem(categoryIndex, itemIndex)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Submit Button */}
                {menu.categories.length > 0 && (
                    <div className="text-center mt-6">
                        <button
                            onClick={handleSubmitMenu}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                        >
                            Save Entire Menu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuManagement;