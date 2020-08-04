import React, { useEffect } from "react";
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
import {
  compositeKey,
  setGuildsList,
  setHosts,
  setGuild,
  Set,
} from "../../../redux/reducers/AppReducer";
import { Comms } from "../../../comms/Comms";
import { useDialog } from "../../../components/dialog/CommonDialogContext";

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
  const guilds = useSelector((state: RootState) => state.appReducer.guilds);
  const i18n = useTranslation(["ui"]);
  const dispatch = useDispatch();
  const classes = guildListStyles();
  const dialog = useDialog();

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
          dispatch(
            setHosts(
              guildsList.reduce<Set>((current, g) => {
                current[g.host] = true;
                return current;
              }, {})
            )
          );
          guildsList.forEach(async (guild) => {
            if (!Comms.connections[guild.host]) {
              Comms.connections[guild.host] = new Connection(guild.host);
            }
            const resp = (
              await Comms.connections[guild.host].getGuild(guild.guildId)
            ).message?.toObject();
            dispatch(
              setGuild({
                entry: {
                  guildID: guild.guildId,
                  host: guild.host,
                },
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
  }, [dialog, dispatch]);

  const onGuildButtonClick = () => {
    dispatch(setGuildDialogOpen(true));
  };

  return (
    <>
      {guildsList.map((guild) => (
        <Tooltip
          title={guilds[compositeKey(guild)]?.name || guild.guildID}
          placement="right"
          key={compositeKey(guild)}
        >
          <ButtonBase
            className={`${classes.guildIconRoot} ${classes.selectedGuild}`}
          >
            <img
              className={classes.guildIcon}
              src={`${HarmonyStorage.getHomeserver}/pictures/${
                guilds[compositeKey(guild)]?.picture || "default"
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
          onClick={onGuildButtonClick}
        >
          <GroupAdd />
        </ButtonBase>
      </Tooltip>
    </>
  );
};

export const GuildList = React.memo(_GuildList);
