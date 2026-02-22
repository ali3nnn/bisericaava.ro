import React from "react";
import { ImportantMessage } from "./warning";
import { Navigation } from "./navigation";

export const Sticky = () => {
  return (
    <div className="sticky-header">
      <ImportantMessage />
      <Navigation />
    </div>
  );
};
