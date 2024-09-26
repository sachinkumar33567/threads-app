import {
  Flex,
  Input,
  Image,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { convAtom, selectedConvAtom } from "../atoms/convAtom";
import useShowToast from "../hooks/useShowToast";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";

export default function MsgInput({ setMessages }) {
  const setConversations = useSetRecoilState(convAtom);
  const selectedConversation = useRecoilValue(selectedConvAtom);
  const showToast = useShowToast();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgURL, setImgURL } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!message && !imgURL) || loading) return;
    try {
      setLoading(true);
      const res = await fetch("/api/message", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: selectedConversation.participantId,
          message,
          img: imgURL,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((messages) => [...messages, data]);
      setConversations((prevConversations) =>
        prevConversations.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                sender: data.sender,
                text: message,
              },
            };
          }
          return conversation;
        })
      );
      setMessage("");
      setImgURL("");
    } catch (error) {
      showToast("Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex gap={2} alignItems="center">
      <form onSubmit={handleSubmit} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <InputRightElement>
            <IoSendSharp type="submit" onClick={handleSubmit} />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor="pointer">
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>
      <Modal
        isOpen={imgURL}
        onClose={() => {
          onClose();
          setImgURL("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w="full" mt={5}>
              <Image src={imgURL} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {loading ? (
                <Spinner size="md" />
              ) : (
                <IoSendSharp
                  size={24}
                  cursor="pointer"
                  onClick={handleSubmit}
                />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
