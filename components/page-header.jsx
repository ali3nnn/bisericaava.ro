import React from "react";

export const PageHeader = ({ data }) => {
  return (
    <header id="page-header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 intro-text">
                <h1>
                  {data ? data.title : ""}
                  <span></span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
