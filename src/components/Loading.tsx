import React from "react";
import { LinearProgress } from "@material-ui/core";

export const Loading = React.memo(() => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LinearProgress />
    </div>
  );
});
