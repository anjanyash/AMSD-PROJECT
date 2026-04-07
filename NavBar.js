import React from 'react'
import "../styles/Navbar.css";
import logo from "../assets/cara.png";
import { useState } from 'react';
import BestSellers from './BestSellers';
import GiftSets from './GiftSets';
import Body from './Body';
import { FaShoppingBag, FaSearch, FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavBar = () => {
    const navigate = useNavigate();
    const [searchVal, setSearchVal] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchVal.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
        }
    };

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);


    const showHandler = () => {
        setShow(true)
        setShow2(false)
        setShow3(false)
        setShow4(false)

    }

    const showHandler2 = () => {
        setShow2(true)
        setShow(false)
        setShow3(false)
        setShow4(false)

    }

    const showHandler3 = () => {
        setShow3(true)
        setShow(false)
        setShow2(false)
        setShow4(false)
    }

    const showHandler4 = () => {
        setShow4(true)
        setShow(false)
        setShow2(false)
        setShow3(false)

    }


    const dontShowHandler = () => {
        setShow(false)
        setShow2(false)
        setShow3(false)
        setShow4(false)


    }

    return (
        <div>


            <header class="banner" role="banner">

                <nav class="navbar" role="navigation" aria-label="menu">

                    <Link to="/">
                        <img src={logo} className=" ml-32" />
                    </Link>

                    <ul class="menuNav">
                        <li class="dropdown nav-link nav-link-fade-up transition-all duration-700" onMouseOver={showHandler} >
                            BEST SELLERS
                            {show && <div>
                                <ul class="dropdown-nav" onMouseLeave={dontShowHandler} >

                                    <BestSellers > </BestSellers>

                                </ul>

                            </div>}

                        </li >


                        <li class="dropdown nav-link nav-link-fade-up" onMouseOver={showHandler2} >
                            GIFT SETS
                            {show2 && <ul class="dropdown-nav dropdown-nav2" onMouseLeave={dontShowHandler}>
                                <GiftSets />
                            </ul>}

                        </li>


                        <li class="dropdown nav-link nav-link-fade-up" onMouseOver={showHandler3} >
                            SHOP RANGE
                            {show3 && <ul class="dropdown-nav dropdown-nav3" onMouseLeave={dontShowHandler}>
                                <Body />
                            </ul>}

                        </li>


                        <p className='navLine absolute bg-red-600 w-1 font-extralight h-9 z-50'>  </p>

                    </ul>

                    <form onSubmit={handleSearchSubmit} className="flex items-center ml-auto mr-10">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="border border-gray-300 rounded-l px-4 py-1 focus:outline-none"
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                        />
                        <button type="submit" className="bg-gray-800 text-white px-3 py-1.5 rounded-r">
                            <FaSearch />
                        </button>
                    </form>

                    <Link to="/login" className="mr-6">
                        <FaUser className='text-2xl text-right relative hover:text-gray-500 transition-colors' />
                    </Link>

                    <Link to="/track-order" className="mr-6 text-gray-800 hover:text-gray-500 transition-colors">
                        Track Order
                    </Link>

                    <Link to="/cart">
                        <FaShoppingBag className=' text-2xl text-right relative hover:text-gray-500 transition-colors' />
                    </Link>
                </nav >
            </header >



        </div >
    )
}

export default NavBar







/*    



          


















             <div class="container">
                <div class="dropdown" onMouseOver={showHandler}>
                    <button class="dropbtn">Dropdown</button>
                    <div class="dropdown-content" onMouseLeave={dontShowHandler}>
                     {show && <BestSellers /> }
                    </div>
                </div>

                <div class="dropdown" onMouseOver={showHandler2}>
                    <button class="dropbtn">Dropdown</button>
                    <div class="dropdown-content" onMouseLeave={dontShowHandler}>
                    {show2 && <GiftSets /> }
                    </div>
                </div>


                <div class="dropdown">
                    <button class="dropbtn">Dropdown</button>
                    <div class="dropdown-content">
                        Link 1
                        Link 2
                        Link 3
                    </div>
                </div>


                <a href="#news">Link</a>
            </div>

            <h3>Dropdown Menu inside a Navigation Bar</h3>
            <p>Hover over the "Dropdown" link to see the dropdown menu.</p>













*/

