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

const steps = 2;

export const Entry = React.memo(() => {
  const classes = entryStyles();
  const i18n = useTranslation(["entry"]);
  const { step = "0" } = useParams<{
    step: string | undefined;
  }>();
  const numStep = Number.parseInt(step) || 0;
  const history = useHistory();
  const location = useLocation();

  const [selectedServer, setSelectedServer] = useState("");
  const [stepComplete, setStepComplete] = useState(false);

  const forward = () => {
    history.push(`/entry/${numStep + 1}`);
    setStepComplete(false);
  };

  const backward = () => {
    history.push(`/entry/${numStep - 1}`);
    setStepComplete(false);
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Paper className={classes.entryBody} elevation={5}>
          <Stepper activeStep={numStep}>
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
                  path="/entry/0"
                  render={(props) => (
                    <ServerSelect
                      {...props}
                      setSelectedServer={setSelectedServer}
                      selectedServer={selectedServer}
                      setStepComplete={setStepComplete}
                    />
                  )}
                />
                <Route path="/entry/1/:type?" component={AuthPage} />
                <Route
                  path="/entry/"
                  render={(props) => (
                    <ServerSelect
                      {...props}
                      setSelectedServer={setSelectedServer}
                      selectedServer={selectedServer}
                      setStepComplete={setStepComplete}
                    />
                  )}
                />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
          <div className={classes.entryFooter}>
            <Button
              disabled={numStep < 1}
              variant="contained"
              color="primary"
              onClick={backward}
            >
              <ChevronLeft />
              {i18n.t("entry:back")}
            </Button>
            <Button
              disabled={!stepComplete}
              variant="contained"
              color="primary"
              onClick={forward}
            >
              {numStep === steps - 1
                ? i18n.t("entry:finish")
                : i18n.t("entry:next")}
              <ChevronRight />
            </Button>
          </div>
        </Paper>
      </Container>
    </div>
  );
});
