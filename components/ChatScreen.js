import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useRouter } from 'next/router';
import { Avatar, IconButton } from "@mui/material";
import { MoreVert, AttachFile, InsertEmoticon, Mic} from "@mui/icons-material";
import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import Message from "./Message";
import { useRef, useState } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react"

function ChatScreen({chat, messages}) {
  const [ user ] = useAuthState(auth);
  const [input, setInput] = useState("");
  const endOfMessageRef = useRef(null);
  const router = useRouter();
  const [ messagesSnapShot ] = useCollection(query(collection(doc(db, "chats", router.query.id), 'messages'), orderBy('timestamp', 'asc')));
  const [ recipientSnapshot] = useCollection(query(collection(db, "users"), where("email", "==", getRecipientEmail(chat.users, user))));
  const showMessages = () => {
   if (messagesSnapShot) {
    return messagesSnapShot.docs.map(message => (
      <Message key={message.id} user={message.data().user} message={{
        ...message.data(),
        timestamp: message.data().timestamp?.toDate().getTime(),
      }}/>
    ))
   } else {
    return JSON.parse(messages).map(message => (
      <Message key={message.id} user={message.user} message={message}/>
    ))
   }
  }
  const scrollToBottom =  () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    setDoc(doc(db, 'users', user.uid), { lastSeen: serverTimestamp() }, { merge: true });
    addDoc(collection(doc(db, "chats", router.query.id), 'messages'), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL : user.photoURL,
    });
    setInput("");
    scrollToBottom();
  }
  
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoUrl}/>
        ) : 
        (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInfo>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last active</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={e => setInput(e.target.value)}/>
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
        <Mic />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div``;
const Header = styled.div`
  position: sticky;
  z-index: 100;
  background-color: white;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;
const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3{
    margin-bottom: -3px;;
  }
  > p{
    font-size: 14px;
    color: grey;
  }
`;
const Input = styled.input`
  flex: 1;
  outline: none;
  border-radius: 10px;
  border: none;
  margin: 0 15px;
  padding: 20px;
  position: sticky;
  background-color: whitesmoke ;
 

`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 30px;
  min-height: 90vh;
  background-color: #e5ded8;
`;
const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;