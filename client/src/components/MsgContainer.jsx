import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MsgInput from "./MsgInput";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { convAtom, selectedConvAtom } from "../atoms/convAtom";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/notification.mp3";

export default function MsgContainer() {
  const user = useRecoilValue(userAtom);
  const selectedConversation = useRecoilValue(selectedConvAtom);
  const setConversations = useSetRecoilState(convAtom);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const { socket } = useSocket();
  const messageEndRef = useRef();

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.convId) {
        setMessages((messages) => [...messages, message]);
      }
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }
      setConversations((conversations) =>
        conversations.map((conversation) => {
          if (conversation._id === message.convId) {
            return {
              ...conversation,
              lastMessage: {
                sender: message.sender,
                text: message.text,
              },
            };
          }
          return conversation;
        })
      );
    });

    return () => socket.off("newMessage");
  }, [socket]);

  useEffect(() => {
    const lastMessageFromOtherUser =
      messages.length && messages[messages.length - 1].sender !== user._id;
    if (lastMessageFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: user._id,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [messages[messages.length - 1]]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedConversation.mock) {
          setMessages([]);
          setLoading(false);
          return;
        }
        const res = await fetch(
          `/api/message/${selectedConversation.participantId}`
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
        setLoading(false);
      } catch (error) {
        showToast("Error", error.message);
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message header */}
      <Flex w={"full"} h={12} gap={2} alignItems={"center"}>
        <Avatar size={"sm"} src={selectedConversation.profilePicture} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.name}{" "}
          <Image src="/verified.png" h={4} w={4} ml={1} />
        </Text>
      </Flex>
      <Divider />
      {/* Messages */}
      <Flex flexDir={"column"} gap={2} h={"420px"} overflowY={"auto"} p={2}>
        {loading &&
          [1, 2, 3, 4, 5, 6].map((i) => (
            <Flex key={i} alignSelf={i % 2 ? "flex-start" : "flex-end"}>
              <Flex flexDir={"column"} gap={2}>
                <Skeleton
                  h={6}
                  w={"200px"}
                  alignSelf={i % 2 ? "flex-start" : "flex-end"}
                  borderRadius={"md"}
                />
                <Skeleton
                  h={4}
                  w={"120px"}
                  alignSelf={i % 2 ? "flex-start" : "flex-end"}
                  borderRadius={"md"}
                />
              </Flex>
            </Flex>
          ))}
        {!loading &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMsg={message.sender == user._id.toString()}
              />
            </Flex>
          ))}
      </Flex>
      <MsgInput setMessages={setMessages} />
    </Flex>
  );
}
