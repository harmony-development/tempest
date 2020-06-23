import React, { lazy, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { createMuiTheme, ThemeProvider, CssBaseline } from "@material-ui/core";
import { Switch, Route, Redirect } from "react-router-dom";

import { RootState } from "./redux/redux";
import { Loading } from "./components/Loading";
import { HarmonyDark } from "./HarmonyDark";
import { CommonDialogContextProvider } from "./components/dialog/CommonDialogContext";
import { HarmonyStorage } from "./storage/HarmonyStorage";
import { ToastContextProvider } from "./components/toast/SnackbarContext";

const EntryPage = lazy(async () => ({
  default: await (await import("./pages/entry/Entry")).Entry,
}));

const AppPage = lazy(async () => ({
  default: await (await import("./pages/app/App")).App,
}));

const _Root = () => {
  const themeState = useSelector((state: RootState) => state.rootReducer.theme);

  const theme = createMuiTheme({
    palette: {
      type: themeState.type,
      primary: themeState.primary,
      secondary: themeState.secondary,
      background: {
        default: HarmonyDark[700],
        paper: HarmonyDark[600],
      },
    },
  });

  useEffect(() => {
    HarmonyStorage.checkExecuteMessageCode();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <CommonDialogContextProvider>
          <ToastContextProvider>
            <Switch>
              <Route path="/entry/:step?" component={EntryPage} />
              <Route path="/app/:guildid?/:channelid?" component={AppPage} />
              <Redirect to="/entry/serverselect" />
            </Switch>
          </ToastContextProvider>
        </CommonDialogContextProvider>
      </Suspense>
    </ThemeProvider>
  );
};

export const Root = React.memo(_Root);
