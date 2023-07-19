import { InfoIcon, ViewIcon } from '@chakra-ui/icons'
import {
  Button, IconButton, Image, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text,
  useDisclosure
} from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
  return (
    <div>
      {children ? (
        <span onClick={onOpen2}>{children}</span>
      ) : (
        <InfoIcon
          display={{ base: "flex" }}
          onClick={onOpen2}
          cursor={'pointer'}
        />
      )}

      <Modal blockScrollOnMount={false} isOpen={isOpen2} onClose={onClose2}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Image src={user.pic} borderRadius={'50%'} />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} justifyContent={'space-between'}>
            <Text fontFamily={'cursive'} fontSize={'1.5rem'}
              fontWeight='bold' mb='1rem'>
              {user.name}
            </Text>
            <Text p={1} fontStyle={'italic'} fontSize={'1.2rem'} mb='1rem'>
              {user.email}
            </Text>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose2}>
              Close
            </Button>
            <Button variant='solid' colorScheme='green'>View Friends</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModal
