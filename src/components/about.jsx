import React from "react";

export const About = (props) => {
  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            {" "}
            <img src="img/despre.webp" className="img-responsive" alt="" />{" "}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2>Despre noi</h2>
              <p>{props.data ? props.data.paragraph : "loading..."}</p>
              <a href="/#/despre-noi"><button className="custom-btn"><span>Află mai multe</span></button></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
