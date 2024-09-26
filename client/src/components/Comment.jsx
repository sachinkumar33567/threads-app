import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

export default function Comment({ reply, isLastReply }) {
  return (
    <>
      <Flex w={"full"} gap={4} py={2} my={2}>
        <Avatar src={reply.profilePicture} size={"sm"} />
        <Flex w={"full"} gap={1} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply.username}
            </Text>
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!isLastReply && <Divider />}
    </>
  );
}
