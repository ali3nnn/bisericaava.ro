import React from "react";

export const Header = (props) => {
  return (
    <header id="header" className="hero">
      <img
        src="img/splash.webp"
        alt="Comunitatea Bisericii AVA în închinare"
        className="hero__bg"
        fetchpriority="high"
      />
      <div className="hero__inner container">
        <div className="hero__content">
          <h1 className="hero__title">
            {props.data ? props.data.title : "Bine ați venit!"}
          </h1>
          <p className="hero__lead">
            {props.data
              ? props.data.paragraph
              : "Dumnezeu ne-a pus în inimă Duhul Fiului Său, care strigă „Ava”, adică Tată!"}
          </p>
          <div className="hero__actions">
            <a href="#about" className="btn btn--light">
              Descoperă comunitatea
            </a>
            <a href="#contact" className="btn btn--primary">
              Vino duminică
            </a>
          </div>
        </div>

        <div className="hero__meta">
          <span className="hero__chip">
            <i className="fa fa-clock-o" aria-hidden="true"></i> Duminică, ora 10:00–12:00
          </span>
          <a
            className="hero__chip"
            href="https://maps.app.goo.gl/W85vQDMNpvfqsvA99"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-map-marker" aria-hidden="true"></i> Strada Tineretului 2, Târgoviște
          </a>
        </div>
      </div>

      <a href="#about" className="hero__scroll" aria-label="Derulează în jos">
        <span className="visually-hidden">Derulează în jos</span>
      </a>
    </header>
  );
};
