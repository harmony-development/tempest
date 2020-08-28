import React, { useEffect, useCallback } from "react";
import { ButtonBase, Tooltip, makeStyles, Theme } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { GroupAdd } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { Connection } from "@harmony-dev/harmony-web-sdk";
import { UnaryOutput } from "@improbable-eng/grpc-web/dist/typings/unary";
import { ProtobufMessage } from "@improbable-eng/grpc-web/dist/typings/message";

import { RootState } from "../../../redux/redux";
import { HarmonyStorage } from "../../../storage/HarmonyStorage";
import { setGuildDialogOpen } from "../../../redux/reducers/UIReducer";
import { setGuildsList, setGuild } from "../../../redux/reducers/AppReducer";
import { Comms } from "../../../comms/Comms";
import { useDialog } from "../../../components/dialog/CommonDialogContext";
import { useHistory, useParams } from "react-router";
import { useContextMenu } from "../../../components/contextmenu/ContextMenuContext";

const guildListStyles = makeStyles((theme: Theme) => ({
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

const _GuildList = () => {
  const guildsList = useSelector(
    (state: RootState) => state.appReducer.guildsList
  );
  const hosts = useSelector((state: RootState) => state.appReducer.hosts);
  const { guildid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();
  const host = window.location.hash.substr(1);
  const i18n = useTranslation(["ui"]);
  const dispatch = useDispatch();
  const classes = guildListStyles();
  const contextMenu = useContextMenu();
  const dialog = useDialog();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const resp = await Comms.getHomeserverConn().getGuildList();
        const guildsList = resp.message?.toObject().guildsList;
        if (guildsList) {
          dispatch(
            setGuildsList(
              guildsList.map((v) => ({
                guildID: v.guildId,
                host: v.host,
              }))
            )
          );
          guildsList.forEach(async (guild) => {
            if (!Comms.connections[guild.host]) {
              Comms.connections[guild.host] = new Connection(guild.host);
              Comms.bindEvents(Comms.connections[guild.host]);
            }
            Comms.connections[guild.host].subscribe(guild.guildId);
            const resp = (
              await Comms.connections[guild.host].getGuild(guild.guildId)
            ).message?.toObject();
            dispatch(
              setGuild({
                guildID: guild.guildId,
                host: guild.host,
                guild: {
                  name: resp?.guildName,
                  owner: resp?.guildOwner,
                  picture: resp?.guildPicture,
                },
              })
            );
          });
        }
      } catch (ex) {
        const err = ex as UnaryOutput<ProtobufMessage>;
        dialog({
          type: "error",
          error: new Error(err.statusMessage),
        });
      }
    })();
    // eslint-disable-next-line
  }, []);

  const onGuildDialogButtonClick = useCallback(() => {
    dispatch(setGuildDialogOpen(true));
  }, [dispatch]);

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
    <>
      {guildsList.map((guild) => (
        <Tooltip
          title={
            hosts[guild.host]?.guilds?.[guild.guildID]?.name || guild.guildID
          }
          placement="right"
          key={`${guild.host}|${guild.guildID}`}
        >
          <ButtonBase
            className={`${classes.guildIconRoot} ${
              host === guild.host && guildid === guild.guildID
                ? classes.selectedGuild
                : undefined
            }`}
            onClick={() => {
              history.push({
                pathname: `/app/${guild.guildID}/${
                  hosts[guild.host]?.guilds?.[guild.guildID]?.selectedChannel ||
                  ""
                }`,
                hash: guild.host,
              });
            }}
            onContextMenu={onGuildContextMenu}
          >
            <img
              className={classes.guildIcon}
              src={`${HarmonyStorage.getHomeserver}/pictures/${
                hosts[guild.host]?.guilds?.[guild.guildID]?.picture || "default"
              }`}
              alt={""}
              draggable={false}
            />
          </ButtonBase>
        </Tooltip>
      ))}
      <Tooltip
        title={i18n.t("ui:add-guild-button-tooltip") || ""}
        placement="right"
      >
        <ButtonBase
          className={`${classes.guildIcon} ${classes.guildIconRoot}`}
          onClick={onGuildDialogButtonClick}
        >
          <GroupAdd />
        </ButtonBase>
      </Tooltip>
    </>
  );
};

export const GuildList = React.memo(_GuildList);
