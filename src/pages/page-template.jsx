import React from "react";
import "../App.css";

export const PageTemplate = ({ components }) => {
    return (
        <div className="page-template">
            {components?.map(({ component: Component, props }, index) => (
                <Component key={index} data={props} />
            ))}
        </div>
    );
};
