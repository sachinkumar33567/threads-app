import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useState } from "react";

export default function UserPost({likes, replies, postImg, postTitle, userId}) {
    const [liked, setLiked] = useState(false)

    return (
        <Link to={'/sachin/post/1'}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={'column'} alignItems={'center'}>
                    <Avatar size={'md'} src="/zuck-avatar.png" name="mark zuckerberg" />
                    <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
                    <Box w={'full'} position={'relative'}>
                        <Avatar
                        size={'xs'}
                        src="https://bit.ly/dan-abramov"
                        name="img 1"
                        position={'absolute'}
                        top={'0px'}
                        left={'15px'}
                        padding={'2px'} />
                        <Avatar
                        size={'xs'}
                        src="https://bit.ly/kent-c-dodds"
                        name="img 1"
                        position={'absolute'}
                        bottom={'0px'}
                        right={'-5px'}
                        padding={'2px'} />
                        <Avatar
                        size={'xs'}
                        src="https://bit.ly/ryan-florence"
                        name="img 1"
                        position={'absolute'}
                        bottom={'0px'}
                        left={'4px'}
                        padding={'2px'} />
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={'column'} gap={2}>
                    <Flex w={'full'} justifyContent={'space-between'}>
                        <Flex w={'full'} alignItems={'center'}>
                            <Text fontSize={'sm'} fontWeight={'bold'}>markzuckerberg</Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={'center'}>
                            <Text fontSize={'sm'} color={'gray.light'}>1d</Text>
                            <BsThreeDots />
                        </Flex>
                    </Flex>
                    <Text fontSize={'sm'}>{postTitle}</Text>
                    {postImg && (
                    <Box border={'1px solid'} borderColor={'gray.light'} rounded={'md'}
                    overflow={'hidden'} >
                        <Image w={'full'} src={postImg} />
                    </Box>
                    )}
                    <Actions liked={liked} setLiked={setLiked} />
                    <Flex gap={2} alignItems={'center'}>
                        <Text fontSize={'sm'} color={'gray.light'}>{replies} replies</Text>
                        <Box h={1} w={1} bg={'gray.light'} rounded={'full'}></Box>
                        <Text fontSize={'sm'} color={'gray.light'}>{likes} likes</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    )
}
