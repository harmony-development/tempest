import React, { useCallback } from "react";
import { Tooltip, ButtonBase, makeStyles, Theme } from "@material-ui/core";
import { useGuildData } from "../../../comms/Comms";
import { useHistory, useParams } from "react-router";
import { useContextMenu } from "../../../components/contextmenu/ContextMenuContext";
import { HarmonyStorage } from "../../../storage/HarmonyStorage";

const guildListEntryStyles = makeStyles((theme: Theme) => ({
  guildIcon: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    borderRadius: theme.spacing(8),
    objectFit: "cover",
    backgroundColor: "black",
  },
  guildIconRoot: {
    boxSizing: "border-box",
    borderRadius: "50%",
    marginTop: theme.spacing(1),
    border: "2px solid transparent",
  },
  selectedGuild: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

const _GuildListEntry = (props: { guildID: string; host: string }) => {
  const selectedHost = window.location.hash.substr(1);
  const { guildid: selectedGuildID } = useParams<{
    guildid?: string;
  }>();
  const guild = useGuildData(props.guildID, props.host);
  const classes = guildListEntryStyles();
  const history = useHistory();
  const contextMenu = useContextMenu();

  const onGuildContextMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      contextMenu({
        entries: {
          "Leave Server": () => {},
        },
        mouseX: event.clientX,
        mouseY: event.clientY,
      });
    },
    // eslint-disable-next-line
    []
  );

  return (
    <Tooltip
      title={guild.data?.guildName || props.guildID}
      placement="right"
      key={`${props.host}|${props.guildID}`}
    >
      <ButtonBase
        className={`${classes.guildIconRoot} ${
          selectedHost === props.host && selectedGuildID === props.guildID
            ? classes.selectedGuild
            : undefined
        }`}
        onClick={() => {
          history.push({
            pathname: `/app/${props.guildID}/${
              "" // TODO: add selectedchannel to redux and refer to it here
            }`,
            hash: props.host,
          });
        }}
        onContextMenu={onGuildContextMenu}
      >
        <img
          className={classes.guildIcon}
          src={`${HarmonyStorage.getHomeserver()}/pictures/${
            guild.data?.guildPicture || "default"
          }`}
          alt={""}
          draggable={false}
        />
      </ButtonBase>
    </Tooltip>
  );
};

export const GuildListEntry = React.memo(_GuildListEntry);
