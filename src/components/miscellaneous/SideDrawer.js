import {
  Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay,
  Image, Input, Menu, MenuButton, MenuDivider, MenuItem,
  MenuList, Spinner, Text, Tooltip, useDisclosure, useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';
import logo from '../../assets/logo.png'
import { PhoneIcon, BellIcon, ChevronLeftIcon, ChevronDownIcon, TriangleDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import { Effect } from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge';

const SideDrawer = () => {

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const history = useHistory();
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  }

  const toast = useToast()

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Type something",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }


  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose1();

    } catch (error) {

      toast({
        title: "Chat cannot be created!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });
    }


  };

  return (
    <div style={{ fontSize: '2rem' }}>
      <Box color={'white'}
        display={'flex'}
        justifyContent={'space-between'}
        w={"100%"}
        boxShadow='dark-lg'
        rounded='md'
      >
        <Tooltip label="Seach Users Here"
          hasArrow
          placement='bottom-end'>
          <Button variant='ghost' color={'grey'}
            borderRadius={'1rem'} margin={2} onClick={onOpen1} >
            <i class="fa fa-search" aria-hidden="true"></i>
            <Text
              display={{ base: "none", md: "flex" }}
              px={"4"} fontSize={'1.2rem'}
            >Search User</Text>
          </Button>

        </Tooltip>
        <Text fontFamily={'cursive'}>Quick <span style={{ color: 'rgb(169,169,169)' }}>Ly</span></Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.lenght}
                effect={Effect.SCALE}
              />
              <BellIcon />
            </MenuButton>
            <MenuList color={'black'}
              pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem key={notif._id} onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif))
                }}>
                  {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList color={'black'}>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} >Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box >
      <Drawer
        placement='left'
        isOpen={isOpen1}
        onClose={onClose1}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Type here...' value={search}
              onChange={(e) => setSearch(e.target.value)} />

            {loading ? (
              <ChatLoading />
            ) :
              (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}

                  />
                ))
              )

            }
            {loadingChat && <Spinner ml={'auto'} display={'flex'} />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose1}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={handleSearch}>Find</Button>
          </DrawerFooter>

        </DrawerContent>

      </Drawer>
    </div >
  )
}

export default SideDrawer













