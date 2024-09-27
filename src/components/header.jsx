import React from "react";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <a
                  href="#about"
                  // className="btn btn-custom btn-lg page-scroll"
                  className="arrow"
                >
                  <svg
                    version="1.1"
                    id="Down-Arrow-Heart"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 960 540"
                    style={{ enableBackground: "new 0 0 960 540" }}
                  >
                    <g>
                      <path
                        id="Left1st"
                        className="path"
                        style={{
                          fill: "none",
                          stroke: "",
                          strokeWidth: 18,
                          strokeMiterlimit: 10
                        }}
                        d="M491.333,364L270,201c0,0,129.1-141.376,314.56,0 C700,289,790,236,790,236"
                      />
                    </g>
                    <g>
                      <path
                        id="Right2nd"
                        className="path"
                        style={{
                          fill: "none",
                          stroke: "",
                          strokeWidth: 1,
                          strokeMiterlimit: 10
                        }}
                        d="M481,364.25L667,227c0,0-48.75-124.5-194-54"
                      />
                    </g>
                  </svg>

                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
