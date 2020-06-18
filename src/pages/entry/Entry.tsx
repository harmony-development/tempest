import React, { useState } from "react";
import {
  makeStyles,
  Paper,
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";
import { ChevronRight, ChevronLeft } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import {
  useParams,
  Route,
  Switch,
  useHistory,
  useLocation,
  Redirect,
} from "react-router";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { HarmonyDark } from "../../HarmonyDark";

import { ServerSelect } from "./ServerSelect";
import { AuthPage } from "./AuthPage";
import "./Entry.css";

const entryStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `radial-gradient(circle at 50% 10%,
      ${HarmonyDark[700]},
      ${HarmonyDark[800]} 70.71%)`,
  },
  entryBody: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  entryFooter: {
    marginTop: theme.spacing(3),
    display: "flex",
    position: "relative",
    justifyContent: "space-between",
  },
}));

export interface IServerList {
  [key: string]: {
    ip: string;
  };
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface IEntryForm {
  selectedServer: string;
  selectedForm: "register" | "login";
  loginForm: ILoginForm;
  registerForm: IRegisterForm;
}

const steps = ["serverselect", "auth"];

const _Entry = () => {
  const classes = entryStyles();
  const i18n = useTranslation(["entry"]);
  const { step = "serverselect" } = useParams<{
    step: string | undefined;
  }>();
  const currentStep = steps.indexOf(step);
  const history = useHistory();
  const location = useLocation();
  const [selectedForm, setSelectedForm] = useState<"login" | "register">();
  const [selectedServer, setSelectedServer] = useState("");
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<IRegisterForm>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const forward = () => {
    history.push(`/entry/${steps[currentStep + 1]}`);
  };

  const backward = () => {
    history.push(`/entry/${steps[currentStep - 1]}`);
  };

  const isFormComplete = () => {
    switch (currentStep) {
      case 0:
        return !!selectedServer;
      case 1:
        return selectedForm === "login"
          ? !!loginForm.email && !!loginForm.password
          : !!registerForm.email &&
              !!registerForm.username &&
              !!registerForm.password &&
              !!registerForm.confirmPassword;
      default:
        return false;
    }
  };

  console.log(new Date().getTime());

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Paper className={classes.entryBody} elevation={5}>
          <Stepper activeStep={currentStep}>
            <Step>
              <StepLabel>{i18n.t("entry:select-server")}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{i18n.t("entry:login-register-text")}</StepLabel>
            </Step>
          </Stepper>
          <TransitionGroup>
            <CSSTransition key={location.key} classNames="step" timeout={300}>
              <Switch location={location}>
                <Route
                  path="/entry/serverselect"
                  render={() => (
                    <ServerSelect
                      selectedServer={selectedServer}
                      setSelectedServer={setSelectedServer}
                    />
                  )}
                />
                <Route
                  path="/entry/auth/:type?"
                  render={() => (
                    <AuthPage
                      setSelectedForm={setSelectedForm}
                      setLoginForm={setLoginForm}
                      setRegisterForm={setRegisterForm}
                      loginForm={loginForm}
                      registerForm={registerForm}
                    />
                  )}
                />
                <Redirect to="/entry/serverselect" />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
          <div className={classes.entryFooter}>
            <Button
              disabled={currentStep < 1}
              variant="contained"
              color="primary"
              onClick={backward}
            >
              <ChevronLeft />
              {i18n.t("entry:back")}
            </Button>
            <Button
              disabled={!isFormComplete()}
              variant="contained"
              color="primary"
              onClick={forward}
            >
              {currentStep === steps.length - 1
                ? i18n.t("entry:finish")
                : i18n.t("entry:next")}
              <ChevronRight />
            </Button>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export const Entry = React.memo(_Entry);
