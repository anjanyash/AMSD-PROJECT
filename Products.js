import React from 'react'
import OurBestSellers from './OurBestSellers';
import { useProducts } from '../hooks/useProducts';
import { Spinner } from '@chakra-ui/react';

const Products = () => {
    const { products, loading } = useProducts("ourBestSellers");

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0' }}>
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <div className='ourBestSellersMainParent'>
            {products.map((item) => (
                <OurBestSellers
                    key={item.id}
                    id={item.id}
                    title={item.name}
                    price={item.price}
                    image={item.primaryImage}
                />
            ))}
        </div>
    )
}

export default Products
