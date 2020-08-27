import React, { useRef, useCallback, useEffect } from "react";
import {
  makeStyles,
  Theme,
  List,
  Typography,
  ListSubheader,
} from "@material-ui/core";
import { Comms } from "../../../../comms/Comms";
import { useLocation, useParams } from "react-router";
import { Message } from "./Message";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessagesList,
  IMessage,
  setMessages,
  setReachedTop,
} from "../../../../redux/reducers/AppReducer";
import { RootState } from "../../../../redux/redux";

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

let previousScrollHeight = 0;
let previousScrollTop = 0;
let scrollTrigger = false;

const _MessagesArea = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { guildid, channelid } = useParams<{
    guildid?: string;
    channelid?: string;
  }>();
  const classes = messagesAreaStyles();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const host = location.hash.substr(1);
  const messageList = useSelector(
    (state: RootState) =>
      state.appReducer.hosts[host]?.channels?.[channelid || ""]?.messageList
  );
  const reachedTop = useSelector(
    (state: RootState) =>
      state.appReducer.hosts[host]?.channels?.[channelid || ""]?.reachedTop
  );

  useEffect(() => {
    (async () => {
      if (host && guildid && channelid && !messageList) {
        try {
          const resp = await Comms.connections[host].getChannelMessages(
            guildid,
            channelid
          );
          const respMsgs = await resp.message?.toObject();
          respMsgs?.messagesList.reverse();
          dispatch(
            setMessagesList({
              host,
              channelID: channelid,
              messageList: (respMsgs?.messagesList || []).map(
                (m) => m.location!.messageId
              ),
            })
          );
          dispatch(
            setMessages({
              host,
              messages: (respMsgs?.messagesList || []).reduce<{
                [id: string]: IMessage;
              }>((obj, m) => {
                obj[m.location!.messageId] = {
                  authorID: m.authorId,
                  createdAt: m.createdAt?.seconds || 0,
                  content: m.content,
                };
                return obj;
              }, {}),
            })
          );
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [guildid, channelid, host, messageList]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!scrollTrigger) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    } else {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight -
        previousScrollHeight +
        previousScrollTop;
      scrollTrigger = false;
    }
  }, [messageList]);

  const onMessageListScroll = useCallback(
    async (event: React.UIEvent<HTMLDivElement>) => {
      if (reachedTop) return;
      if (event.currentTarget.scrollTop === 0) {
        scrollTrigger = true;
        previousScrollHeight = event.currentTarget.scrollHeight;
        previousScrollTop = event.currentTarget.scrollTop;
        if (guildid && channelid && messageList) {
          const resp = await Comms.connections[host].getChannelMessages(
            guildid,
            channelid,
            messageList[0]
          );
          const { messagesList: loadedMessages } = resp.message!.toObject();
          if (loadedMessages.length !== 0) {
            dispatch(
              setMessages({
                host,
                messages: loadedMessages.reduce<{
                  [messageID: string]: IMessage;
                }>((obj, m) => {
                  obj[m.location!.messageId] = {
                    authorID: m.authorId,
                    createdAt: m.createdAt?.seconds || 0,
                    content: m.content,
                  };
                  return obj;
                }, {}),
              })
            );
            dispatch(
              setMessagesList({
                host,
                channelID: channelid,
                messageList: [
                  ...(loadedMessages
                    .map((m) => m.location!.messageId)
                    .reverse() || []),
                  ...messageList,
                ],
              })
            );
          } else {
            dispatch(
              setReachedTop({
                host,
                channelID: channelid,
                reachedTop: true,
              })
            );
          }
        }
      }
    },
    [host, guildid, channelid, messageList]
  );

  return (
    <div
      className={classes.root}
      ref={containerRef}
      onScroll={onMessageListScroll}
    >
      <List
        subheader={
          reachedTop ? (
            <ListSubheader component="div" disableSticky={true}>
              Welcome to #{channelid}
            </ListSubheader>
          ) : undefined
        }
      >
        {messageList?.map((messageID) => (
          <Message key={messageID} messageID={messageID} />
        ))}
      </List>
    </div>
  );
};

export const MessagesArea = React.memo(_MessagesArea);
