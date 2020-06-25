import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogContent, Tabs, Tab } from "@material-ui/core";

import { RootState } from "../../../redux/redux";
import { setGuildDialogOpen } from "../../../redux/reducers/UIReducer";

import { JoinGuildForm } from "./JoinGuildForm";
import { CreateGuildForm } from "./CreateGuildForm";
import classes from "./GuildDialog.module.css";

const _GuildDialog = () => {
  const open = useSelector((state: RootState) => state.UIReducer.guildDialog);
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(setGuildDialogOpen(false));
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newTab: number) => {
    setTab(newTab);
  };

  const getDialogContents = useCallback(() => {
    switch (tab) {
      case 0: {
        return <JoinGuildForm />;
      }
      case 1: {
        return <CreateGuildForm />;
      }
      default:
        return <></>;
    }
  }, [tab]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="sm">
      <DialogContent>
        <Tabs value={tab} variant="fullWidth" onChange={handleTabChange}>
          <Tab label="Join Guild" />
          <Tab label="Create Guild" />
        </Tabs>
        <div className={classes.dialogparent}>{getDialogContents()}</div>
      </DialogContent>
    </Dialog>
  );
};

export const GuildDialog = React.memo(_GuildDialog);
