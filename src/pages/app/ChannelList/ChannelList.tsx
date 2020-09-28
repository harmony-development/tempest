import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../../redux/redux";
import { Comms, useChannelList } from "../../../comms/Comms";
import { useParams, useHistory } from "react-router";
import {
  setChannelsList,
  setChannels,
  IChannel,
  setSelectedChannel,
} from "../../../redux/reducers/AppReducer";
import { List } from "@material-ui/core";
import { ChannelListItem } from "../../../components/ChannelListItem";
import { ChannelEntry } from "./ChannelEntry";

const _ChannelList = () => {
  const history = useHistory();
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
