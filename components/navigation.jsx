"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Navigation = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav id="menu" className="navbar navbar-default">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className={`navbar-toggle ${menuOpen ? '' : 'collapsed'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <Link className="navbar-brand page-scroll" href="/">
            <span>BISERICA</span>AVA
          </Link>{" "}
        </div>

        <div
          className={`navbar-collapse ${menuOpen ? 'in' : 'collapse'}`}
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link href="/despre-noi" className={`page-scroll ${pathname === '/despre-noi' ? 'page-active' : ''}`}>
                Despre noi
              </Link>
            </li>
            <li>
              <Link href="/departamente" className={`page-scroll ${pathname === '/departamente' ? 'page-active' : ''}`}>
                Departamente
              </Link>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
                Contact
              </a>
            </li>
            <li>
              <a href="https://donate.stripe.com/14k02gbBvdlN8rC3cc" target="_blank" rel="noopener noreferrer" className="donate-button">
                Donează online
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
