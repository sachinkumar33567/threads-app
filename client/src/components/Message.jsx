import {
  Box,
  Flex,
  Image,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsCheck2All } from "react-icons/bs";

export default function Message({ message, ownMsg }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <Flex
      alignSelf={ownMsg ? "flex-end" : "flex-start"}
      bg={
        message.text &&
        (ownMsg ? "green.600" : useColorModeValue("gray.400", "gray.700"))
      }
      borderRadius={"md"}
      px={message.text ? 2 : 0}
      py={0}
      maxW={"85%"}
      pos={"relative"}
    >
      {message.text && (
        <Flex flexDir={"column"}>
          <Text py={!ownMsg && 1}>{message.text}</Text>
          {ownMsg && (
            <Box
              alignSelf={"flex-end"}
              ml={1}
              color={message.seen && "blue.400"}
              fontWeight={"bold"}
            >
              <BsCheck2All />
            </Box>
          )}
        </Flex>
      )}
      {message.img && !imgLoaded && (
        <Flex w={"200px"} flexDir={"column"}>
          <Image
            src={message.img}
            alt="Message image"
            borderRadius={4}
            hidden
            onLoad={() => setImgLoaded(true)}
          />
          <Skeleton h={"140px"} w={"200px"} />
          {ownMsg && (
            <Box
              alignSelf={"flex-end"}
              ml={1}
              color={message.seen && "blue.400"}
              fontWeight={"bold"}
            >
              <BsCheck2All />
            </Box>
          )}
        </Flex>
      )}
      {message.img && imgLoaded && (
        <Flex w={"200px"} flexDir={"column"}>
          <Image src={message.img} alt="Message image" borderRadius={4} />
          {ownMsg && (
            <Box
              alignSelf={"flex-end"}
              ml={1}
              color={message.seen && "blue.400"}
              fontWeight={"bold"}
            >
              <BsCheck2All />
            </Box>
          )}
        </Flex>
      )}
    </Flex>
  );
}
