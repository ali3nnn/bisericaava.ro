import React from "react";

export const PageHeader = (props) => {
  return (
    <header id="page-header" className="page-hero">
      <div className="container">
        <span className="eyebrow">Biserica AVA</span>
        <h1>{props.data ? props.data.title : "Loading"}</h1>
      </div>
    </header>
  );
};
