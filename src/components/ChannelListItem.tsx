import React from "react";
import { makeStyles, Theme, ListItem, ListItemProps } from "@material-ui/core";

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

const _ChannelListItem = (props: ListItemProps & { button: any }) => {
  const classes = channelListItemStyles();
  return (
    <ListItem
      {...props}
      className={`${classes.root} ${props.selected ? classes.selected : ""} ${
        props.className
      }`}
    />
  );
};

export const ChannelListItem = React.memo(_ChannelListItem);
