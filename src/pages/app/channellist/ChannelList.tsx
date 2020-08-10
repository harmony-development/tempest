import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../../redux/redux";
import { Comms } from "../../../comms/Comms";
import { useParams } from "react-router";
import {
  setChannelsList,
  setChannels,
  IChannel,
} from "../../../redux/reducers/AppReducer";

const _ChannelList = () => {
  const { guildid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();
  const host = window.location.hash.substr(1);

  const channelList = useSelector(
    (root: RootState) =>
      root.appReducer.hosts[host]?.guilds?.[guildid || ""]?.channelsList
  );
  const channels = useSelector(
    (root: RootState) =>
      root.appReducer.hosts[host]?.guilds?.[guildid || ""]?.channels
  );
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!host || !guildid) {
        return;
      }
      const conn = await Comms.getOrFederate(host);
      const channelList = (
        await conn.getGuildChannels(guildid)
      ).message?.getChannelsList();
      dispatch(
        setChannelsList({
          host,
          guildID: guildid,
          channelList: channelList?.map((c) => c.getChannelId()) || [],
        })
      );
      dispatch(
        setChannels({
          host,
          guildID: guildid,
          channels:
            channelList?.reduce<{
              [id: string]: IChannel;
            }>((prev, curr) => {
              prev[curr.getChannelId()] = {
                name: curr.getChannelName(),
              };
              return prev;
            }, {}) || {},
        })
      );
    })();
    // eslint-disable-next-line
  }, [host, guildid]);

  return (
    <div>
      {channelList?.map((c) => (
        <h1>{channels?.[c].name || c}</h1>
      ))}
    </div>
  );
};

export const ChannelList = React.memo(_ChannelList);
