import React from "react";

export const About = (props) => {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="about__grid" data-reveal>
          <div className="about__media">
            <img src="img/despre.webp" alt="Comunitatea Bisericii AVA" loading="lazy" />
          </div>
          <div className="about__body">
            <span className="eyebrow">Cine suntem</span>
            <h2 className="about__title">Despre noi</h2>
            <p className="about__text">
              {props.data ? props.data.paragraph : "loading..."}
            </p>
            <a href="/#/despre-noi" className="btn btn--ghost">
              Află mai multe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
