import React, { useEffect, useRef } from "react";
import { makeStyles, Theme, TextField } from "@material-ui/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/redux";

const inputStyles = makeStyles((theme: Theme) => ({
  inputRoot: {
    display: "flex",
    flexDirection: "row",
  },
}));

const _Input = () => {
  const classes = inputStyles();
  const focus = useSelector(
    (state: RootState) => state.UIReducer.focusChatArea
  );
  const inputField = useRef<HTMLInputElement | undefined>();

  useEffect(() => {
    inputField?.current?.focus();
  }, [focus]);

  return (
    <div className={classes.inputRoot}>
      <TextField
        inputRef={inputField}
        variant="outlined"
        fullWidth
        label="Message"
      />
    </div>
  );
};

export const Input = React.memo(_Input);
