import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import OAuth from "./OAuth";

export default function SigninCard() {
  const setUser = useSetRecoilState(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  const handleSignin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (!checkInputs(inputs)) {
        throw new Error("All fields are required");
      }
      const res = await fetch("/api/auth/signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast("Success", "You've logged in successfully");

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error.message);
    } finally {
      setLoading(false)
    }
  };

  return (
    <form onSubmit={handleSignin}>
      <Flex align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign in
            </Heading>
          </Stack>
          <Box
            w={{ base: "full", sm: "400px" }}
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.dark")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  id="username"
                  value={inputs.username}
                  onChange={handleChange}
                  placeholder="Username / Email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type="password"
                    id="password"
                    value={inputs.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                </InputGroup>
              </FormControl>
              <Stack spacing={4} pt={2}>
                <Button
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}
                  type="submit"
                  isLoading={loading}
                >
                  Sign in
                </Button>
                <OAuth />
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Don't have an account?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => setAuthScreen("signup")}
                  >
                    Sign up
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}

const checkInputs = (inputs) => {
  const { username, password } = inputs;
  if (!username || !password) {
    return false;
  }
  return true;
};
