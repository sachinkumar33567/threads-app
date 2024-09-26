import { Button } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";

export default function Logout() {
  const handleLogout = useLogout();

  return (
    <Button size={"xs"} onClick={handleLogout}>
      <FiLogOut size={18} />
    </Button>
  );
}
