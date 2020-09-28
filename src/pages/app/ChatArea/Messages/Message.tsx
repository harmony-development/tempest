import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/redux";
import { useLocation } from "react-router";
import { useUserData } from "../../../../comms/Comms";

const UtcEpochToLocalDate = (time: number) => {
  const returnDate = new Date(0);
  returnDate.setUTCSeconds(time);
  return ` - ${returnDate.toDateString()} at ${returnDate.toLocaleTimeString()}`;
};

const _Message = (props: {
  messageID: string;
  authorID: string;
  createdAt?: number;
  content: string;
}) => {
  const host = window.location.hash.substr(1);
  const userDataQuery = useUserData(props.authorID, host);

  return (
    <ListItem alignItems="flex-start">
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
    </ListItem>
  );
};

export const Message = React.memo(_Message);
