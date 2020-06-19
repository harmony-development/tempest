import React, { useState, useEffect, useCallback } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  makeStyles,
  Button,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

import { useDialog } from "../../components/dialog/CommonDialogContext";

import { AddServerDialog } from "./AddServerDialog";

export interface IServerList {
  [key: string]: {
    ip: string;
  };
}

const serverSelectStyles = makeStyles((theme) => ({
  serverListItem: {
    padding: theme.spacing(2),
  },
  serverList: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    maxHeight: "500px",
    overflowY: "auto",
  },
  serverListFooter: {
    paddingTop: theme.spacing(2),
  },
}));

const defaultServers: IServerList = {
  official: {
    ip: "127.0.0.1:2289",
  },
  KDE: {
    ip: "harmony.kde.org:2289",
  },
};

const tryParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
};

const _ServerSelect = (props: {
  selectedServer: string;
  setSelectedServer: (selectedServer: string) => void;
}) => {
  const classes = serverSelectStyles();
  const dialog = useDialog();
  const i18n = useTranslation(["entry"]);
  const [servers, setServers] = useState<IServerList>(
    tryParse(localStorage.getItem("entry_serverlist") || "") || defaultServers
  );
  const [addingServer, setAddingServer] = useState(false);

  useEffect(() => {
    if (servers)
      localStorage.setItem("entry_serverlist", JSON.stringify(servers));
  }, [servers]);

  const addServerDialogCancel = useCallback(() => setAddingServer(false), []);

  const onServerAdded = useCallback(
    (label: string, ip: string) => {
      setServers({
        ...servers,
        [label]: {
          ip,
        },
      });
      setAddingServer(false);
    },
    [servers]
  );

  const removeServer = (label: string) => {
    dialog({
      type: "confirm",
      title: i18n.t("entry:server-select.remove-server-title"),
      description: i18n.t("entry:server-select.remove-server-description"),
    }).then(() => {
      const { [label]: _, ...remaining } = servers;
      setServers(remaining);
    });
  };

  return (
    <div>
      <List className={classes.serverList}>
        {Object.keys(servers).map((name) => {
          return (
            <ListItem
              button
              className={classes.serverListItem}
              key={name}
              selected={
                Object.keys(servers).filter(
                  (v) => v === name && props.selectedServer === servers[v].ip
                ).length > 0
              }
              onClick={() => {
                props.setSelectedServer(servers[name].ip);
              }}
            >
              <ListItemText primary={name} secondary={servers[name].ip} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => removeServer(name)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
        <AddServerDialog
          open={addingServer}
          serverAdded={onServerAdded}
          cancel={addServerDialogCancel}
        />
      </List>
      <div className={classes.serverListFooter}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddingServer(true)}
        >
          {i18n.t("entry:add-server")}
        </Button>
      </div>
    </div>
  );
};

export const ServerSelect = React.memo(_ServerSelect);
