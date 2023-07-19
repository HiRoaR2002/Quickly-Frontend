import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, IconButton, Input, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Toast, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import ChatLoading from './ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({ children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSeachResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  const toast = useToast();
  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chat', { userId }, config);

    } catch (error) {

      toast({
        title: "Chat cannot be created!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });
      return;
    }


  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  }

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

      const { data } = await axios(`/api/user?search=${search}`, config);

      setLoading(false);
      setSeachResult(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }


  };
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter(
      (sel) => sel._id !== delUser._id))
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id))
        }, config);
      setChats([data, ...chats]);

      onClose();
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error occured while creating the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };


  return (
    <div >
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen} />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Group Name</Text>
            <Input placeholder='Enter the Name' value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)} />
            <Text>Add Members</Text>
            <Input placeholder='Search here...' value={search}
              onChange={(e) => handleSearch(e.target.value)} />

            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map(u => (
                <UserBadgeItem key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <div>Loading...</div>
            ) :
              (
                searchResult?.slice(0, 4).map(user => (
                  <UserListItem key={user._id}
                    user={user}
                    handleFunction={() =>
                      handleGroup(user)
                    }
                  />
                ))
              )
            }

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost' onClick={handleSubmit}>Add</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div >
  )
}

export default GroupChatModal
