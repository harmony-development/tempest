import React, { useCallback } from "react";
import {
  makeStyles,
  Theme,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";

const channelListItemStyles = makeStyles((theme: Theme) => ({
  root: {
    "&:hover": {
      borderLeft: `${theme.palette.secondary.main} 3px solid`,
    },
    borderLeft: `${theme.palette.secondary.main} 0px solid`,
    transition: "0.1s all ease-in",
  },
  selected: {
    borderLeft: `${theme.palette.secondary.main} 3px solid`,
  },
  textContent: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
}));

const _ChannelListItem = (props: {
  displayChannel: string;
  topic?: string;
  className?: string;
  selected?: boolean;
  onClick?: (c: string) => void;
  channelID: string;
}) => {
  const classes = channelListItemStyles();

  const onClickHandler = useCallback(() => {
    props.onClick!(props.channelID);
  }, [props]);

  return (
    <ListItem
      button
      selected={props.selected}
      onClick={onClickHandler}
      className={`${classes.root} ${props.selected ? classes.selected : ""} ${
        props.className
      }`}
    >
      <ListItemText
        disableTypography
        primary={
          <Typography className={classes.textContent}>
            #{props.displayChannel}
            <Typography component="span" variant="body2" color="textSecondary">
              {` - ${props.topic}`}
            </Typography>
          </Typography>
        }
      ></ListItemText>
    </ListItem>
  );
};

export const ChannelListItem = React.memo(_ChannelListItem);
