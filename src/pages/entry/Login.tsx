import React from "react";
import { TextField } from "@material-ui/core";

import { ILoginForm } from "./Entry";

const _Login = (props: {
  loginForm: ILoginForm;
  setLoginForm: (form: ILoginForm) => void;
}) => {
  const textFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setLoginForm({
      ...props.loginForm,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  return (
    <div>
      <TextField
        variant="outlined"
        label="Email"
        fullWidth
        type="email"
        name="email"
        onChange={textFieldChange}
        value={props.loginForm.email}
      />
      <TextField
        variant="outlined"
        label="Password"
        fullWidth
        type="password"
        name="password"
        onChange={textFieldChange}
        value={props.loginForm.password}
      />
    </div>
  );
};

export const Login = React.memo(_Login);
