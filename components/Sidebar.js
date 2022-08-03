import { MoreVert, Chat as ChatI, Search} from "@mui/icons-material";
import { Avatar, Button, IconButton } from "@mui/material";
import styled from "styled-components";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, addDoc, where, query, getDocs } from "firebase/firestore"; 
import { useCollection } from "react-firebase-hooks/firestore"
import { useAuthState} from "react-firebase-hooks/auth"
import Chat from "./Chat";


function Sidebar() {

  const [ user ] = useAuthState(auth);
  const userChatRef = query(collection(db, "chats"), where("users", "array-contains", user.email));
  const [chatsSnapshot] = useCollection(userChatRef);

  
  const createChat = () => {
    const input = prompt("Please enter an email address for the user you wish to chat with");
    if (!input) return null;
    if (EmailValidator.validate(input)  && !chatAlreadyExists(input) && input !== user.email) {
      //add chats to db chats collection
      addDoc(collection(db, "chats"), {
        users: [user.email, input],
      });
    }
  }
   
  const chatAlreadyExists = (recipientEmail) => 
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)
    );
    
  


  return (
    <Container>
        <Header>
          <UserAvatar src={user.photoURL} onClick={() => signOut(auth).catch(err => console.log(err))}/>
          <IconsContainer>
            <IconButton>
              <ChatI />
            </IconButton>
            <IconButton>
              <MoreVert />
            </IconButton>
          </IconsContainer>
        </Header>
        <SearchDiv>
          <Search />
          <SearchInput placeholder="Search in chats"/>
        </SearchDiv>
        <SidebarButton onClick={createChat}>
          Start a new chat
        </SidebarButton>
        {/* list of chats  */}
        {chatsSnapshot?.docs.map(chat => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
        ))}
    </Container>
  )
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  `;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const IconsContainer = styled.div``;
const SearchDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;
const SearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;
const SidebarButton = styled(Button)`
  width: 100%;
  color: #000;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;