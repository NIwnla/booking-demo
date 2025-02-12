import React, { createContext, useState, useEffect } from 'react';

export const DeliveryContext = createContext({
    location: null,
    cart: [],
    setLocation: (newLocation) => { },
    addToCart: (item) => { },
    generateCartItemKey: (item) => { },
    decreaseQuantity: (cartItemKey) => { },
    removeFromCart: (cartItemKey) => { },
    clearCart: () => { },
});

const generateCartItemKey = (item) => {
    const optionIds = item.options.map(opt => opt.id).sort().join('-');
    return `${item.id}-${optionIds}`;
};

export const DeliveryProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        const storedLocation = localStorage.getItem('location');

        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedLocation) setLocation(storedLocation);
    }, []);

    const updateLocation = (newLocation) => {
        setLocation(newLocation);
        localStorage.setItem('location', newLocation); 
    };

    const addToCart = (item) => {
        setCart((prevCart) => {
            const cartItemKey = generateCartItemKey(item);

            const existingItem = prevCart.find((cartItem) => cartItem.cartItemKey === cartItemKey);

            let updatedCart;
            if (existingItem) {
                updatedCart = prevCart.map((cartItem) =>
                    cartItem.cartItemKey === cartItemKey
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                updatedCart = [...prevCart, { ...item, cartItemKey, quantity: 1 }];
            }

            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const decreaseQuantity = (cartItemKey) => {
        setCart((prevCart) => {
            const updatedCart = prevCart
                .map((item) =>
                    item.cartItemKey === cartItemKey ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0);

            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const removeFromCart = (cartItemKey) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.cartItemKey !== cartItemKey);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    return (
        <DeliveryContext.Provider value={{ location, cart, setLocation: updateLocation, addToCart, decreaseQuantity, removeFromCart, clearCart, generateCartItemKey }}>
            {children}
        </DeliveryContext.Provider>
    );
};
