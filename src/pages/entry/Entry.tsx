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

import { HarmonyDark } from "../../HarmonyDark";

import { ServerSelect } from "./ServerSelect";
import { AuthPage } from "./AuthPage";

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
  const [selectedServer, setSelectedServer] = useState("");
  const [stepComplete, setStepComplete] = useState(false);
  const [step, setStep] = useState(1);

  const getStepContent = () => {
    switch (step) {
      case 0: {
        return (
          <ServerSelect
            setSelectedServer={setSelectedServer}
            selectedServer={selectedServer}
            setStepComplete={setStepComplete}
          />
        );
      }
      case 1: {
        return <AuthPage />;
      }
    }
  };

  const forward = () => {
    setStep((old) => old + 1);
    setStepComplete(false);
  };

  const backward = () => {
    setStep((old) => old - 1);
    setStepComplete(false);
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Paper className={classes.entryBody} elevation={5}>
          <Stepper activeStep={step}>
            <Step>
              <StepLabel>{i18n.t("entry:select-server")}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{i18n.t("entry:login-register-text")}</StepLabel>
            </Step>
          </Stepper>
          {getStepContent()}
          <div className={classes.entryFooter}>
            <Button
              disabled={step < 1}
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
              {step === steps - 1
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
