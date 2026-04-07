import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../styles/Under20.css";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    Spinner,
    Input,
    Select
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import filterBtn from "../assets/filterBtn.png";
import u20bg from "../assets/u20bg.png";
import HoverImage from 'react-hover-image/build';
import JournalSection from "./JournalSection";
import SPFooter from './SPFooter';
import { useProducts } from '../hooks/useProducts';

import { FaShippingFast, FaLock } from 'react-icons/fa';
import { BsCurrencyDollar } from "react-icons/bs";
import better from "../assets/better.jpeg";

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { products: store, loading } = useProducts();
    
    const [sort, setSort] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSortHandler = (e) => {
        setSort(e.target.value);
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    }

    const sortAndSearchProducts = (prods) => {
        let filtered = prods.filter(p => p.name && p.name.toLowerCase().includes(searchQuery));
        if (sort === 'lowToHigh') {
            return filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'highToLow') {
            return filtered.sort((a, b) => b.price - a.price);
        }
        return filtered;
    }

    // A simple heuristic mapping to filter relevant products
    const displayCategoryName = categoryName ? categoryName.replace(/-/g, ' ') : '';

    const categoryProducts = sortAndSearchProducts(
        store.filter(product => {
            const term = displayCategoryName.toLowerCase();
            return (
                (product.name && product.name.toLowerCase().includes(term)) ||
                (product.type && product.type.toLowerCase().includes(term)) ||
                (product.descr && product.descr.toLowerCase().includes(term))
            );
        })
    );

    const bgAddHandler = (e) => {
        e.target.classList.add("whi");
    }

    const bgRemoveHandler = (e) => {
        e.target.classList.remove("whi");
    }

    return (
        <div className='u20MainParent fof '>
            <p className=' bg-white z-50 relative w100vw'>  </p>

            <div className='u20Hold'>
                <img src={u20bg} className="u20Pic" alt="category background" />
            </div>

            <div className='u20HeadingHold gap-20 justify-center relative flex flex-col'>
                <p className='u20Heading uppercase'>{displayCategoryName}</p>
                <p className='u20Desc'>Discover our natural and vegan collection for {displayCategoryName}.</p>
            </div>

            <div className='u20BreadCrumbHold absolute text-sm'>
                <Breadcrumb spacing='8px' separator={<ChevronRightIcon />}>
                    <BreadcrumbItem>
                        <Link to={`/`}>Home</Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <Link to={`/category/${categoryName}`} className="capitalize">{categoryName?.replace(/-/g, ' ')}</Link>
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>

            <div className='filterSortHold flex flex-row gap-8 absolute text-left items-center'>
                <Select placeholder='Sort By Price' onChange={toggleSortHandler} width="200px" bg="white">
                    <option value='lowToHigh'>Price: Low to High</option>
                    <option value='highToLow'>Price: High to Low</option>
                </Select>
                
                <Input 
                    placeholder="Search products..." 
                    onChange={handleSearch} 
                    value={searchQuery}
                    width="250px"
                    bg="white"
                />
            </div>

            {loading ? (
                <div className="flex justify-center relative top-96"><Spinner size="xl" /></div>
            ) : (
                <div className="flex u20prodsHold flex-wrap relative top-96 justify-center text-center">
                    {categoryProducts.length > 0 ? categoryProducts.map((item) => (
                        <div key={item.id} className='card w-96 bg-base-100 shadow-xl'>
                            <Link to={`/${item.id}`}>
                                <figure className="px-10 pt-10">
                                    <HoverImage src={item.primaryImage} hoverSrc={item.hoverImg} className="w-32 u20img" />
                                </figure>
                            </Link>
                            <div className="card-body items-center text-center">
                                <h2 className=" mb-1 fof text-lg font-semibold">{item.name}</h2>
                                <Link to={`/${item.id}`}>
                                    <div className="card-actions">
                                        <button className="btn btn-primary knmBtn" onMouseEnter={bgAddHandler} onMouseLeave={bgRemoveHandler}>Know More </button>
                                        <p className='btnLine relative bg-black h-8'>  </p>
                                        <h2 className=" text-xl mb-2 fof u20Price">₹{item.price}</h2>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="mt-10 text-xl font-semibold opacity-70">No products match your criteria.</div>
                    )}
                </div>
            )}

            <div className='u20Js relative mt-52'>
                <JournalSection />
            </div>

            <div className='u20Featyres relative'>
                <div className='u20FeaturesHold flex flex-row relative'>
                    <FaShippingFast className='w-16 h-20' />
                    <FaLock className='w-12 h-16' />
                    <BsCurrencyDollar className='w-16 h-20' />
                    <img src={better} className="w-20" alt="better option" />
                </div>

                <div className='u20TextFeatureHold fof flex flex-row relative uppercase'>
                    <p> 2 DAY DELIVERY </p>
                    <p> secure checkout </p>
                    <p> royalty points </p>
                    <p> easy returns </p>
                </div>
            </div>

            <div className='relative u20footer'>
                <SPFooter />
            </div>
        </div>
    )
}

export default CategoryPage;
