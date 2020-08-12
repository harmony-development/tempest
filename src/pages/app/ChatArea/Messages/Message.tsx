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

const messageStyles = makeStyles((theme: Theme) => ({}));

const UtcEpochToLocalDate = (time: number) => {
  const returnDate = new Date(0);
  returnDate.setUTCSeconds(time);
  return ` - ${returnDate.toDateString()} at ${returnDate.toLocaleTimeString()}`;
};

const _Message = (props: {
  userid: string;
  messageid: string;
  username: string;
  createdAt: number;
  message: string;
  avatar?: string;
}) => {
  const classes = messageStyles();

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar
          alt={props.userid}
          src={props.avatar ? props.avatar : undefined}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography>
            {props.username || props.userid}{" "}
            <Typography component="span" variant="body1" color="textSecondary">
              {UtcEpochToLocalDate(props.createdAt)}
            </Typography>
          </Typography>
        }
        disableTypography
        secondary={<>{<Typography>{props.message}</Typography>}</>}
      />
    </ListItem>
  );
};

export const Message = React.memo(_Message);
