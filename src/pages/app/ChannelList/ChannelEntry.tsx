import React, { useCallback } from "react";
import { useParams, useHistory } from "react-router";
import { ChannelListItem } from "../../../components/ChannelListItem";

export const _ChannelEntry = (props: {
  channelID: string;
  channelName: string;
}) => {
  const history = useHistory();
  const { guildid, channelid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();

  const onChannelListItemClick = useCallback(
    (c) => {
      history.push({
        pathname: `/app/${guildid}/${c}`,
        hash: window.location.hash,
      });
    },
    // eslint-disable-next-line
    [guildid]
  );

  return (
    <ChannelListItem
      selected={channelid === props.channelID}
      onClick={onChannelListItemClick}
      displayChannel={props.channelName || props.channelID}
      topic={"Hi this is a sample topic"}
      key={props.channelID}
      channelID={props.channelID}
    />
  );
};

export const ChannelEntry = React.memo(_ChannelEntry);
