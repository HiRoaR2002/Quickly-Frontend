import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import React, { useState } from 'react';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';
const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box color={'white'}
        display={'flex'}
        justifyContent={'space-between'}
        w={'100%'}
        h={'90vh'}
        p={'10px'}>
        {user && <MyChats
          fetchAgain={fetchAgain}
        />}
        {user && <ChatBox
          fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
  //  axios.fetchChats();
}

export default ChatPage
