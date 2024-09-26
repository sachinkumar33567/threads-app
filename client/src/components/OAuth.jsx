import { Button, useColorModeValue } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";

export default function OAuth() {
  const setUser = useSetRecoilState(userAtom)
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false)
  const handleGoogleClick = async () => {
    try {
      setLoading(true)
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const {displayName, email, photoURL} = result.user
      const res = await fetch('/api/auth/google', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: displayName, email, profilePicture: photoURL})
      })

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast("Success", "You've logged in successfully");

      localStorage.setItem("user", JSON.stringify(data));
      setUser(JSON.stringify(data));
    } catch (error) {
      showToast("Error", error.message);
    } finally {
      setLoading(false)
    }
  };

  return (
    <Button
    size="lg"
    bg={useColorModeValue("red.600", "red.700")}
    color={"white"}
    _hover={{
      bg: useColorModeValue("red.700", "red.800"),
    }}
    onClick={handleGoogleClick}
    isLoading={loading}
    >
      Continue with Google
    </Button>
  );
}
