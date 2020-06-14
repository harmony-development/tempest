import React from "react";
import { TextField } from "@material-ui/core";

export const Login = React.memo(() => {
  return (
    <div>
      <TextField variant="outlined" label="Email" fullWidth type="email" />
      <TextField
        variant="outlined"
        label="Password"
        fullWidth
        type="password"
      />
    </div>
  );
});
