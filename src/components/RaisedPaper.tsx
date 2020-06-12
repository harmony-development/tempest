import React from "react";
import { Paper, PaperProps, makeStyles } from "@material-ui/core";

const raisedPaperStyles = makeStyles((theme) => ({
  raisedPaper: {
    backgroundColor: theme.palette.background.default,
  },
}));

export const RaisedPaper = React.memo(
  (
    props: {
      children: React.ReactNode;
    } & PaperProps
  ) => {
    const classes = raisedPaperStyles();

    return (
      <Paper {...props} className={`${props.className} ${classes.raisedPaper}`}>
        {props.children}
      </Paper>
    );
  }
);
