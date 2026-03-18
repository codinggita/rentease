import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import Explore from '../pages/Explore/Explore';
import ItemDetails from '../pages/ItemDetails/ItemDetails';
import Dashboard from '../pages/Dashboard/Dashboard';
import Wishlist from '../pages/Dashboard/Wishlist';
import Bookings from '../pages/Dashboard/Bookings';
import Profile from '../pages/Dashboard/Profile';
import MyListings from '../pages/Dashboard/MyListings';
import AddListing from '../pages/AddListing/AddListing';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import Notifications from '../pages/Notifications/Notifications';
import ProfilePage from '../pages/Profile/Profile';
import Cart from '../pages/Cart/Cart';
import BecomeSeller from '../pages/BecomeSeller/BecomeSeller';
import NotFound from '../pages/NotFound/NotFound';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="browse" element={<Explore />} />
                <Route path="product/:id" element={<ItemDetails />} />
                
                {/* Dashboard Routes */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="dashboard/wishlist" element={<Wishlist />} />
                <Route path="dashboard/bookings" element={<Bookings />} />
                <Route path="dashboard/profile" element={<Profile />} />
                <Route path="dashboard/listings" element={<MyListings />} />
                
                <Route path="add-listing" element={<AddListing />} />
                <Route path="cart" element={<Cart />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="become-seller" element={<BecomeSeller />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
