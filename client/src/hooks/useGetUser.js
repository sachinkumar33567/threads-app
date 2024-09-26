import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";

export default function useGetUser() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/profile/${username}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (data.isFrozen) return;
        setUser(data);
      } catch (error) {
        setFetchingPosts(false);
        showToast("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username]);

  return { user, loading };
}
