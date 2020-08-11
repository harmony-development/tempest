import React from "react";
import {
  makeStyles,
  Theme,
  ListItem,
  ListItemProps,
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
}));

const _ChannelListItem = (props: {
  displayChannel: string;
  topic?: string;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}) => {
  const classes = channelListItemStyles();
  return (
    <ListItem
      button
      selected={props.selected}
      onClick={props.onClick}
      className={`${classes.root} ${props.selected ? classes.selected : ""} ${
        props.className
      }`}
    >
      <ListItemText
        primary={
          <>
            {`#${props.displayChannel}`}
            <Typography component="span" variant="body2" color="textSecondary">
              {` - ${props.topic}`}
            </Typography>
          </>
        }
      ></ListItemText>
    </ListItem>
  );
};

export const ChannelListItem = React.memo(_ChannelListItem);
