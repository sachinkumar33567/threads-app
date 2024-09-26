import UserHeader from "../components/UserHeader";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUser from "../hooks/useGetUser";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

export default function UserPage() {
  const { user, loading } = useGetUser();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    setPosts([])
    const getPosts = async () => {
      try {
        const res = await fetch(`/api/post/user/${user._id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message);
      } finally {
        setFetchingPosts(false);
      }
    };

    if (user) {
      getPosts();
    }
  }, [user]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"lg"} />
      </Flex>
    );
  }
  if (!user && !loading) {
    return (
      <Flex justifyContent={"center"}>
        <h1 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          User not found
        </h1>
      </Flex>
    );
  }

  return (
    <>
      <UserHeader user={user} />

      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"lg"} />
        </Flex>
      )}

      {!fetchingPosts && posts.length === 0 ? (
        <Flex justifyContent={"center"} mt={4}>
          <h1 style={{ fontSize: "1.2rem" }}>User have no posts</h1>
        </Flex>
      ) : (
        posts.map((post) => (
          <Post key={post._id} post={post} userId={user._id} />
        ))
      )}
    </>
  );
}
