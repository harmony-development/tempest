import React from "react";

import { useChannelList } from "../../../comms/Comms";
import { useParams } from "react-router";
import { List } from "@material-ui/core";
import { ChannelEntry } from "./ChannelEntry";

const _ChannelList = () => {
  const host = window.location.hash.substr(1);
  const { guildid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();
  const channelList = useChannelList(host, guildid);

  return (
    <List disablePadding>
      {channelList.data?.map((c) => (
        <ChannelEntry
          channelID={c.channelId}
          channelName={c.channelName}
          key={c.channelId}
        />
      ))}
    </List>
  );
};

export const ChannelList = React.memo(_ChannelList);
