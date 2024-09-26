import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import usePreviewImg from "../hooks/usePreviewImg";
import useImageUploader from "../hooks/useImageUploader";

export default function UpdateProfilePage() {
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  let cloudinaryImgURL = "";
  let [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    email: user.email,
    password: "",
  });

  const fileRef = useRef(null);
  const { handleImageChange, imgURL } = usePreviewImg();
  const { handleImageUpload } = useImageUploader();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    if (imgURL) {
      cloudinaryImgURL = await handleImageUpload(imgURL);
    }
    try {
      if (imgURL) {
        if (!cloudinaryImgURL) {
          throw new Error("Couldn't upload image");
        }
      }
      const res = await fetch(`/api/user/update/${user._id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inputs,
          profilePicture: imgURL ? cloudinaryImgURL : user.profilePicture,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast("Success", "User updated successfully");

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.log(error.message);
      showToast("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          Edit Profile
        </Heading>
        <FormControl>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar
                size="xl"
                boxShadow={"md"}
                src={imgURL || user.profilePicture}
              />
            </Center>
            <Center w="full">
              <Button
                w="full"
                onClick={() => fileRef.current.click()}
                isDisabled={loading}
              >
                Change Avatar
              </Button>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
                ref={fileRef}
              />
            </Center>
          </Stack>
        </FormControl>
        <HStack>
          <Box>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                id="name"
                value={inputs.name}
                onChange={handleChange}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel>User name</FormLabel>
              <Input
                type="text"
                id="username"
                value={inputs.username}
                onChange={handleChange}
              />
            </FormControl>
          </Box>
        </HStack>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Input
            type="text"
            id="bio"
            value={inputs.bio}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            id="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            id="password"
            placeholder="**********"
            value={inputs.password}
            onChange={handleChange}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.600"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.700",
            }}
            isDisabled={loading}
          >
            Cancel
          </Button>
          <Button
            bg={"green.600"}
            color={"white"}
            w="full"
            _hover={{
              bg: "green.700",
            }}
            onClick={handleSave}
            isLoading={loading}
            loadingText="Saving"
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
