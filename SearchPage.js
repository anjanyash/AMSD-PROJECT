import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import "../styles/Under20.css";
import {
    Breadcrumb,
    BreadcrumbItem,
    Spinner,
    Select
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import HoverImage from 'react-hover-image/build';
import JournalSection from "./JournalSection";
import SPFooter from './SPFooter';
import { useProducts } from '../hooks/useProducts';

// Hook to pull query parameters easily
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
    const query = useQuery();
    const searchQuery = (query.get("q") || "").toLowerCase();
    
    const { products: store, loading } = useProducts();
    const [sort, setSort] = useState(false);

    const toggleSortHandler = (e) => {
        setSort(e.target.value);
    }

    const sortProducts = (prods) => {
        let filtered = prods.filter(p => p.name && p.name.toLowerCase().includes(searchQuery));
        if (sort === 'lowToHigh') {
            return filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'highToLow') {
            return filtered.sort((a, b) => b.price - a.price);
        }
        return filtered;
    }

    const searchResults = sortProducts(store);

    const bgAddHandler = (e) => {
        e.target.classList.add("whi");
    }

    const bgRemoveHandler = (e) => {
        e.target.classList.remove("whi");
    }

    // A simple banner element (optional) since search doesn't have a specific background
    return (
        <div className='u20MainParent fof'>
            <p className=' bg-white z-50 relative w100vw'>  </p>

            <div className='mt-20'></div>

            <div className='u20HeadingHold gap-10 justify-center relative flex flex-col pt-10'>
                <p className='text-3xl font-bold uppercase'>SEARCH RESULTS</p>
                <p className='u20Desc'>Showing results for "{searchQuery}"</p>
            </div>

            <div className='filterSortHold flex flex-row gap-8 absolute text-left items-center' style={{ top: "18rem" }}>
                <Select placeholder='Sort By Price' onChange={toggleSortHandler} width="200px" bg="white">
                    <option value='lowToHigh'>Price: Low to High</option>
                    <option value='highToLow'>Price: High to Low</option>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center relative top-96 mt-10 mb-40"><Spinner size="xl" /></div>
            ) : (
                <div className="flex u20prodsHold flex-wrap relative top-96 justify-center text-center mt-10 mb-40">
                    {searchResults.length > 0 ? searchResults.map((item) => (
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
                        <div className="mt-10 text-xl font-semibold opacity-70">No products found matching "{searchQuery}".</div>
                    )}
                </div>
            )}

            <div className='relative u20footer mt-72'>
                <SPFooter />
            </div>
        </div>
    )
}

export default SearchPage;
