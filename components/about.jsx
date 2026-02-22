import React from "react";
import Link from "next/link";

export const About = ({ data }) => {
  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            {" "}
            <img src="/img/despre.webp" className="img-responsive" alt="Despre Biserica AVA" width="1920" height="1280" loading="lazy" />{" "}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2>Despre noi</h2>
              <p>{data ? data.paragraph : ""}</p>
              <Link href="/despre-noi"><button className="custom-btn"><span>Află mai multe</span></button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
