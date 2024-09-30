import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Navigation = (props) => {
  const location = useLocation();

  useEffect(() => {
    const links = document.querySelectorAll('.navbar-nav a'); // Select all links in the navbar

    // Remove page-active class from all links
    links.forEach((link) => {
      link.classList.remove('page-active');
    });

    // Add page-active class to the link that matches the current URL
    links.forEach((link) => {
      const linkHref = link.getAttribute('href').replace('/#', ''); // Remove '/#' for matching
      const currentPath = location.pathname; // Get current hash without the '#'

      if (linkHref === currentPath) {
        link.classList.add('page-active');
      }
    });
  }, [location]); // Re-run every time the URL changes

  return (
    <nav id="menu" className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="/">
            <span>BISERICA</span>AVA
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="/#/despre-noi" className="page-scroll">
                Despre noi
              </a>
            </li>
            <li>
              <a href="/#/departamente" className="page-scroll">
                Departamente
              </a>
            </li>
            <li>
              <a href="#portfolio" className="page-scroll">
                Galerie
              </a>
            </li>
            {/* <li>
              <a href="#maps" className="page-scroll">
                HARTA
              </a>
            </li> */}
            <li>
              <a href="#contact" className="page-scroll">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
