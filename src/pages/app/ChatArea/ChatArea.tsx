import React, { useRef, useMemo, useCallback } from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { focusChatInput } from "../../../redux/reducers/UIReducer";
import { MessagesArea } from "./Messages/MessagesArea";
import { Input } from "./Input/Input";

const chatAreaStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexFlow: "column",
    width: "100%",
    height: "100%",
  },
}));

const _ChatArea = () => {
  const classes = chatAreaStyles();

  return (
    <div className={classes.root}>
      <MessagesArea />
      <Input />
    </div>
  );
};

export const ChatArea = React.memo(_ChatArea);
