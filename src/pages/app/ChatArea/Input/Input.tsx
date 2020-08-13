import React, { useEffect, useRef, useCallback } from "react";
import { makeStyles, Theme, TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/redux";
import { Comms } from "../../../../comms/Comms";
import { useLocation, useParams } from "react-router";

const inputStyles = makeStyles((theme: Theme) => ({
  inputRoot: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
}));

const _Input = () => {
  const classes = inputStyles();
  const { guildid, channelid } = useParams<{
    guildid: string;
    channelid: string;
  }>();
  const { hash } = useLocation();
  const focus = useSelector(
    (state: RootState) => state.UIReducer.focusChatArea
  );
  const inputField = useRef<HTMLInputElement | undefined>();
  const host = hash.substr(1);

  useEffect(() => {
    inputField?.current?.focus();
  }, [focus]);

  const onKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      // shift + enter to add new line
      if (e.key === "Enter" && !e.shiftKey) {
        if (
          inputField.current &&
          !/^\s*$/.test(inputField.current.value) &&
          guildid &&
          channelid
        ) {
          e.preventDefault();
          Comms.connections[host].sendMessage(
            guildid,
            channelid,
            inputField.current?.value
          );
          inputField.current.value = "";
        }
      }
    },
    [channelid, guildid, host]
  );

  return (
    <div className={classes.inputRoot}>
      <TextField
        inputRef={inputField}
        onKeyPress={onKeyPress}
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        label="Message"
        color="secondary"
      />
    </div>
  );
};

export const Input = React.memo(_Input);
