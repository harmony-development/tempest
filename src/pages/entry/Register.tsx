import React from "react";
import { TextField } from "@material-ui/core";

export const Register = React.memo(() => {
  return (
    <div>
      <TextField variant="outlined" label="Email" fullWidth type="email" />
      <TextField
        variant="outlined"
        label="Username"
        fullWidth
        type="username"
      />
      <TextField
        variant="outlined"
        label="Password"
        fullWidth
        type="password"
      />
      <TextField
        variant="outlined"
        label="Confirm Password"
        fullWidth
        type="password"
      />
    </div>
  );
});
