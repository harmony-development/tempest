import React from "react";
import { TextField } from "@material-ui/core";

export const Register = React.memo(() => {
  return (
    <div>
      <TextField variant="outlined" label="Email" fullWidth />
      <TextField variant="outlined" label="Username" fullWidth />
      <TextField variant="outlined" label="Password" fullWidth />
      <TextField variant="outlined" label="Confirm Password" fullWidth />
    </div>
  );
});
