import React, { useCallback, useState } from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  IconButton,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { useUserData, useDeleteMessage } from "../../../../comms/Comms";
import { MoreVert } from "@material-ui/icons";
import { useContextMenu } from "../../../../components/contextmenu/ContextMenuContext";
import { useParams } from "react-router";

const UtcEpochToLocalDate = (time: number) => {
  const returnDate = new Date(0);
  returnDate.setUTCSeconds(time);
  return ` - ${returnDate.toDateString()} at ${returnDate.toLocaleTimeString()}`;
};

const messageStyles = makeStyles((theme: Theme) => ({
  root: {
    "&:hover": {
      "& $secondaryAction": {
        display: "block",
      },
    },
  },
  secondaryAction: {
    display: "none",
  },
}));

const _Message = (props: {
  messageID: string;
  authorID: string;
  createdAt?: number;
  content: string;
  pageIndex: number;
  messageIndex: number;
}) => {
  const host = window.location.hash.substr(1);
  const { guildid, channelid } = useParams<{
    guildid: string;
    channelid: string;
  }>();
  const userDataQuery = useUserData(props.authorID, host);
  const contextMenu = useContextMenu();
  const classes = messageStyles();
  const [deleteMessage] = useDeleteMessage(
    host,
    guildid,
    channelid,
    props.messageID,
    props.pageIndex,
    props.messageIndex
  );

  const onDeleteClick = useCallback(async () => {
    await deleteMessage();
  }, []);

  const messageOptions: {
    [name: string]: (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => void;
  } = {
    Delete: onDeleteClick,
  };

  const onMessageOptionsClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
      contextMenu({
        entries: messageOptions,
        mouseX: ev.clientX,
        mouseY: ev.clientY,
      }),
    []
  );

  const onContextMenu = useCallback((ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault();
    contextMenu({
      entries: messageOptions,
      mouseX: ev.clientX,
      mouseY: ev.clientY,
    });
  }, []);

  return (
    <ListItem
      alignItems="flex-start"
      ContainerProps={{
        className: classes.root,
      }}
      dense
      onContextMenu={onContextMenu}
      button
    >
      <ListItemAvatar>
        <Avatar alt={props.authorID} src={undefined} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography>
            {props.authorID ? userDataQuery.data?.userName : props.authorID}{" "}
            <Typography component="span" variant="body1" color="textSecondary">
              {UtcEpochToLocalDate(props.createdAt || 0)}
            </Typography>
          </Typography>
        }
        disableTypography
        secondary={<>{<Typography>{props.content}</Typography>}</>}
      />
      <ListItemSecondaryAction className={classes.secondaryAction}>
        <IconButton edge="end" size="small" onClick={onMessageOptionsClick}>
          <MoreVert />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export const Message = React.memo(_Message);
