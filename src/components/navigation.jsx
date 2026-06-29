"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (path) => pathname === path;

  return (
    <nav id="menu" className="site-nav">
      <div className="container site-nav__inner">
        <Link className="brand" href="/" aria-label="Biserica AVA — acasă">
          <strong>biserica</strong>ava
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Meniu"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div
          id="primary-navigation"
          className={`nav-links${open ? " is-open" : ""}`}
        >
          <Link
            href="/despre-noi"
            className={isActive("/despre-noi") ? "page-active" : ""}
          >
            Despre noi
          </Link>
          <Link
            href="/departamente"
            className={isActive("/departamente") ? "page-active" : ""}
          >
            Departamente
          </Link>
          <a href="/#contact">Contact</a>
          <a
            href="https://donate.stripe.com/14k02gbBvdlN8rC3cc"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--cta"
          >
            Donează online
          </a>
        </div>
      </div>
    </nav>
  );
};
