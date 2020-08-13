import React from "react";
import {
  makeStyles,
  Theme,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/redux";
import { useLocation } from "react-router";

const messageStyles = makeStyles((theme: Theme) => ({}));

const UtcEpochToLocalDate = (time: number) => {
  const returnDate = new Date(0);
  returnDate.setUTCSeconds(time);
  return ` - ${returnDate.toDateString()} at ${returnDate.toLocaleTimeString()}`;
};

const _Message = (props: { messageID: string }) => {
  const location = useLocation();
  const classes = messageStyles();
  const host = location.hash.substr(1);
  const messages = useSelector(
    (state: RootState) => state.appReducer.hosts[host].messages
  );
  const messageData = messages?.[props.messageID];

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={messageData?.authorID} src={undefined} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography>
            {messageData?.authorID || messageData?.authorID}{" "}
            <Typography component="span" variant="body1" color="textSecondary">
              {UtcEpochToLocalDate(messageData?.createdAt || 0)}
            </Typography>
          </Typography>
        }
        disableTypography
        secondary={<>{<Typography>{messageData?.content}</Typography>}</>}
      />
    </ListItem>
  );
};

export const Message = React.memo(_Message);
