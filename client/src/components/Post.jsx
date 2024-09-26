import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

export default function Post({ post, userId }) {
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const [postedBy, setPostedBy] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/profile/${userId}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setPostedBy(data);
      } catch (error) {
        showToast("Error", error.message);
      }
    };
    getUser();
  }, [userId]);

  const handleDeletePost = async (event) => {
    event.preventDefault();
    if (!window.confirm("Are you want to delete this post")) return;
    try {
      const res = await fetch(`/api/post/delete/${post._id}`, {
        method: "delete",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      showToast("Success", "Post has been deleted");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message);
    }
  };

  return (
    <Link to={`/${postedBy.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            src={postedBy?.profilePicture}
            name={postedBy?.name}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${postedBy?.username}`);
            }}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box w={"full"} position={"relative"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>😒</Text>}
            {post.replies[0] && (
              <Avatar
                size={"xs"}
                src={post.replies[0].profilePicture}
                name={post.replies[0].name}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size={"xs"}
                src={post.replies[1].profilePicture}
                name={post.replies[1].name}
                position={"absolute"}
                bottom={"0px"}
                right={"-5px"}
                padding={"2px"}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size={"xs"}
                src={post.replies[2].profilePicture}
                name={post.replies[2].name}
                position={"absolute"}
                bottom={"0px"}
                left={"4px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex w={"full"} justifyContent={"space-between"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${postedBy?.username}`);
                }}
              >
                {postedBy?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                color={"gray.light"}
                w={36}
                textAlign={"right"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === userId && (
                <DeleteIcon cursor={"pointer"} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              border={"1px solid"}
              borderColor={"gray.light"}
              rounded={"md"}
              overflow={"hidden"}
            >
              <Image w={"full"} src={post.img} />
            </Box>
          )}
          <Actions post={post} />
        </Flex>
      </Flex>
    </Link>
  );
}
