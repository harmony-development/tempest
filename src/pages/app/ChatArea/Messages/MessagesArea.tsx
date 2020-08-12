import React, { useRef, useCallback, useEffect } from "react";
import { makeStyles, Theme, List } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { focusChatInput } from "../../../../redux/reducers/UIReducer";
import { Comms } from "../../../../comms/Comms";
import { useLocation, useParams } from "react-router";
import { Message } from "./Message";

const messagesAreaStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    flex: "1 1 auto",
    overflow: "auto",
  },
}));

let previousScrollHeight = 0;
let previousScrollTop = 0;
let scrollTrigger = false;

const _MessagesArea = () => {
  const location = useLocation();
  const { guildid, channelid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();
  const dispatch = useDispatch();
  const classes = messagesAreaStyles();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const host = location.hash.substr(1);

  useEffect(() => {
    (async () => {
      if (host && guildid && channelid) {
        try {
          const resp = await Comms.connections[host].getChannelMessages(
            guildid,
            channelid
          );
        } catch (e) {}
      }
    })();
  }, [guildid, channelid, host]);

  const onKeyDown = useCallback((ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key !== "Tab") {
      dispatch(focusChatInput());
    }
  }, []);

  const onMessageListScroll = useCallback(
    async (event: React.UIEvent<HTMLDivElement>) => {
      if (event.currentTarget.scrollTop === 0) {
        scrollTrigger = true;
        previousScrollHeight = event.currentTarget.scrollHeight;
        previousScrollTop = event.currentTarget.scrollTop;
      }
    },
    []
  );

  return (
    <div
      className={classes.root}
      ref={containerRef}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onScroll={onMessageListScroll}
    >
      <List>
        <Message
          userid="123"
          messageid="321"
          username="Blusk"
          createdAt={0}
          message="Sample Message"
        />
      </List>
    </div>
  );
};

export const MessagesArea = React.memo(_MessagesArea);
