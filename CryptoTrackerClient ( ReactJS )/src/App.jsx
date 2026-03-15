import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "./supabaseClient";
import { logoutUser } from "./Services/userService";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import Contact from "./Pages/Contact";
// import Pricing from "./components/Pricing";
import CoinDetails from "./components/CoinDetails";
import News from "./components/News";
import WishList from "./components/Wishlist";
import Airdrop from "./components/Airdrop";
import MyAirdrops from "./components/MyAirdrops";
import Profile from "./components/Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  if (loading) return null;

  return (
    <Router>
      <PageContainer>
        <HeaderWrapper>
          <Header user={user} handleLogout={handleLogout} />
        </HeaderWrapper>

        <MainContent>
          <Routes>

            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/profile" replace />}
            />

            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/profile" replace />}
            />

            <Route
              path="/profile"
              element={user ? <Profile user={user} /> : <Navigate to="/login" replace />}
            />

            <Route
              path="/wishlist"
              element={user ? <WishList user={user} /> : <Navigate to="/login" />}
            />

            <Route
              path="/airdrop"
              element={user ? <Airdrop user={user} /> : <Navigate to="/login" />}
            />

            <Route
              path="/myairdrops"
              element={user ? <MyAirdrops user={user} /> : <Navigate to="/login" />}
            />

            {/* <Route 
              path="/pricing" 
              element={user ? <Pricing user={user} handleLogout={handleLogout} /> : <Navigate to="/login" />} 
            /> */}

            <Route
              path="/coin/:coinId"
              element={user ? <CoinDetails user={user} /> : <Navigate to="/login" />}
            />

            <Route path="/news" element={<News />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />

            <Route
              path="*"
              element={<Navigate to={user ? "/profile" : "/signup"} />}
            />

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
