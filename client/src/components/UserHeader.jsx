import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

export default function UserHeader({ user }) {
  const currentUser = useRecoilValue(userAtom);
  const { name, username, profilePicture, bio } = user;
  const { handleFollowUnfollow, following, loading } = useFollowUnfollow(user);
  const showToast = useShowToast();
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => showToast("Success", "Profile link copied"));
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text
            fontSize={{
              base: "lg",
              md: "xl",
              lg: "2xl",
            }}
            fontWeight={"bold"}
          >
            {name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text
              fontSize={{
                base: "sm",
                lg: "md",
              }}
            >
              {username}
            </Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              px={2}
              py={1}
              rounded={"md"}
            >
              threads.next
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar
            name={name}
            // src="/zuck-avatar.png"
            src={profilePicture || ""}
            size={{
              base: "md",
              md: "lg",
              lg: "xl",
            }}
          />
        </Box>
      </Flex>
      <Text>{bio}</Text>
      {currentUser?._id === user._id ? (
        <Link to={"/update"}>
          <Button size={"md"}>Edit Profile</Button>
        </Link>
      ) : (
        <Button size={"md"} onClick={handleFollowUnfollow} isLoading={loading}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box h={1} w={1} bg={"gray.light"} rounded={"full"}></Box>
          <Link color="gray.light">instagram.com</Link>
        </Flex>
        <Flex gap={2} alignItems={"center"}>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}
