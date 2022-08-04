import { Avatar } from '@mui/material';
import { collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import Link from "next/link";

function Chat({id, users}) {
    const [ user ] = useAuthState(auth);
    const router = useRouter();
    const [ recipientSnapshot] = useCollection(query(collection(db, "users"), where("email", "==", getRecipientEmail(users, user))))
    const recipientEmail = getRecipientEmail(users, user);
    const recipient = recipientSnapshot?.docs?.[0]?.data();

    


  return (
    <Link href={`/chat/${id}`}>
      <Container  >
        {recipient ? 
        (<UserAvatar src={recipient?.photoUrl} />) :
         (<UserAvatar>{recipientEmail[0]}</UserAvatar>) }
        <p>{recipientEmail}</p>
      </Container>
    </Link>
  )
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;