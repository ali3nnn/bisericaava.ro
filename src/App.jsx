import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import { Sticky } from "./components/sticky";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Departments } from "./components/departments";
import { Gallery } from "./components/gallery";
import { Contact } from "./components/contact";
import Maps from "./components/maps";

import { PageTemplate } from "./pages/page-template";
import { ScrollToTop } from "./pages/scroll-to-top";
import { ScrollReveal } from "./components/scroll-reveal";
import { ArticlePage } from "./pages/article";
import { PageHeader } from "./pages/page-header";
import { DepartmentsPage } from "./pages/departmentsPage";
import { AdminPage } from "./pages/admin";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const Layout = ({ data }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Sticky data={data} />}
      <Routes>
        {/* Home page: Show all components */}
        <Route
          path="/"
          element={
            <>
              <Header data={data.Header} />
              <About data={data.About} />
              <Departments data={data.Departments} />
              <Gallery data={data.Gallery} />
              <Maps data={data.Maps} />
            </>
          }
        />

        {/* Despre noi */}
        <Route
          path="/despre-noi"
          element={
            <PageTemplate
              components={[
                { component: PageHeader, props: { title: "Despre noi" } },
                { component: ArticlePage, props: { ...data?.About?.aboutPage } },
              ]}
            />
          }
        />

        {/* Departamente */}
        <Route
          path="/departamente"
          element={
            <PageTemplate
              components={[
                { component: PageHeader, props: { title: "Departamente" } },
                { component: DepartmentsPage, props: { ...data?.Departments } },
              ]}
            />
          }
        />

        {/* CMS */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      {!isAdmin && <Contact data={data.Contact} />}
    </>
  );
};

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((d) => {
        if (cancelled) return;
        setLandingPageData(d && Object.keys(d).length ? d : JsonData);
      })
      .catch(() => {
        // Fallback to the bundled JSON (e.g. local dev without the API)
        if (!cancelled) setLandingPageData(JsonData);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ScrollReveal />
      <Layout data={landingPageData} />
    </Router>
  );
};

export default App;
