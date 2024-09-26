import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  WrapItem,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsImageFill } from "react-icons/bs";
import { selectedConvAtom } from "../atoms/convAtom";

export default function Conversation({ conversation, isOnline }) {
  const user = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] =
    useRecoilState(selectedConvAtom);
  const colorMode = useColorMode();
  const participant = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={1}
      borderRadius={"md"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          mock: conversation.mock,
          participantId: participant._id,
          name: participant.name,
          profilePicture: participant.profilePicture,
        })
      }
      bg={
        conversation._id === selectedConversation?._id &&
        (colorMode === "light" ? "gray.600" : "gray.dark")
      }
    >
      <WrapItem>
        <Avatar
          src={participant.profilePicture}
          size={{ base: "xs", sm: "sm", md: "md" }}
        >
          {isOnline && <AvatarBadge boxSize={"1em"} bg={"green.500"} />}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} gap={1} fontSize={"sm"}>
        <Text fontWeight={700} display={"flex"} alignItems={"center"}>
          {participant.username}{" "}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Flex gap={1} alignItems={"center"}>
          {lastMessage.sender == user._id && (
            <Box color={lastMessage.seen && "blue.400"}>
              <BsCheck2All size={16} />
            </Box>
          )}
          <Text fontSize={"xs"}>
            {lastMessage.text.length > 19
              ? lastMessage.text.substring(0, 19) + "..."
              : lastMessage.text ||
                (lastMessage.img && <BsImageFill size={16} />)}
          </Text>
        </Flex>
      </Stack>
    </Flex>
  );
}
