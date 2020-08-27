import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../../redux/redux";
import { Comms } from "../../../comms/Comms";
import { useParams, useHistory } from "react-router";
import {
  setChannelsList,
  setChannels,
  IChannel,
  setSelectedChannel,
} from "../../../redux/reducers/AppReducer";
import { List } from "@material-ui/core";
import { ChannelListItem } from "../../../components/ChannelListItem";

const _ChannelList = () => {
  const history = useHistory();
  const { guildid, channelid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();
  const host = window.location.hash.substr(1);

  const channelList = useSelector(
    (root: RootState) =>
      root.appReducer.hosts[host]?.guilds?.[guildid || ""]?.channelsList
  );
  const channels = useSelector(
    (root: RootState) => root.appReducer.hosts[host]?.channels
  );
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!host || !guildid) {
        return;
      }
      if (!channelList) {
        const conn = Comms.connections[host];
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
      }
    })();
    // eslint-disable-next-line
  }, [host, guildid]);

  const onChannelListItemClick = useCallback(
    (c) => {
      dispatch(
        setSelectedChannel({
          host,
          guildID: guildid!,
          channelID: c,
        })
      );
      history.push({
        pathname: `/app/${guildid}/${c}`,
        hash: window.location.hash,
      });
    },
    [host, guildid]
  );

  return (
    <List disablePadding>
      {channelList?.map((c) => (
        <ChannelListItem
          selected={channelid === c}
          onClick={onChannelListItemClick}
          displayChannel={channels?.[c]?.name || c}
          topic={"Hi this is a sample topic"}
          key={c}
          channelID={c}
        />
      ))}
    </List>
  );
};

export const ChannelList = React.memo(_ChannelList);
