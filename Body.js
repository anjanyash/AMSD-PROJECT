

import React from 'react'
import "../styles/Body.css";
import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import HoverImage from "react-hover-image/build"
import { Link } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';

const Body = () => {

    const [show, setShow] = useState(true);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);

    const { products: store, loading } = useProducts("bodyMenu");


    const showHandler = () => {
        setShow(true)
        document.querySelector(".bodyContent").classList.add("transition");
        setShow2(false)
        setShow3(false)
        setShow4(false)

        document.querySelector(".bodyContent").style.opacity = "1";
        document.querySelector(".hairContent").style.opacity = "0";
        document.querySelector(".newContent").style.opacity = "0";
        document.querySelector(".travelContent").style.opacity = "0";

    }

    const showHandler2 = () => {
        setShow2(true)
        document.querySelector(".hairContent").classList.add("transition2");
        setShow(false)
        setShow3(false)
        setShow4(false)


        document.querySelector(".hairContent").style.opacity = "1";
        document.querySelector(".bodyContent").style.opacity = "0";
        document.querySelector(".newContent").style.opacity = "0";
        document.querySelector(".travelContent").style.opacity = "0";

    }

    const showHandler3 = () => {
        setShow3(true)
        document.querySelector(".travelContent").classList.add("transition3");
        //document.querySelector(".hairContent").style.opacity = "0";
        //document.querySelector(".newContent").style.opacity="0"
        setShow(false)
        setShow2(false)
        setShow4(false)

        document.querySelector(".travelContent").style.opacity = "1";
        document.querySelector(".hairContent").style.opacity = "0";
        document.querySelector(".bodyContent").style.opacity = "0";
        document.querySelector(".newContent").style.opacity = "0";
    }

    const showHandler4 = () => {
        setShow4(true)
        document.querySelector(".newContent").classList.add("transition4");
        //document.querySelector(".travelContent").style.opacity = "0";
        setShow(false)
        setShow2(false)
        setShow3(false)

        document.querySelector(".newContent").style.opacity = "1";
        document.querySelector(".hairContent").style.opacity = "0";
        document.querySelector(".bodyContent").style.opacity = "0";
        document.querySelector(".travelContent").style.opacity = "0";
    }


    const dontShowHandler = () => {
        setShow(false)
        setShow2(false)
        setShow3(false)
        setShow4(false)

        document.querySelector(".newContent").style.opacity = "0";
        document.querySelector(".hairContent").style.opacity = "0";
        document.querySelector(".bodyContent").style.opacity = "0";
        document.querySelector(".travelContent").style.opacity = "0";

    }
    return (
        <div>
            <div className='categoryHold flex flex-col gap-14 font-normal absolute left-16 top-11'>

                <div className='bodyHold lineHeight w-56 w56rem' onMouseMove={showHandler}>
                    <p className=' font-semibold hover-underline-animation'>BODY</p>
                </div>

                <div className='hairHold lineHeight w-56' onMouseMove={showHandler2}>
                    <p className=' font-semibold hover-underline-animation'>HAIR</p>
                </div>

                <div className='travelHold w-52 lineHeight' onMouseMove={showHandler3}>
                    <p className=' font-semibold hover-underline-animation'>TRAVEL</p>
                </div>



                <div className='newHold lineHeight' onMouseMove={showHandler4}>
                    <p className=' font-semibold hover-underline-animation'>NEW</p>
                </div>



            </div>



            {show && <div className=' z-50 bodyContent color text-base' onMouseLeave={dontShowHandler}>
                <Link to="/category/body-wash"><p className="hover:underline cursor-pointer">   Body Wash </p></Link>
                <Link to="/category/body-scrub"><p className="hover:underline cursor-pointer">   Body Scrub </p></Link>
                <Link to="/category/body-lotion"><p className="hover:underline cursor-pointer">   Body Lotions </p></Link>
                <Link to="/category/body-oil"><p className="hover:underline cursor-pointer">   Body Oil </p></Link>
                <Link to="/category/hand-wash"><p className="hover:underline cursor-pointer">   Hand Wash </p></Link>
                <Link to="/category/hand-cream"><p className="hover:underline cursor-pointer">   Hand Creams </p></Link>

                <div className='bodyTypeHold flex'>
                    {store.map((item) => {
                        if (item.type == "navbar-BodyType") {
                            return (
                                <Link to={`/${item.id}`} key={item.id}>

                                    <div key={item.id} className="bodyTypeIndivitual">
                                        <HoverImage src={item.primaryImage} hoverSrc={item.hoverImg} className="rounded-xl  bodyTypeImage" />
                                        <p className=' text-center fs bodyTypeName'> {item.name} </p>
                                    </div>

                                </Link>)
                        }
                    })}
                </div>

            </div>}



            {show2 && <div className=' z-50 hairContent flex flex-col' onMouseLeave={dontShowHandler}>
                <div className='hairTypeCategoryONE flex flex-col gap-8'>
                    <p className=' font-bold text-xl'>  CATEGORY </p>
                    <Link to="/category/shampoos"><p className="hover:underline cursor-pointer">  Shampoos </p></Link>
                    <Link to="/category/conditioners"><p className="hover:underline cursor-pointer">  Conditioners </p></Link>
                    <Link to="/category/treatments"><p className="hover:underline cursor-pointer">  Treatments </p></Link>
                </div>


                <div className='hairTypeCategoryTWO flex-col flex gap-10'>
                    <p className='font-bold'>  HAIR CONCERN </p>
                    <Link to="/category/deep-cleanse"><p className="hover:underline cursor-pointer">  Deep Cleanse </p></Link>
                    <Link to="/category/oily"><p className="hover:underline cursor-pointer">  Oily </p></Link>
                    <Link to="/category/dry"><p className="hover:underline cursor-pointer">  Dry </p></Link>
                    <Link to="/category/volume"><p className="hover:underline cursor-pointer">  Volume </p></Link>
                    <Link to="/category/normal"><p className="hover:underline cursor-pointer">   Normal </p></Link>
                </div>

                <div className='hairImageHold flex flex-row gap-10'>
                    <img src='https://cdn.shopify.com/s/files/1/0081/7374/8305/articles/Natural_Balance_Shampoo_02_540x.jpg?v=1550710011' className=' rounded-xl w-52' />
                    <img src='https://cdn.shopify.com/s/files/1/0081/7374/8305/articles/ee7ea9c87918e493665a3a84bdf6c00a_large_1b25100f-7d60-451b-9d01-e74d104141d5_540x.jpg?v=1550710009' className=' rounded-xl w-52' />
                </div>

                <div className='hairTextHold flex flex-row relative font-semibold'>
                    <p className='flex flex-row flex-wrap w-56'>Make The Switch! Why Natural Haircare Is Best</p>
                    <p className='flex flex-row flex-wrap w-56'>How to lead a natural & sustainable lifestyle</p>
                </div>



            </div>}

            {show3 && <div className='z-50 travelContent' onMouseLeave={dontShowHandler}>
                <div className='flex flex-row'>
                    <div className='TravelStoreHold flex flex-row gap-16'>
                        {store.map((item) => {
                            if (item.type == "navbar-TravelType") {
                                return (
                                    <Link to={`/${item.id}`} key={item.id}>

                                        <div key={item.id} className="TravelIndivitual">
                                            <HoverImage src={item.primaryImage} hoverSrc={item.hoverImg} className=" rounded-xl w-40" />
                                            <p className=' font-semibold text-base px'> {item.name} </p>
                                            <p className='text-base font-normal text-center'> ₹{item.price} </p>
                                        </div>
                                    </Link>
                                )
                            }
                        })}
                    </div>

                </div>
            </div>}





            {show4 && <div className='newContent relative left-72 text-base text-gray-500 top-16' onMouseLeave={dontShowHandler}>
                <div className='newCategoryHold flex flex-col gap-9'>
                    <p className='font-bold text-xl'>  CATEGORY </p>

                    <Link to="/category/brightening-range"><p className="hover:underline cursor-pointer">  Brightening Range </p></Link>

                    <Link to="/category/facial-masks"><p className="hover:underline cursor-pointer">  Facial Masks </p></Link>

                    <Link to="/category/rosehip-range"><p className="hover:underline cursor-pointer">  Rosehip Range </p></Link>

                    <Link to="/category/new-arrivals"><p className="hover:underline cursor-pointer">  Shop All New Arrivals </p></Link>
                </div>

                <div className='newTypeHold relative flex felx-row gap-10'>
                    {store.map((item) => {
                        if (item.type == "navbar-NewType") {
                            return (
                                <Link to={`/${item.id}`} key={item.id}>

                                    <div className='newIndivitual'>
                                        <HoverImage src={item.primaryImage} hoverSrc={item.hoverImg} className=" rounded-xl w-40" />
                                        <p className='font-semibold text-center text-base px'> {item.name} </p>
                                        <p className='text-base font-normal text-center'> ₹{item.price} </p>
                                    </div>
                                </Link>
                            )
                        }
                    })}
                </div>

            </div>}



        </div>
    )
}

export default Body
