import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { GiConversation } from "react-icons/gi";
import Conversation from "../components/Conversation";
import MsgContainer from "../components/MsgContainer";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import { convAtom, selectedConvAtom } from "../atoms/convAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

export default function ChatPage() {
  const showToast = useShowToast();
  const [conversations, setConversations] = useRecoilState(convAtom);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] =
    useRecoilState(selectedConvAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const user = useRecoilValue(userAtom);
  const { onlineUsers, socket } = useSocket();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/message");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setConversations(data);
        setLoading(false);
      } catch (error) {
        showToast("Error", error.message);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: { ...conversation.lastMessage, seen: true },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searching || !searchTerm) return;
    try {
      setSearching(true);
      const res = await fetch(`/api/user/profile/${searchTerm}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const messegingYourself = data._id === user._id;
      if (messegingYourself) {
        showToast("Error", "You can't message yourself");
        return;
      }
      const conversationAlreadyExists = conversations.find(
        (conversation) =>
          conversation.participants[0]._id === data._id &&
          conversation.mock !== true
      );
      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          participantId: data._id,
          name: data.name,
          profilePicture: data.profilePicture,
        });
      } else {
        const mockConversation = {
          _id: data._id,
          mock: true,
          participants: [
            {
              _id: data._id,
              name: data.name,
              username: data.username,
              profilePicture: data.profilePicture,
            },
          ],
          lastMessage: {
            sender: data._id,
            text: "",
          },
        };
        const filteredConversations = conversations.filter(
          (conversation) => conversation.mock !== true
        );
        setConversations([mockConversation, ...filteredConversations]);
      }
    } catch (error) {
      showToast("Error", error.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <Box
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
    >
      {/* Conversations */}
      <Flex
        gap={4}
        flexDir={{ base: "column", md: "row" }}
        maxW={{ sm: "400px", md: "full" }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDir={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.200")}
          >
            Conversations
          </Text>
          <form onSubmit={handleSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                h={8}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button size={"sm"} onClick={handleSearch} isLoading={searching}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loading
            ? [0, 1, 2, 3, 4, 5].map((i) => (
                <Flex
                  key={i}
                  gap={4}
                  alignItems={"center"}
                  p={1}
                  borderRadius={"md"}
                >
                  <Box>
                    <SkeletonCircle size={10} />
                  </Box>
                  <Flex gap={3} flexDir={"column"} w={"full"}>
                    <Skeleton h={"10px"} w={"60%"} />
                    <Skeleton h={"8px"} w={"90%"} />
                  </Flex>
                </Flex>
              ))
            : conversations.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  conversation={conversation}
                  isOnline={onlineUsers.includes(
                    conversation.participants[0]._id
                  )}
                />
              ))}
        </Flex>
        {/* Message Container */}
        {!selectedConversation ? (
          <Flex
            flex={70}
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            p={2}
            h={"400px"}
            borderRadius={"md"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>
              {!loading && !conversations[0]
                ? "Search a user to start chat with"
                : "Select a conversation to start messaging"}
            </Text>
          </Flex>
        ) : (
          <MsgContainer />
        )}
      </Flex>
    </Box>
  );
}
