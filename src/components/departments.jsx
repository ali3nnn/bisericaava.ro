import React from "react";
import Link from "next/link";
import { assetUrl } from "../utils";

export const Departments = (props) => {
  return (
    <section id="services" className="section section--alt">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Implică-te</span>
          <h2 className="section-title">Departamentele bisericii</h2>
          <p className="section-lead">
            Fiecare are un loc și un dar. Găsește comunitatea potrivită pentru tine.
          </p>
        </div>

        <div className="bento" data-reveal data-reveal-children>
          {props.data
            ? props.data.map((d, i) => (
                <Link
                  href="/departamente"
                  key={`${d.name}-${i}`}
                  className="bento__item"
                  aria-label={d.name}
                >
                  <img
                    className="bento__img"
                    src={assetUrl(d.image)}
                    alt={d.name}
                    loading="lazy"
                  />
                  <div className="bento__body">
                    <h3 className="bento__name">{d.name}</h3>
                    {d.text && <p className="bento__text">{d.text}</p>}
                    <span className="bento__arrow">
                      Vezi mai mult <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </span>
                  </div>
                </Link>
              ))
            : null}
        </div>
      </div>
    </section>
  );
};
