import React, { useEffect } from "react";
import { Grid, makeStyles, Link, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router";

import { RaisedPaper } from "../../components/RaisedPaper";

import { Login, ILoginForm } from "./Login";
import { Register, IRegisterForm } from "./Register";

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

const _AuthPage = (props: {
  setSelectedForm: (form: "login" | "register") => void;
  setLoginForm: (form: ILoginForm) => void;
  setRegisterForm: (form: IRegisterForm) => void;
  loginForm: ILoginForm;
  registerForm: IRegisterForm;
}) => {
  const classes = authPageStyles();
  const i18n = useTranslation(["entry"]);
  const { type = "login" } = useParams<{
    type: string | undefined;
  }>();
  const history = useHistory();

  useEffect(
    () => props.setSelectedForm(type as "login" | "register"),
    // eslint-disable-next-line
    []
  );

  const onModeLinkClick = () => {
    history.push(`/entry/auth/${type === "register" ? "login" : "register"}`);
    props.setSelectedForm(type === "register" ? "login" : "register");
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <RaisedPaper className={classes.formBody}>
          <Typography variant="h5">
            {i18n.t(
              type === "login"
                ? "entry:login-to-instance"
                : "entry:register-to-instance",
              { host: localStorage.getItem("entry_selectedserver") }
            )}
          </Typography>
          {type === "login" ? <Login {...props} /> : undefined}
          {type === "register" ? <Register {...props} /> : undefined}
          <Link className={classes.createAccountLink} onClick={onModeLinkClick}>
            {type === "login"
              ? i18n.t("entry:login-register.new-user")
              : i18n.t("entry:login-register.sign-in-instead")}
          </Link>
        </RaisedPaper>
      </Grid>
    </Grid>
  );
};

export const AuthPage = React.memo(_AuthPage);
