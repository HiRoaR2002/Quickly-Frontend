import { CloseIcon } from '@chakra-ui/icons'
import { Box, CloseButton, Text } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor={'#256636'}
      cursor={"pointer"}
      onClick={handleFunction}
      color={'white'}
    >
      <Box display={'flex'} gap={1}>{user.name}
        <CloseIcon justifyContent={'center'}
          margin={1}
        /></Box>

    </Box>
  )
}

export default UserBadgeItem
