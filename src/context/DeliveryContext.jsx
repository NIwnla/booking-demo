import React, { createContext, useEffect, useState } from 'react';

export const DeliveryContext = createContext({
    location: null,
    cart: [],
    latestCartItem: null,
    setLocation: (newLocation) => { },
    addToCart: (food) => { },
    generateCartItemKey: (food) => { },
    decreaseQuantity: (cartItemKey) => { },
    removeFromCart: (cartItemKey) => { },
    clearCart: () => { },
});

const generateCartItemKey = (food) => {
    const optionIds = food.options.length > 0
        ? food.options.map(opt => opt.id).sort().join('-')
        : 'no-options';

    return `${food.id}-${optionIds}`;
};

export const DeliveryProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [cart, setCart] = useState([]);
    const [latestCartItem, setLatestCartItem] = useState(null); // Stores the latest added item

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

    const addToCart = (food) => {
        setCart((prevCart) => {
            // Generate unique cart item key first
            const cartItemKey = generateCartItemKey(food);

            // Check if item already exists
            const existingItem = prevCart.find(cartItem => cartItem.cartItemKey === cartItemKey);

            if (existingItem) {
                // If exists, increase quantity and update total
                const updatedCart = prevCart.map(cartItem =>
                    cartItem.cartItemKey === cartItemKey
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + 1,
                            total: (cartItem.basePrice + cartItem.options.reduce((sum, opt) => sum + opt.price, 0)) * (cartItem.quantity + 1),
                        }
                        : cartItem
                );

                setLatestCartItem({
                    ...existingItem,
                    quantity: existingItem.quantity + 1
                });

                localStorage.setItem('cart', JSON.stringify(updatedCart));
                return updatedCart;
            }

            // Create a new cart item
            const newCartItem = {
                id: food.id,
                nameEN: food.nameEN,
                nameVN: food.nameVN,
                imagePath: food.imagePath,
                basePrice: food.basePrice,
                options: food.options,
                total: food.basePrice + food.options.reduce((sum, opt) => sum + opt.price, 0),
                cartItemKey,
                quantity: 1
            };

            const updatedCart = [...prevCart, newCartItem];

            // Update latestCartItem with the newly added item
            setLatestCartItem(newCartItem);

            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const decreaseQuantity = (cartItemKey) => {
        setCart((prevCart) => {
            const updatedCart = prevCart
                .map((item) =>
                    item.cartItemKey === cartItemKey
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                            total: (item.basePrice + item.options.reduce((sum, opt) => sum + opt.price, 0)) * (item.quantity - 1),
                        }
                        : item
                )
                .filter((item) => item.quantity > 0);
            setLatestCartItem(null);
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
        setLatestCartItem(null); // Clear latestCartItem when cart is emptied
        localStorage.removeItem('cart');
    };

    return (
        <DeliveryContext.Provider value={{
            location,
            cart,
            latestCartItem, // Expose latestCartItem
            setLocation: updateLocation,
            addToCart,
            decreaseQuantity,
            removeFromCart,
            clearCart,
            generateCartItemKey
        }}>
            {children}
        </DeliveryContext.Provider>
    );
};
