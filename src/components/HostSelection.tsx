import React, { useState, useCallback } from "react";
import {
  Select,
  MenuItem,
  TextField,
  makeStyles,
  Theme,
} from "@material-ui/core";

import { Set } from "../redux/reducers/AppReducer";

const hostSelectionStyles = makeStyles((theme: Theme) => ({
  menuEntry: {
    marginTop: theme.spacing(1),
  },
}));

const _HostSelection = (props: {
  host: string;
  setHost: (a: string) => void;
  customHost: string;
  setCustomHost: (a: string) => void;
  hosts: Set;
}) => {
  const classes = hostSelectionStyles();
  const [showCustomHostField, setShowCustomHostField] = useState(!props.host);

  const onHostSelectChange = useCallback(
    (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      setShowCustomHostField(!e.target.value);
      props.setHost(e.target.value as string);
    },
    [props]
  );

  const onCustomHostChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      props.setCustomHost(e.currentTarget.value);
    },
    [props]
  );

  return (
    <>
      <Select
        value={props.host}
        fullWidth
        variant="outlined"
        onChange={onHostSelectChange}
        displayEmpty
      >
        <MenuItem value="">Other</MenuItem>
        {Object.keys(props.hosts).map((h) => (
          <MenuItem key={h} value={h}>
            {h}
          </MenuItem>
        ))}
      </Select>
      {showCustomHostField ? (
        <TextField
          label="Custom Host"
          variant="outlined"
          fullWidth
          onChange={onCustomHostChange}
          value={props.customHost}
          className={classes.menuEntry}
        />
      ) : undefined}
    </>
  );
};

export const HostSelection = React.memo(_HostSelection);
