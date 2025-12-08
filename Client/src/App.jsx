import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Frames from "./Pages/Frames";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Login from "./Pages/Login";
import ResetPassword from "./Pages/ResetPassword";
import Profile from "./Pages/Profile";
import Offers from "./Components/HomePageComponents/Offers";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsAndConditions from "./Pages/TermsAndConditions";
import RefundAndCancellationPolicy from "./Pages/RefundAndCancellationPolicy";
import ShippingPolicy from "./Pages/ShippingPolicy";

// Cart Context
import { CartProvider } from "./context/CartContext";

//--------------PrivateRoute and AdminRoute-------
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

//--------------This Is Checkout Before Order Pages Not Final Order Page----------
import NewArrivalOrderPage from "./Components/OrderPages/NewArrivalOrderPage";

//--------------------Navbar Items----------------
import Navbar from "./Components/Navbar";
import Acrylic from "./Pages/ShopPages/Acrylic";
import Canvas from "./Pages/ShopPages/Canvas";
import BacklightFrames from "./Pages/ShopPages/BacklightFrames";
import UserOrderPage from "./Pages/UserOrderPage";

//------------------Acrylic Customized------------
import AcrylicPortrait from "./Pages/AcrylicCustomize/AcrylicPortrait";
import AcrylicLandscape from "./Pages/AcrylicCustomize/AcrylicLandscape";
import AcrylicSquare from "./Pages/AcrylicCustomize/AcrylicSquare";
import AcrylicLove from "./Pages/AcrylicCustomize/AcrylicLove";
import AcrylicHexagon from "./Pages/AcrylicCustomize/AcrylicHexagon";
import AcrylicRound from "./Pages/AcrylicCustomize/AcrylicRound";
import AcrylicPortraitOrderPage from "./Pages/AcrylicCustomize/AcrylicPortraitOrderPage";
import AcrylicLandscapeOrderpage from "./Pages/AcrylicCustomize/AcrylicLandscapeOrderpage";
import AcrylicSquareOrderpage from "./Pages/AcrylicCustomize/AcrylicSquareOrderpage";
import AcrylicLoveOrderPage from "./Pages/AcrylicCustomize/AcrylicLoveOrderpage";
import AcrylicHexagonOrderPage from "./Pages/AcrylicCustomize/AcrylicHexagonOrderpage";
import AcrylicRoundOrderPage from "./Pages/AcrylicCustomize/AcrylicRoundOrderpage";

//-----------------Canvas Customized---------------
import CanvasSquare from "./Pages/CanvasCustomize/CanvasSquare";
import CanvasPortraitOrderpage from "./Pages/CanvasCustomize/CanvasPortraitOrderpage";
import CanvasLandScapeOrderpage from "./Pages/CanvasCustomize/CanvasLandScapeOrderpage";
import CanvasSquareOrderpage from "./Pages/CanvasCustomize/CanvasSquareOrderpage";
import CanvasLandScape from "./Pages/CanvasCustomize/CanvasLanScape";
import CanvasPortrait from "./Pages/CanvasCustomize/CanvasPortrait";

//-----------------Backlight Customized-------------
import BacklightlanScape from "./Pages/BackLightFrame/BacklightLanScape";
import BacklightlanScapeOrderpage from "./Pages/BackLightFrame/BacklightLanScapeOrderpage";
import BacklightPortrait from "./Pages/BackLightFrame/BacklightPortrait";
import BacklightPortraitOrderpage from "./Pages/BackLightFrame/BacklightPortraitOrderpage";
import BacklightSquare from "./Pages/BackLightFrame/BacklightSquare";
import BacklightSquareOrderpage from "./Pages/BackLightFrame/BacklightSquareOrderpage";

//-----------------AdminPanel Items----------------
import AdminLayout from "./Components/AdminLayout";
import AdminPanel from "./AdminPanel/adminpanel";
import AdminOrderPage from "../src/Components/AdminComponents/AdminOrderPage";
import AdminProducts from "./Components/AdminComponents/AdminProducts";
import FrameCustomizeAdmin from "./AdminPanel/Frames/FrameCustomizeAdmin";

//------------AdminPanel Products Imported-----------
//------------------NewArrivals---------------
import NewArrivalAddForm from "./Components/AdminComponents/AdminProductsEdit/NewArrivals/NewArrivalAddForm";
import NewarrivalUpdateForm from "./Components/AdminComponents/AdminProductsEdit/NewArrivals/NewarrivalUpdateForm";

//-------------------CheckOuts--------------------------
//----------------NewArrivals CheckOut---------------
import FramesCheckout from "./Components/CheckOuts/Framescheckout";
import CommonCheckout from "./Components/CheckOuts/CommonCheckout";
import PaymentSuccess from "./Pages/PaymentSuccess";

//--------------------AdminPanelOrdersPage-------------------------

//-------------------Frames Order-------------------
import FramesOrder from "./Components/AdminComponents/FrameOrders";
import CommonOrder from "./Components/AdminComponents/CommonOrder";

