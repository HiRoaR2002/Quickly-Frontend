import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { InfoIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState();

  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) return

    try {
      setRenameLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put(`/api/chat/rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName,
      }, config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);


    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
    }
  }

  const handleAddUser = async (user1) => {

    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already in the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`/api/chat/groupadd`, { chatId: selectedChat._id, userId: user1._id }, config)

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
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

      const { data } = await axios.put(`/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        }, config);
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages()
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  }

  return (
    <Box>

      <InfoIcon
        cursor={'pointer'}
        onClick={onOpen}
        display={{ base: 'flex' }}
      />


      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName.toUpperCase()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

            <Box display={'flex'}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button variant={"solid"}
                colorScheme='green'
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >Update</Button>
            </FormControl>

            <FormControl display="flex">
              <Input
                placeholder="Add More Users"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />

            </FormControl>
            {loading ? (
              <Spinner size='lg' />
            ) :
              (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)}
              colorScheme='red'
            >Leave Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default UpdateGroupChatModal;
