import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import Contact from "./Pages/Contact";
import Pricing from "./components/Pricing";
import CoinDetails from "./components/CoinDetails";
import News from "./components/News";
import WishList from "./components/Wishlist";
import Airdrop from "./components/Airdrop";
import MyAirdrops from "./components/MyAirdrops";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    return storedLoggedIn === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing currentUser from localStorage:", error);
      return null;
    }
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
  };

  useEffect(() => {
    const syncLoginState = (event) => {
      if (event.key === "isLoggedIn" || event.key === "currentUser") {
        setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
        const storedUser = localStorage.getItem("currentUser");
        setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
      }
    };

    window.addEventListener("storage", syncLoginState);
    return () => {
      window.removeEventListener("storage", syncLoginState);
    };
  }, []);

  return (
    <Router>
      <PageContainer>
        <HeaderWrapper>
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />
        </HeaderWrapper>

        <MainContent>
          <Routes>
            <Route 
              path="/login" 
              element={isLoggedIn ? <Navigate to="/airdrop" replace /> : <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />} 
            />
            <Route 
              path="/signup" 
              element={isLoggedIn ? <Navigate to="/airdrop" replace /> : <Signup />} 
            />
            <Route 
              path="/dashboard" 
              element={isLoggedIn ? <Dashboard setIsLoggedIn={setIsLoggedIn} currentUser={currentUser} handleLogout={handleLogout} /> : <Navigate to="/login" replace />} 
            />
            <Route path="/wishlist" element={isLoggedIn ? <WishList currentUser={currentUser} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/airdrop" element={isLoggedIn ? <Airdrop currentUser={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/myairdrops" element={isLoggedIn ? <MyAirdrops currentUser={currentUser} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/pricing" element={isLoggedIn ? <Pricing currentUser={currentUser} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/coin/:coinId" element={isLoggedIn ? <CoinDetails currentUser={currentUser} handleLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/news" element={<News />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/signup"} />} />
          </Routes>
        </MainContent>

        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </PageContainer>
    </Router>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 70px;
  background-image: url("../banner2.jpg");
  background-size: cover;
  background-position: center;
`;

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  height: 50px;
  color: white;
  padding: 10px 0;
`;

const FooterWrapper = styled.footer`
  color: white;
  padding: 0;
  margin: 0;
`;

const MainContent = styled.main`
  flex: 1;
  margin-bottom: 0;
  overflow-y: auto;
`;

export default App;
