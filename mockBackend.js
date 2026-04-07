import { store } from '../productsStore/Store';

const SIMULATED_DELAY_MS = 600;

export const fetchProducts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...store]);
        }, SIMULATED_DELAY_MS);
    });
};

export const fetchProductById = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const product = store.find(item => item.id === id);
            if (product) {
                resolve({ ...product });
            } else {
                reject(new Error("Product not found"));
            }
        }, SIMULATED_DELAY_MS);
    });
};

export const fetchProductsByType = (type) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const products = store.filter(item => item.type === type);
            resolve([...products]);
        }, SIMULATED_DELAY_MS);
    });
};
