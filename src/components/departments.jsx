import React from "react";
import { Link } from 'react-router-dom';

export const Departments = (props) => {
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Departamentele bisericii</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit duis sed
            dapibus leonec.
          </p>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => {
              const cardClass = d.text ? "service-card" : "service-card no-text";

              return (
                <Link to="/departamente">
                  <div key={`${d.name}-${i}`} className="col-md-4 col-sm-6 col-xs-12">
                    <div
                      className={cardClass}
                      style={{ backgroundImage: `url(${d.image})` }} 
                    >
                      <div className="overlay">
                        <div className="service-desc">
                          <h3>{d.name}</h3>
                          {d.text && <p>{d.text}</p>} 
                        </div>
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
