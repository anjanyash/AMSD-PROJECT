import React from 'react'
import "../styles/BestSellers.css";
import HoverImage from 'react-hover-image/build';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Spinner } from '@chakra-ui/react';

const BestSellers = () => {
  const { products, loading } = useProducts("bestSeller");

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className='bestSellerMainParent flex flex-row'>
      {products.slice(0,4).map((item) => (
        <Link to={`/${item.id}`} key={item.id}>  
          <div className="bestSellerIndivitualItem">
            <HoverImage src={item.primaryImage} hoverSrc={item.hoverImg} className="bestSellerImage rounded-xl mb-6"/>
            <p className='bestSellerName text-center mb-2'> {item.name} </p>
            <p className=' font-normal text-center'> ₹{item.price} </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default BestSellers;
