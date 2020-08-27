import React, { useMemo } from "react";
import { Menu, MenuItem } from "@material-ui/core";

interface IProps {
  entries: {
    [name: string]: (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => void;
  };
  mouseX?: number;
  mouseY?: number;
  onClose: () => void;
  onExited: () => void;
}

export const ContextMenu = (props: IProps) => {
  const position = useMemo(
    () => ({ top: props.mouseY || 0, left: props.mouseX || 0 }),
    [props.mouseX, props.mouseY]
  );

  return (
    <Menu
      keepMounted
      open={!!props.mouseY}
      onClose={props.onClose}
      onExited={props.onExited}
      anchorReference="anchorPosition"
      anchorPosition={position}
    >
      {Object.keys(props.entries).map((entry) => (
        <MenuItem onClick={props.entries[entry]} key={entry}>
          {entry}
        </MenuItem>
      ))}
    </Menu>
  );
};
