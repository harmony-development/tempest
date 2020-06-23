import React from "react";
import { ButtonBase, Tooltip } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { GroupAdd } from "@material-ui/icons";

import classes from "./GuildList.module.css";

const _GuildList = () => {
  const i18n = useTranslation(["ui"]);

  return (
    <>
      <Tooltip
        title={i18n.t("ui:add-guild-button-tooltip") || ""}
        placement="right"
      >
        <ButtonBase className={classes.guildicon}>
          <GroupAdd />
        </ButtonBase>
      </Tooltip>
    </>
  );
};

export const GuildList = React.memo(_GuildList);
