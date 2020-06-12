import React, { useState } from "react";
import { Grid, TextField, makeStyles, Link } from "@material-ui/core";

import { RaisedPaper } from "../../components/RaisedPaper";

const authPageStyles = makeStyles((theme) => ({
  formBody: {
    padding: theme.spacing(2),
    "& *": {
      marginBottom: theme.spacing(1),
    },
  },
  createAccountLink: {
    cursor: "pointer",
    textAlign: "left",
    display: "block",
    width: "auto",
  },
}));

export const AuthPage = React.memo(() => {
  const classes = authPageStyles();
  const [mode, setMode] = useState<"login" | "register">("login");

  const onModeLinkClick = () =>
    setMode((old) => (old === "login" ? "register" : "login"));

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <RaisedPaper className={classes.formBody}>
          <TextField variant="outlined" label="Email" fullWidth />
          {mode === "register" ? (
            <TextField variant="outlined" label="Username" fullWidth />
          ) : undefined}
          <TextField variant="outlined" label="Password" fullWidth />
          {mode === "register" ? (
            <TextField variant="outlined" label="Confirm Password" fullWidth />
          ) : undefined}
          <Link className={classes.createAccountLink} onClick={onModeLinkClick}>
            {mode === "login" ? "New User?" : "Sign In Instead?"}
          </Link>
        </RaisedPaper>
      </Grid>
    </Grid>
  );
});
