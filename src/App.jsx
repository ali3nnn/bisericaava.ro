import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Departments } from "./components/departments";
import { Gallery } from "./components/gallery";
import { Contact } from "./components/contact";
import { PageTemplate } from "./components/page-template";
import Maps from "./components/maps";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <Router>
      <Navigation />
      <Routes>
        {/* Home page: Show all components */}
        <Route
          path="/"
          element={
            <>
              <Header data={landingPageData.Header} />
              <About data={landingPageData.About} />
              <Departments data={landingPageData.Departments} />
              <Gallery data={landingPageData.Gallery} />
              <Maps data={landingPageData.Maps} />
            </>
          }
        />

        {/* Individual routes for each component */}
        <Route
          path="/despre-noi"
          element={<PageTemplate data={{
              "title": "Despre noi",
          }} />}
        />
      </Routes>
      <Contact data={landingPageData.Contact} />
    </Router>
  );
};

export default App;
