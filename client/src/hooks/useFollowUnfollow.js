import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import useShowToast from "./useShowToast";

export default function useFollowUnfollow(user) {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      return showToast("Error", "Please login to follow");
    }
    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/user/follow/${user._id}`, {
        method: "post",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (following) {
        user.followers.pop();
      } else {
        user.followers.push(currentUser?._id);
      }
      setFollowing(!following);
    } catch (error) {
      showToast("Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return { handleFollowUnfollow, following, loading };
}
