import { useRecoilValue } from "recoil";
import SigninCard from "../components/SigninCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";

export default function AuthPage() {
    const authScreenState = useRecoilValue(authScreenAtom)

    return <>{authScreenState === 'signin'? <SigninCard/> : <SignupCard/>}</>
}