//Footer
import Footer from "./Components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/frames" element={<Frames />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route
            path="/refund-policy"
            element={<RefundAndCancellationPolicy />}
          />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />

          {/* Cart Route Protection */}
          <Route path="/cart" element={<Cart />} />
          {/* Profile Route Protection */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          {/* HomePage Offers */}
          <Route path="/Offers" element={<Offers />} />
          {/* ----------------------------------------------------This is Checkout Before OrderaPage Not a Final OrderPage---------------------------------------------------------------- */}
          {/*OrderPage*/}
          {/*NewArrivals OrderPage*/}
          <Route
            path="/newarrivalorderpage/:id"
            element={<NewArrivalOrderPage />}
          />
          {/* Acrylic OrderPages */}
          <Route
            path="/AcrylicPortraitOrder"
            element={<AcrylicPortraitOrderPage />}
          />
          <Route
            path="/AcrylicLandscapeOrder"
            element={<AcrylicLandscapeOrderpage />}
          />
          <Route
            path="/AcrylicSquareOrder"
            element={<AcrylicSquareOrderpage />}
          />
          <Route path="/AcrylicLoveOrder" element={<AcrylicLoveOrderPage />} />
          <Route
            path="/AcrylicHexagonOrder"
            element={<AcrylicHexagonOrderPage />}
          />
          <Route
            path="/AcrylicRoundOrder"
            element={<AcrylicRoundOrderPage />}
          />
          {/* Canvas OrderPages */}
          <Route
            path="/CanvasPortraitOrder"
            element={<CanvasPortraitOrderpage />}
          />
          <Route
            path="/CanvasLandScapeOrder"
            element={<CanvasLandScapeOrderpage />}
          />
          <Route
            path="/CanvasSquareOrderpage"
            element={<CanvasSquareOrderpage />}
          />
          {/* Backlight OrderPages */}
          <Route
            path="/BacklightPortraitOrderpage"
            element={<BacklightPortraitOrderpage />}
          />
          <Route
            path="/BacklightlanScapeOrderpage"
            element={<BacklightlanScapeOrderpage />}
          />
          <Route
            path="/BacklightSquareOrderpage"
            element={<BacklightSquareOrderpage />}
          />
          {/* -----------------------------------------------------Checkouts--------------------------------------------------------------- */}
          {/* CheckOuts */}
          {/* Common Checkouts */}
          <Route path="/checkout/:id" element={<CommonCheckout />} />
          {/* FramesCheckouts */}
          <Route path="/frameCheckout" element={<FramesCheckout />} />

          {/* Payment Success */}
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* --------------------------------------------------Customization------------------------------------------------------------------ */}
          {/* Customization */}
          {/* {AcrylicCustomize} */}
          <Route path="/AcrylicPortrait" element={<AcrylicPortrait />} />
          <Route path="/AcrylicLandscape" element={<AcrylicLandscape />} />
          <Route path="/AcrylicSquare" element={<AcrylicSquare />} />
          <Route path="/AcrylicLove" element={<AcrylicLove />} />
          <Route path="/AcrylicHexagon" element={<AcrylicHexagon />} />
          <Route path="/AcrylicRound" element={<AcrylicRound />} />
          {/* Canvas Customize */}
          <Route path="/CanvasPortrait" element={<CanvasPortrait />} />
          <Route path="/CanvasLandScape" element={<CanvasLandScape />} />
          <Route path="/CanvasSquare" element={<CanvasSquare />} />
          {/* Backlight Customize */}
          <Route path="/BacklightPortrait" element={<BacklightPortrait />} />
          <Route path="/BacklightlanScape" element={<BacklightlanScape />} />
          <Route path="/BacklightSquare" element={<BacklightSquare />} />
          {/* ---------------------------------------------------NavbarShop-Page---------------------------------------------------------------- */}
          {/* Navbar {ShopPage routes} */}
          <Route path="/shop/acrylic" element={<Acrylic />} />
          <Route path="/shop/canvas" element={<Canvas />} />
          <Route path="/shop/backlight-frames" element={<BacklightFrames />} />
          {/* ------------------------------------------------AdminPage---------------------------------------------------------------------*/}
          {/* AdminPage*/}
          {/*AdminPanel Dashboard Route*/}
          {/* AdminPanel Page Protection - ALL ADMIN ROUTES MUST BE PROTECTED */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="adminpanel" element={<AdminPanel />} />
            <Route path="orders" element={<AdminOrderPage />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="frames" element={<FrameCustomizeAdmin />} />
            {/*AdminPanel Products Edited,Imported Route*/}
            {/*NewArrivals Products AddForm, UpdateForm*/}
            <Route path="newarrivaladdform" element={<NewArrivalAddForm />} />
            <Route
              path="newarrivalupdateform/:id"
              element={<NewarrivalUpdateForm />}
            />
            {/* Admin Orders */}
            <Route path="frameorder" element={<FramesOrder />} />
            <Route path="commonorder" element={<CommonOrder />} />
          </Route>
          {/* --------------------------------UserOrderPage--------------------------------*/}
          <Route
            path="/my-orders"
            element={
              <PrivateRoute>
                <UserOrderPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <div>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;
