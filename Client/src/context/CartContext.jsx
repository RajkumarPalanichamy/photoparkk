import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart count and items
  const fetchCartData = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setCartCount(0);
      setCartItems([]);
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      if (!parsedUser || !parsedUser._id) {
        setCartCount(0);
        setCartItems([]);
        return;
      }
      const { data } = await axiosInstance.get(`/cart/user/${parsedUser._id}`);
      const items = data || [];
      setCartItems(items);
      setCartCount(items.length);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCartCount(0);
      setCartItems([]);
    }
  };

  // Add item to cart
  const addToCart = async (cartData) => {
    setLoading(true);
    try {
      await axiosInstance.post("/cart", cartData);
      await fetchCartData(); // Refresh cart data
      return { success: true };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      await axiosInstance.delete(`/cart/${itemId}`);
      await fetchCartData(); // Refresh cart data
      return { success: true };
    } catch (error) {
      console.error("Error removing from cart:", error);
      return { success: false, error: error.message };
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const allItems = Object.values(cartItems).flat();
      await Promise.all(
        allItems.map((item) => axiosInstance.delete(`/cart/${item._id}`))
      );
      setCartItems([]);
      setCartCount(0);
      return { success: true };
    } catch (error) {
      console.error("Error clearing cart:", error);
      return { success: false, error: error.message };
    }
  };

  // Initialize cart data when user changes
  useEffect(() => {
    fetchCartData();
  }, []);

  // Listen for storage changes (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchCartData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    cartCount,
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCartData,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 