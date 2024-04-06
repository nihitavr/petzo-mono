"use client";

import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type CartItem = Product & { quantity: number };

const CartContext = createContext<{
  cart: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string, quantity: number) => void;
}>({} as any);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")!) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: Product, quantity: number) => {
    const existingItem = cart.find((cartItem) => cartItem.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      setCart([...cart]);
      return;
    }

    setCart([...cart, { ...product, quantity }]);
  };

  const removeItem = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === productId,
      );

      if (existingItem) {
        existingItem.quantity -= quantity;
        return prevCart.filter((item) => item.quantity > 0);
      }

      return prevCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
