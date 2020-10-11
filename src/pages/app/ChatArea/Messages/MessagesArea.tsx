import React, { useRef, useState, useCallback, useMemo } from "react";
import { makeStyles, Theme, List, ListSubheader } from "@material-ui/core";
import { useMessages } from "../../../../comms/Comms";
import { useLocation, useParams } from "react-router";
import { Message } from "./Message";
import { useScrollHandler } from "../../../../components/useScrollHandler";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

const messagesAreaStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    flex: "1 1 auto",
    overflow: "auto",
    "&:focus": {
      outline: "none",
    },
  },
  list: {
    height: "100%",
  },
}));

const _MessagesArea = () => {
  const location = useLocation();
  const { guildid, channelid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();
  const classes = messagesAreaStyles();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const host = location.hash.substr(1);
  const messages = useMessages(host, guildid, channelid);

  const flatMessages = useMemo(() => messages.data?.flat() || [], [messages]);

  const onScrollTop = () => {
    const lastPage = messages.data?.[0];
    messages.fetchMore(lastPage?.[0]?.location?.messageId, {
      previous: true,
    });
  };

  useScrollHandler({
    target: containerRef,
    enabled: messages.canFetchMore || false,
    onScrollTop: onScrollTop,
  });

  const renderMessages = useCallback(
    (props: { index: number; style: React.CSSProperties }) => {
      const msg = flatMessages[props.index];
      return (
        <Message
          key={msg?.location?.messageId}
          messageID={msg?.location!.messageId || ""}
          authorID={msg?.authorId || ""}
          createdAt={msg?.createdAt?.seconds}
          content={msg?.content || ""}
          style={props.style}
          index={props.index}
        />
      );
    },
    [flatMessages]
  );

  return (
    <div className={classes.root} ref={containerRef}>
      <List
        subheader={
          !messages.canFetchMore ? (
            <ListSubheader component="div" disableSticky={true}>
              Welcome to #{channelid}
            </ListSubheader>
          ) : undefined
        }
        className={classes.list}
      >
        <FixedSizeList
          height={150}
          itemCount={flatMessages.length}
          width={300}
          itemSize={64}
        >
          {renderMessages}
        </FixedSizeList>
      </List>
    </div>
  );
};

export const MessagesArea = React.memo(_MessagesArea);
