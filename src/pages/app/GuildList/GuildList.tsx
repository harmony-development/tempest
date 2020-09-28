import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { setGuildDialogOpen } from "../../../redux/reducers/UIReducer";
import { GuildListEntry } from "./GuildListEntry";
import { useGuildList } from "../../../comms/Comms";

const _GuildList = () => {
  const guildsList = useGuildList();
  const dispatch = useDispatch();

  const onGuildDialogButtonClick = useCallback(() => {
    dispatch(setGuildDialogOpen(true));
  }, [dispatch]);

  return (
    <>
      {guildsList.data?.map((guild) => (
        <GuildListEntry
          key={`${guild.host}${guild.guildId}`}
          host={guild.host}
          guildID={guild.guildId}
        />
      ))}
    </>
  );
};

export const GuildList = React.memo(_GuildList);
