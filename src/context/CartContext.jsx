// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart_items") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.sku === newItem.sku && i.pharmacyId === newItem.pharmacyId
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.max(1, (next[idx].qty || 1) + (newItem.qty || 1)) };
        return next;
      }
      return [...prev, { ...newItem, qty: Math.max(1, newItem.qty || 1) }];
    });
  };

  const updateQty = (sku, pharmacyId, qty) => {
    setItems((prev) =>
      prev.map((i) =>
        i.sku === sku && i.pharmacyId === pharmacyId ? { ...i, qty: Math.max(1, qty) } : i
      )
    );
  };

  const removeFromCart = (sku, pharmacyId) => {
    setItems((prev) => prev.filter((i) => !(i.sku === sku && i.pharmacyId === pharmacyId)));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
    const delivery = items.length ? 1200 : 0; // mock fee
    const total = subtotal + delivery;
    return { subtotal, delivery, total };
  }, [items]);

  const value = { items, addToCart, updateQty, removeFromCart, clearCart, totals };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
