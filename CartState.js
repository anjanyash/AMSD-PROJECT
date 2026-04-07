import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const loadCartState = () => {
    try {
        const serializedState = localStorage.getItem('cartState');
        if (serializedState === null) {
            return { items: [], totalQuantity: 0 };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return { items: [], totalQuantity: 0 };
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: loadCartState(),
    reducers: {
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);
            state.totalQuantity++;

            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    name: newItem.title,
                    picture:newItem.image,

                });
            }
            else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price
            }
        },

        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            state.totalQuantity--;
            if (existingItem.quantity === 1) {
                state.items = state.items.filter(item => item.id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            }
        },
    }
})

const localStorageMiddleware = store => next => action => {
    const result = next(action);
    localStorage.setItem('cartState', JSON.stringify(store.getState().cart));
    return result;
};

const store = configureStore({ 
    reducer: { cart: cartSlice.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware)
})

export default store;
export const cartActions=cartSlice.actions;
