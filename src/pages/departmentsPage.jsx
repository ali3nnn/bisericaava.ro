import React from "react";
import { convertStringToHTML } from "../utils"

export const DepartmentsPage = ({ data }) => {
    return (
        <div className="container">
            <div className="dept-list">
                <div className="dept-row dept-row--intro" data-reveal>
                    <div className="dept-row__content">
                        <h3 className="dept-row__name">Folosește-ți Darurile pentru Gloria lui Dumnezeu</h3>
                        <p className="dept-row__desc">Apostolul Pavel ne vorbește despre biserică în termenii unui organism viu. Fiecare membru este un mădular a cărui implicare asigură sănătatea și dezvoltarea întregului trup (Efeseni 4).</p>
                    </div>
                </div>

                {Object.keys(data).map((key) => {
                    const { image, name, content } = data[key];
                    return (
                        <div key={key} className="dept-row" id={name.toLowerCase()} data-reveal>
                            <div className="dept-row__media">
                                <img src={image} alt={name} loading="lazy" />
                            </div>
                            <div className="dept-row__content">
                                <h3 className="dept-row__name">{name}</h3>
                                <div className="dept-row__desc">{convertStringToHTML(content)}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
