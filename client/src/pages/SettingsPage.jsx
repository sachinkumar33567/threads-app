import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

export default function SettingsPage() {
  const showToast = useShowToast();
  const handleLogout = useLogout();
  const handleFreeze = async () => {
    if (!window.confirm("Are you sure you want to freeze your account?"))
      return;
    try {
      const res = await fetch("/api/user/freeze", {
        method: "put",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast("Success", "Your account has been freezed");
      handleLogout();
    } catch (error) {
      showToast("Error", error.message);
    }
  };

  return (
    <>
      <Text my={1}>Freeze Your Account</Text>
      <Text my={1}>You can unfreeze your account anytime by logging in.</Text>
      <Button size={"sm"} colorScheme="red" onClick={handleFreeze}>
        Freeze
      </Button>
    </>
  );
}
