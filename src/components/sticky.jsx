import React from "react";
import { ImportantMessage } from "./warning";
import { Navigation } from "./navigation";

export const Sticky = ({ data }) => {
  return (
    <div className="sticky-header">
      <ImportantMessage message={data?.Warning?.message} />
      <Navigation />
    </div>
  );
};
