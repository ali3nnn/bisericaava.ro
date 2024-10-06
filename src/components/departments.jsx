import React from "react";
import { Link } from 'react-router-dom';

export const Departments = (props) => {
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Departamentele bisericii</h2>
          <p>
            Implică-te într-unul din departamentele bisericii!
          </p>
        </div>
        <div className="card-grid">
          {props.data
            ? props.data.map((d, i) => {
                const cardClass = d.text ? "service-card" : "service-card no-text";
                return (
                  <Link to="/departamente" key={`${d.name}-${i}`}>
                    <div className={cardClass} style={{ backgroundImage: `url(${d.image})` }}>
                      <div className="overlay">
                        <div className="service-desc">
                          <h3>{d.name}</h3>
                          {d.text && <p>{d.text}</p>}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            : "loading"}
        </div>
      </div>
    </div>
  );
};

