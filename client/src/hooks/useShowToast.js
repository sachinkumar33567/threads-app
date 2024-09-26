import { useToast } from "@chakra-ui/react"

export default function useShowToast() {
    const toast = useToast()
    const showToast = (title, description) => {
        toast({
            title,
            description,
            status: title.toLowerCase(),
            duration: 3000,
            isClosable: true
        })
    }

    return showToast
}