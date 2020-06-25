import React, { useState, useEffect } from "react";
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
import { HomeServer } from "@harmony-dev/harmony-node-sdk";

import { HarmonyDark } from "../../HarmonyDark";
import { useDialog } from "../../components/dialog/CommonDialogContext";

import { ServerSelect } from "./ServerSelect";
import { AuthPage } from "./AuthPage";
import "./Entry.css";
import { ILoginForm } from "./Login";
import { IRegisterForm } from "./Register";

const entryStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `radial-gradient(circle at 50% 20%,
      ${HarmonyDark[700]},
      ${HarmonyDark[900]} 100%)`,
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
  const dialog = useDialog();
  const [selectedForm, setSelectedForm] = useState<"login" | "register">();
  const [selectedServer, setSelectedServer] = useState(
    localStorage.getItem("entry_selectedserver") || ""
  );
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

  const loginFormSubmit = async () => {
    try {
      const target = new HomeServer(selectedServer);
      const resp = await target.loginWithEmail(
        loginForm.email,
        loginForm.password
      );
      localStorage.setItem("homeserver", selectedServer);
      localStorage.setItem("session", resp.session);
      localStorage.setItem("userid", resp.user_id);
      history.push("/app");
    } catch (e) {
      dialog({
        type: "error",
        error: e,
      });
    }
  };

  const registerFormSubmit = async () => {
    try {
      const target = new HomeServer(selectedServer);
      const resp = await target.register(
        registerForm.email,
        registerForm.username,
        registerForm.password
      );
      localStorage.setItem("homeserver", selectedServer);
      localStorage.setItem("session", resp.session);
      localStorage.setItem("userid", resp.user_id);
      history.push("/app");
    } catch (e) {
      dialog({
        type: "error",
        error: e,
      });
    }
  };

  const forward = () => {
    if (currentStep !== steps.length - 1)
      history.push(`/entry/${steps[currentStep + 1]}`);
    else {
      switch (selectedForm) {
        case "login": {
          loginFormSubmit();
          break;
        }
        case "register": {
          registerFormSubmit();
          break;
        }
      }
    }
  };

  const backward = () => {
    history.push(`/entry/${steps[currentStep - 1]}`);
  };

  useEffect(() => {
    localStorage.setItem("entry_selectedserver", selectedServer);
  }, [selectedServer]);

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
              registerForm.confirmPassword === registerForm.password;
      default:
        return false;
    }
  };

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
