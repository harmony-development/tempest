import React from "react";
import { ButtonBase, Tooltip } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { GroupAdd } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../../redux/redux";
import { HarmonyStorage } from "../../../storage/HarmonyStorage";
import { setGuildDialogOpen } from "../../../redux/reducers/UIReducer";
import { compositeKey } from "../../../redux/reducers/AppReducer";

import classes from "./GuildList.module.css";

const _GuildList = () => {
  const guildsList = useSelector(
    (state: RootState) => state.appReducer.guildsList
  );
  const guilds = useSelector((state: RootState) => state.appReducer.guilds);
  const i18n = useTranslation(["ui"]);
  const dispatch = useDispatch();

  const onGuildButtonClick = () => {
    dispatch(setGuildDialogOpen(true));
  };

  return (
    <>
      {guildsList.map((guild) => (
        <Tooltip title={guild.host} placement="right" key={compositeKey(guild)}>
          <ButtonBase className={classes.guildiconroot}>
            <img
              className={classes.guildicon}
              src={`${HarmonyStorage.getHomeserver}/pictures/${
                guilds[compositeKey(guild)].picture || "default"
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
        <ButtonBase className={classes.guildicon} onClick={onGuildButtonClick}>
          <GroupAdd />
        </ButtonBase>
      </Tooltip>
    </>
  );
};

export const GuildList = React.memo(_GuildList);
