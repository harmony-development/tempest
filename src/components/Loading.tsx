import React from "react";
import { LinearProgress } from "@material-ui/core";

const _Loading = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LinearProgress />
    </div>
  );
};

export const Loading = React.memo(_Loading);
