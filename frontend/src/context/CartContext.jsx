import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

const CART_KEY = 'cart_items';
const MIN_QTY = 1;
const MAX_QTY = 99;

function clampQty(q) {
    const n = parseInt(q, 10);
    if (isNaN(n) || n < MIN_QTY) return MIN_QTY;
    if (n > MAX_QTY) return MAX_QTY;
    return n;
}

function loadCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return parsed.map(i => ({ ...i, quantity: clampQty(i.quantity) }));
    } catch {
        return [];
    }
}

function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart);
    const [toast, setToast] = useState(null);
    const toastTimer = useRef(null);

    useEffect(() => {
        saveCart(items);
    }, [items]);

    const showToast = useCallback((productName) => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToast(productName);
        toastTimer.current = setTimeout(() => setToast(null), 2200);
    }, []);

    const addItem = useCallback((product) => {
        setItems(prev => {
            const idx = prev.findIndex(i => i.productId === product.productId);
            if (idx !== -1) {
                const updated = [...prev];
                const newQty = clampQty(updated[idx].quantity + (product.quantity || 1));
                updated[idx] = {
                    ...updated[idx],
                    quantity: newQty,
                    name: product.name || updated[idx].name,
                    price: product.price ?? updated[idx].price,
                    image: product.image ?? updated[idx].image
                };
                return updated;
            }
            return [...prev, {
                productId: product.productId,
                name: product.name,
                price: product.price,
                quantity: clampQty(product.quantity || 1),
                image: product.image || null
            }];
        });
        showToast(product.name);
    }, [showToast]);

    const removeItem = useCallback((productId) => {
        setItems(prev => prev.filter(i => i.productId !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        const clamped = clampQty(quantity);
        setItems(prev => prev.map(i =>
            i.productId === productId ? { ...i, quantity: clamped } : i
        ));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const dismissToast = useCallback(() => {
        setToast(null);
        if (toastTimer.current) clearTimeout(toastTimer.current);
    }, []);

    const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

    const totalPrice = useMemo(() => items.reduce((sum, i) => sum + (Number(i.price) || 0) * i.quantity, 0), [items]);

    const value = useMemo(() => ({
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
        toast,
        dismissToast,
        MIN_QTY,
        MAX_QTY
    }), [items, addItem, removeItem, updateQuantity, clearCart, itemCount, totalPrice, toast, dismissToast]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
