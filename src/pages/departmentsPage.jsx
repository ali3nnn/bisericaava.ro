import React from "react";
import "../App.css";

export const DepartmentsPage = ({ data }) => {
    return (
        <div className="departments-container">
            {Object.keys(data).map((key) => {
                const { image, name, content } = data[key];
                return (
                    <div key={key} className="department-item" id={name.toLowerCase()}>
                        <div className="department-image-container">
                            <img src={image} alt={name} className="department-image" />
                        </div>
                        <div className="department-content">
                            <h3 className="department-name">{name}</h3>
                            <p className="department-description">{content}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
