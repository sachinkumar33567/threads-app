import { Flex, Image, useColorMode } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import authScreenAtom from "../atoms/authAtom";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user ? (
        <Link to={"/"}>
          <AiFillHome size={24} />
        </Link>
      ) : (
        <Link to={"/auth"} onClick={() => setAuthScreen("signin")}>
          Sign in
        </Link>
      )}
      <Image
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        alt="logo"
        cursor={"pointer"}
        onClick={toggleColorMode}
      />
      {user ? (
        <Flex gap={{ base: 2, md: 4 }} alignItems={"center"}>
          <Link to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Link to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </Link>
          <Link to={`/settings`}>
            <MdOutlineSettings size={20} />
          </Link>
          <Logout />
        </Flex>
      ) : (
        <Link to={"/auth"} onClick={() => setAuthScreen("signup")}>
          Sign up
        </Link>
      )}
    </Flex>
  );
}
