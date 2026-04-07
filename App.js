import './App.css';
import { useState, lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import NavBar from './components/NavBar';
import MobileNav from './components/MobileNav';
import SPFooter from './components/SPFooter';

const Body = lazy(() => import('./components/Body'));
const SimpleSlider = lazy(() => import('./components/HeroCarousel'));
const HeroSection = lazy(() => import('./components/HeroSection'));
const OurBestSellers = lazy(() => import('./components/OurBestSellers'));
const Ingridients = lazy(() => import('./components/Ingridients'));
const JournalSection = lazy(() => import('./components/JournalSection'));
const BsText = lazy(() => import('./components/BsText'));
const SinglePage = lazy(() => import("./components/SinglePage"));
const JournalPage = lazy(() => import("./components/JournalPage"));
const Cart = lazy(() => import('./components/Cart'));
const FollowONIG = lazy(() => import('./components/FollowONIG'));
const Products = lazy(() => import('./components/Products'));
const CartHold = lazy(() => import('./components/CartHold'));
const Under20 = lazy(() => import('./components/Under20'));
const Under10 = lazy(() => import('./components/Under10'));
const ForHer = lazy(() => import('./components/ForHer'));
const ForHim = lazy(() => import('./components/ForHim'));
const CategoryPage = lazy(() => import('./components/CategoryPage'));
const SearchPage = lazy(() => import('./components/SearchPage'));
const LoginPortal = lazy(() => import('./components/LoginPortal'));
const SignupPortal = lazy(() => import('./components/SignupPortal'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));
const OrderTracking = lazy(() => import('./components/OrderTracking'));

function App() {

  return (
    <div className="App">
      <BrowserRouter>

        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', margin: '4rem 0' }}><Spinner size="xl" /></div>}>
          <Routes >
            <Route path='/' exact element={<>   <NavBar /> <MobileNav />  <SimpleSlider />  <HeroSection />  <BsText />  {<Products />}  {/*<OurBestSellers />*/}  <Ingridients />  <JournalSection /> <FollowONIG /> <SPFooter />  </>} />
            <Route path='/:id' exact element={<> <NavBar /> <MobileNav />  <SinglePage /> </>} />
            <Route path='/journal/april' element={<> <NavBar /> <MobileNav />  <JournalPage /> </>} />
            <Route path='/cart' exact element={<>  <NavBar /> <CartHold /></>} />
            <Route path='/under20' element={<> <NavBar />  <Under20 /> </>} />
            <Route path='/under40' element={<> <NavBar />  <Under10 /> </>} />
            <Route path='/forher' element={<> <NavBar />  <ForHer /> </>} />
            <Route path='/forhim' element={<> <NavBar />  <ForHim /> </>} />
            <Route path='/category/:categoryName' element={<> <NavBar /> <CategoryPage /> </>} />
            <Route path='/search' element={<> <NavBar /> <SearchPage /> </>} />
            <Route path='/login' element={<> <NavBar /> <LoginPortal /> </>} />
            <Route path='/signup' element={<> <NavBar /> <SignupPortal /> </>} />
            <Route path='/admin' element={<AdminPortal />} />
            <Route path='/track-order' element={<> <NavBar /> <OrderTracking /> </>} />
          </Routes>
        </Suspense>

      </BrowserRouter>




    </div>
  );
}

export default App;
