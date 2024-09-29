import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Departments } from "./components/departments";
import { Gallery } from "./components/gallery";
import { Contact } from "./components/contact";
import { ImportantMessage } from "./components/warning";
import Maps from "./components/maps";

import { PageTemplate } from "./pages/page-template";
import { ScrollToTop } from "./pages/scroll-to-top";
import { ArticlePage } from "./pages/article";
import { PageHeader } from "./pages/page-header";
import { DepartmentsPage } from "./pages/departmentsPage";
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
      <ImportantMessage />
      <ScrollToTop />
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

        {/* Despre noi */}
        <Route
          path="/despre-noi"
          element={<PageTemplate 
            components={[
              {component: PageHeader, props: { "title": "Despre noi" }},
              {component: ArticlePage, props: {...landingPageData?.About?.aboutPage}}
            ]}
           />}
        />

        {/* Departamente */}
        <Route
          path="/departamente"
          element={<PageTemplate components={[
            {component: PageHeader, props: { "title": "Departamente" }},
            {component: DepartmentsPage, props: {...landingPageData?.Departments}}
          ]} />}
        />
      </Routes>
      <Contact data={landingPageData.Contact} />
    </Router>
  );
};

export default App;
