import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useColorModeValue,
  FormControl,
  Textarea,
  Text,
  Flex,
  Image,
  CloseButton,
  Input,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from "react-icons/bs";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import userAtom from "../atoms/userAtom";

const MAX_CHAR = 500;
export default function CreatePost() {
  const {username} = useParams()
  const user = useRecoilValue(userAtom)
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileRef = useRef();
  const showToast = useShowToast();
  const { handleImageChange, imgURL, setImgURL } = usePreviewImg();
  const [postText, setPostText] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingChars, setRemainingChars] = useState(MAX_CHAR);

  const handleChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChars(0);
    } else {
      setPostText(inputText);
      setRemainingChars(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/post/create", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postText, imgURL }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      showToast("Success", "Post successfully uploaded");
      if (username === user.username) {
        setPosts([data, ...posts]);
      }
      onClose();
      setPostText("");
      setImgURL(null);
    } catch (error) {
      showToast("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        position={"fixed"}
        right={5}
        bottom={10}
        bg={useColorModeValue("gray.300", "gray.700")}
        size={{base: 'sm', sm: 'md'}}
        onClick={onOpen}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here..."
                value={postText}
                onChange={handleChange}
              />
              <Text
                fontSize={"xs"}
                textAlign={"right"}
                m={1}
                fontWeight={"bold"}
                color={"gray.800"}
              >
                {`${remainingChars}/500`}
              </Text>
              <Input
                type="file"
                accept="image/*"
                ref={fileRef}
                hidden
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => fileRef.current.click()}
              />
            </FormControl>
            {imgURL && (
              <Flex
                mt={5}
                w={"full"}
                maxH={"240px"}
                overflow={"auto"}
                position={"relative"}
              >
                <Image objectFit={"cover"} src={imgURL} alt="post image" />
                <CloseButton
                  position={"absolute"}
                  top={2}
                  right={2}
                  bg={"gray.800"}
                  isDisabled={loading}
                  onClick={() => setImgURL(null)}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            {/* <Button
              colorScheme="blue"
              mr={3}
              onClick={onClose}
              isDisabled={loading}
            >
              Close
            </Button> */}
            <Button
              variant="outline"
              onClick={handleCreatePost}
              isLoading={loading}
              loadingText="Posting"
              colorScheme="blue"
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
