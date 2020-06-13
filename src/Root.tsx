import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { createMuiTheme, ThemeProvider, CssBaseline } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";

import { RootState } from "./redux/redux";
import { Loading } from "./components/Loading";
import { HarmonyDark } from "./HarmonyDark";

const EntryPage = lazy(async () => ({
  default: await (await import("./pages/entry/Entry")).Entry,
}));

export const Root = React.memo(() => {
  const themeState = useSelector((state: RootState) => state.theme);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/entry/:step?" component={EntryPage} />
        </Switch>
      </Suspense>
    </ThemeProvider>
  );
});
