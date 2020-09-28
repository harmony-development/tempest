import React, { useRef, useState } from "react";
import { makeStyles, Theme, List, ListSubheader } from "@material-ui/core";
import { useMessages } from "../../../../comms/Comms";
import { useLocation, useParams } from "react-router";
import { Message } from "./Message";
import { useScrollHandler } from "../../../../components/useScrollHandler";

const messagesAreaStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    flex: "1 1 auto",
    overflow: "auto",
    "&:focus": {
      outline: "none",
    },
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
  const [reachedTop, setReachedTop] = useState(false);
  const messages = useMessages(host, guildid, channelid);

  const onScrollTop = () => {};

  useScrollHandler({
    target: containerRef,
    enabled: reachedTop,
    onScrollTop: onScrollTop,
  });

  return (
    <div className={classes.root} ref={containerRef}>
      <List
        subheader={
          reachedTop ? (
            <ListSubheader component="div" disableSticky={true}>
              Welcome to #{channelid}
            </ListSubheader>
          ) : undefined
        }
      >
        {messages.data?.map((page, i) => (
          <React.Fragment key={i}>
            {page?.map((msg) => (
              <Message
                key={msg.location?.messageId}
                messageID={msg.location!.messageId}
                authorID={msg.authorId}
                createdAt={msg.createdAt?.seconds}
                content={msg.content}
              />
            ))}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export const MessagesArea = React.memo(_MessagesArea);
