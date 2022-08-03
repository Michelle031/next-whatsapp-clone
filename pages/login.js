import { Button } from "@mui/material";
import Head from "next/head";
import styled from "styled-components";
import { auth, provider } from "../firebase";
import { signInWithPopup} from "firebase/auth";

function Login() {

  const signIn = () => {
    signInWithPopup(auth, provider).catch(alert);
  }

  return (
    <Container>
        <Head>
            <title>
                Login
            </title>
        </Head>
        <LoginContainer>
            <Logo src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" />
            <SignInButton variant="outlined" onClick={signIn}>Sign in with Google
            </SignInButton>
        </LoginContainer>
    </Container>
  )
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;
const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 100px;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 8px 4px 14px -3px rgba(0,0,0,0.7);
`;
const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;
const SignInButton = styled(Button)`
   &&& {
    color: #000;
    border-color: #000;
   }
`;