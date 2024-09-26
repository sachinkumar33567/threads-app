import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

export default function SuggestedUsers() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/suggestedUsers");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setSuggestedUsers(data);
      } catch (error) {
        showToast("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, []);

  return (
    <>
      <Text fontWeight={"bold"} mb={4}>
        Suggested Users
      </Text>
      <Flex flexDir={"column"} gap={4}>
        {loading &&
          [0, 1, 2, 3, 5].map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
            >
              {/* Avatar Skeleton */}
              <Box>
                <SkeletonCircle size={10} />
              </Box>
              {/* Username & Fullname Skeleton */}
              <Flex w={"full"} flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} w={"60px"} />
                <Skeleton h={"8px"} w={"90px"} />
              </Flex>
              {/* Follow button Skeleton */}
              <Flex>
                <Skeleton h={"20px"} w={"60px"} />
              </Flex>
            </Flex>
          ))}
        {!loading &&
          suggestedUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))}
      </Flex>
    </>
  );
}
