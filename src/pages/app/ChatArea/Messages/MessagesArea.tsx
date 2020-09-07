import React, { useRef, useCallback, useEffect } from "react";
import { makeStyles, Theme, List, ListSubheader } from "@material-ui/core";
import { Comms } from "../../../../comms/Comms";
import { useLocation, useParams } from "react-router";
import { Message } from "./Message";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessagesList,
  IMessage,
  setMessages,
  setReachedTop,
  IUser,
  setMessagesListAndSetMessages,
  setUsers,
} from "../../../../redux/reducers/AppReducer";
import { RootState } from "../../../../redux/redux";
import { useIsMount } from "../../../../components/useIsMount";

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
  const isMount = useIsMount();
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
  const messages = useSelector(
    (state: RootState) => state.appReducer.hosts[host]?.messages
  );
  const users = useSelector(
    (state: RootState) => state.appReducer.hosts[host]?.users
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
            setMessagesListAndSetMessages({
              host,
              channelID: channelid,
              messageList: (respMsgs?.messagesList || []).map(
                (m) => m.location!.messageId
              ),
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
    // eslint-disable-next-line
  }, [guildid, channelid, host]);

  useEffect(() => {
    if (containerRef.current) {
      if (!scrollTrigger) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      } else {
        containerRef.current.scrollTop =
          containerRef.current.scrollHeight -
          previousScrollHeight +
          previousScrollTop;
        scrollTrigger = false;
      }
    }
  }, []);

  useEffect(() => {
    if (isMount) return;
    const userIDs = Array.from(
      new Set(
        messageList?.reduce<string[]>((arr, messageID) => {
          if (messages?.[messageID].authorID) {
            arr.push(messages?.[messageID].authorID);
          }
          return arr;
        }, [])
      )
    );
    const fetchedUsers: {
      [id: string]: IUser;
    } = {};
    const requestPromises = userIDs.map((id) => {
      if (!users?.[id]) {
        return Comms.connections[host].getUser(id).then((resp) => {
          fetchedUsers[id] = {
            username: resp.message?.getUserName(),
            avatar: resp.message?.getUserAvatar(),
          };
        });
      }
      return undefined;
    });
    Promise.all(requestPromises).then(() => {
      dispatch(
        setUsers({
          host,
          users: fetchedUsers,
        })
      );
    });
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
    // eslint-disable-next-line
    [host, guildid, channelid, messageList, reachedTop]
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
