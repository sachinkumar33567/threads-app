import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";

export default function useLogout() {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast("Success", data.message);

      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      showToast("Error", error.message);
    }
  };

  return handleLogout;
}
