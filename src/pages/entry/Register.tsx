import React from "react";
import { TextField } from "@material-ui/core";

import { IRegisterForm } from "./Entry";

const _Register = (props: {
  registerForm: IRegisterForm;
  setRegisterForm: (form: IRegisterForm) => void;
}) => {
  const textFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setRegisterForm({
      ...props.registerForm,
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
      />
      <TextField
        variant="outlined"
        label="Username"
        fullWidth
        type="username"
        name="username"
        onChange={textFieldChange}
      />
      <TextField
        variant="outlined"
        label="Password"
        fullWidth
        type="password"
        name="password"
        onChange={textFieldChange}
      />
      <TextField
        variant="outlined"
        label="Confirm Password"
        fullWidth
        type="password"
        name="confirmPassword"
        onChange={textFieldChange}
      />
    </div>
  );
};

export const Register = React.memo(_Register);
