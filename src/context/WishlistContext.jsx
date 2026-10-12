import { createContext, useContext, useState, useEffect } from 'react';
import { get, set } from 'idb-keyval';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Load Wishlist from IndexedDB
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const saved = (await get('handyWishlist')) || [];
        setWishlist(saved);
      } catch (err) {
        console.error('Error loading wishlist:', err);
      }
    };
    loadWishlist();
  }, []);

  // Toggle Wishlist Item (Add/Remove)
  const toggleWishlist = async (product) => {
    let updated;
    const exists = wishlist.some((item) => item.id === product.id);

    if (exists) {
      updated = wishlist.filter((item) => item.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }

    setWishlist(updated);
    await set('handyWishlist', updated);
  };

  // Check if item is in wishlist
  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);