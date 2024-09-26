import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

export default function Home() {
  const setUser = useSetRecoilState(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getFeedPosts = async () => {
      try {
        const cookie_res = await fetch("/api/auth/cookie");
        const cookie_data = await cookie_res.json();
        if (!cookie_data.token) {
          localStorage.removeItem("user");
          setUser(null);
          return;
        }
        const res = await fetch("/api/post/feed");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message);
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, []);

  return (
    <Flex gap={4} alignItems={"flex-start"}>
      <Box flex={70}>
        {loading && (
          <Flex justifyContent={"center"}>
            <Spinner size={"lg"} />
          </Flex>
        )}
        {!loading &&
          posts.map((post) => (
            <Post key={post._id} userId={post.userId} post={post} />
          ))}
      </Box>
      <Box flex={30} p={1} display={{ base: "none", md: "block" }}>
        <SuggestedUsers />
      </Box>
    </Flex>
  );
}
