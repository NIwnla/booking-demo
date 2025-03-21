import React, { createContext, useEffect, useState } from 'react';

export const DeliveryContext = createContext({
    location: null,
    cart: [],
    latestCartItem: null,
    deliveryTime: null,
    condiments: {},
    sustainableOptions: {},
    setLocation: (newLocation) => { },
    setDeliveryTime: (time) => { },
    addToCart: (food) => { },
    generateCartItemKey: (food) => { },
    decreaseQuantity: (cartItemKey) => { },
    removeFromCart: (cartItemKey) => { },
    clearCart: () => { },
    updateCondiments: (id, checked, quantity) => { },
    updateSustainableOptions: (id, checked) => { },
    isPopoverVisible: false,
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
    const [latestCartItem, setLatestCartItem] = useState(null);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState(null);
    const [condiments, setCondiments] = useState({
        ketchup: { checked: false, quantity: 1 },
        chilli_sauce: { checked: false, quantity: 1 },
        chilli_oil: { checked: false, quantity: 1 },
        honey: { checked: false, quantity: 1 },
    });

    const [sustainableOptions, setSustainableOptions] = useState({
        cutlery: { checked: false },
        pizza_reheating_foil: { checked: false },
        heating_instructions: { checked: false }
    });

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        const storedLocation = localStorage.getItem('location');
        const storedDeliveryTime = localStorage.getItem('deliveryTime');
        const storedCondiments = localStorage.getItem('condiments');
        const storedSustainableOptions = localStorage.getItem('sustainableOptions');

        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedLocation) setLocation(JSON.parse(storedLocation));
        if (storedDeliveryTime) setDeliveryTime(JSON.parse(storedDeliveryTime));
        if (storedCondiments) setCondiments(JSON.parse(storedCondiments));
        if (storedSustainableOptions) setSustainableOptions(JSON.parse(storedSustainableOptions));
    }, []);

    useEffect(() => {
        let timeoutId;
        if (latestCartItem) {
            setIsPopoverVisible(true);
            timeoutId = setTimeout(() => setIsPopoverVisible(false), 3000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [latestCartItem]);

    const updateDeliveryTime = (time) => {
        setDeliveryTime(time);
        localStorage.setItem('deliveryTime', JSON.stringify(time));
    };

    const updateLocation = (newLocation) => {
        setLocation(newLocation);
        localStorage.setItem('location', JSON.stringify(newLocation));
    };

    const updateCondiments = (id, checked, quantity) => {
        setCondiments(prev => {
            const updated = {
                ...prev,
                [id]: { ...prev[id], checked, quantity }
            };
            localStorage.setItem('condiments', JSON.stringify(updated));
            return updated;
        });
    };

    const updateSustainableOptions = (id, checked) => {
        setSustainableOptions(prev => {
            const updated = {
                ...prev,
                [id]: { ...prev[id], checked }
            };
            localStorage.setItem('sustainableOptions', JSON.stringify(updated));
            return updated;
        });
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
        setLatestCartItem(null);
        setDeliveryTime(null);
        setCondiments({
            ketchup: { checked: false, quantity: 1 },
            chilli_sauce: { checked: false, quantity: 1 },
            chilli_oil: { checked: false, quantity: 1 },
            honey: { checked: false, quantity: 1 },
        });
        setSustainableOptions({
            cutlery: { checked: false },
            pizza_reheating_foil: { checked: false },
            heating_instructions: { checked: false }
        });
        localStorage.removeItem('cart');
        localStorage.removeItem('deliveryTime');
        localStorage.removeItem('condiments');
        localStorage.removeItem('sustainableOptions');
    };

    return (
        <DeliveryContext.Provider value={{
            location,
            cart,
            latestCartItem,
            deliveryTime,
            condiments,
            sustainableOptions,
            setLocation: updateLocation,
            setDeliveryTime: updateDeliveryTime,
            addToCart,
            decreaseQuantity,
            removeFromCart,
            clearCart,
            generateCartItemKey,
            updateCondiments,
            updateSustainableOptions,
            isPopoverVisible,
        }}>
            {children}
        </DeliveryContext.Provider>
    );
};
