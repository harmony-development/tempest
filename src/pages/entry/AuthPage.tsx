import React, { useState } from "react";
import { Grid, makeStyles, Link } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import { RaisedPaper } from "../../components/RaisedPaper";

import { Login } from "./Login";
import { Register } from "./Register";

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
  const i18n = useTranslation(["entry"]);
  const [mode, setMode] = useState<"login" | "register">("login");

  const onModeLinkClick = () =>
    setMode((old) => (old === "login" ? "register" : "login"));

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <RaisedPaper className={classes.formBody}>
          {mode === "login" ? <Login /> : undefined}
          {mode === "register" ? <Register /> : undefined}
          <Link className={classes.createAccountLink} onClick={onModeLinkClick}>
            {mode === "login"
              ? i18n.t("entry:login-register.new-user")
              : i18n.t("entry:login-register.sign-in-instead")}
          </Link>
        </RaisedPaper>
      </Grid>
    </Grid>
  );
});
