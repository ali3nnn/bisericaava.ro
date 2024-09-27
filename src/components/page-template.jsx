import React from "react";
import { PageHeader } from "./page-header";
import { ArticlePage } from "./article";
import "../App.css";

export const PageTemplate = (props) => {
    return (
        <div>
            <PageHeader data={props.data} />
            <ArticlePage />
        </div>
    );
};
