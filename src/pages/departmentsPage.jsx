import React from "react";
import "../App.css";

function convertStringToHTML(htmlString) {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
}
export const DepartmentsPage = ({ data }) => {
    return (
        <div className="container">
            <div className="departments-container">
                <div className="department-item first-item">
                    <div className="department-content">
                        <h3 className="department-name">Folosește-ți Darurile pentru Gloria lui Dumnezeu</h3>
                        <p className="department-description">Apostolul Pavel ne vorbește despre biserică în termenii unui organism viu. Fiecare membru este un mădular a cărui implicare asigură sănătatea și dezvoltarea întregului trup (Efeseni 4).</p>
                    </div>
                    {/* <div className="department-image-container">
                        <img src="https://bisericaava.ro/wp-content/uploads/2024/05/trenduri-in-HR4.png" className="department-image" />
                    </div> */}
                </div>

                {Object.keys(data).map((key) => {
                    const { image, name, content } = data[key];
                    return (
                        <div key={key} className="department-item" id={name.toLowerCase()}>
                            <div className="department-image-container">
                                <img src={image} alt={name} className="department-image" />
                            </div>
                            <div className="department-content">
                                <h3 className="department-name">{name}</h3>
                                <p className="department-description">{convertStringToHTML(content)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
