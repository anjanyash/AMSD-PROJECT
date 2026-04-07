import { useState, useEffect } from 'react';
import { fetchProducts } from '../api/mockBackend';

export const useProducts = (typeFilter = null) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        fetchProducts()
            .then(data => {
                if (!isMounted) return;
                
                if (typeFilter) {
                    setProducts(data.filter(item => item.type === typeFilter));
                } else {
                    setProducts(data);
                }
                setLoading(false);
            })
            .catch(err => {
                if (!isMounted) return;
                setError(err);
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [typeFilter]);

    return { products, loading, error };
};
