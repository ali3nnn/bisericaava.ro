import React from "react";
import "../App.css";

export const PageTemplate = ({ components }) => {
    return (
        <div>
            {components?.map(({ component: Component, props }, index) => (
                <div key={index} className="dynamic-component">
                    {console.log(props)}
                    <Component data={props} />
                </div>
            ))}
        </div>
    );
};
