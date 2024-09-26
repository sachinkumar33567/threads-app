import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

export default function PostPage() {
  const { postId } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const post = posts[0];
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/post/${postId}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setPosts([data]);
      } catch (error) {
        setLoading(false);
        showToast("Error", error.message);
      }
    };

    getPost();
  }, [postId]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/profile/${post.userId}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setUser(data);
      } catch (error) {
        showToast("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (post) {
      getUser();
    }
  }, [post]);

  const handleDeletePost = async () => {
    if (!window.confirm("Are you want to delete this post")) return;
    try {
      const res = await fetch(`/api/post/delete/${post._id}`, {
        method: "delete",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      showToast("Success", "Post has been deleted");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message);
    }
  };

  if (!post && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"lg"} />
      </Flex>
    );
  }
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"lg"} />
      </Flex>
    );
  }

  if (!post && !loading) {
    return (
      <Flex justifyContent={"center"}>
        <h1>Post not found</h1>
      </Flex>
    );
  }
  if (!user && !loading) {
    return (
      <Flex justifyContent={"center"}>
        <h1>User no longer exists for this post</h1>
      </Flex>
    );
  }
  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Flex gap={3} alignItems={"center"}>
          <Avatar src={user.profilePicture} name={user.name} />
          <Flex gap={1}>
            <Text fontWeight={"bold"}>{user.username}</Text>
            <Image src="/verified.png" h={4} w={4} mt={1.5} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"} w={36} textAlign={"right"}>
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon
              cursor={"pointer"}
              onClick={(event) => handleDeletePost(event, post._id)}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{post.text}</Text>
      <Box
        border={"1px solid"}
        borderColor={"gray.light"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Image w={"full"} src={post.img} />
      </Box>
      <Flex mt={2}>
        <Actions post={post} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {post.replies.map((reply, index) => (
        <Comment
          key={index}
          reply={reply}
          isLastReply={reply.id == post.replies[post.replies.length - 1]._id}
        />
      ))}
    </>
  );
}
