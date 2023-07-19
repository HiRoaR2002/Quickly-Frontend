import React, { useEffect } from 'react'
import './HomePage.css'
import logo from '../assets/logo.png'
import { Container, Box, Image, Tab, TabList, Tabs, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom'
const HomePage = () => {

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);
  return (
    <Container maxW='xl' centerContent
      justifyContent='center' mt={'5rem'}>
      <Box bg={'white'}
        borderRadius={100}
        justifyContent={'center'}>
        <Image src={logo} alt=""
          height={150}
          width={150}
          //  margin={}
          ml='20'
          mr='20'
        />
      </Box>
      <Box
        bg={'white'}
        margin={'2rem'}
        // alignContent={'center'}
        // justifyContent={'center'}
        alignItems={'center'}
        borderRadius={'2rem'}
      >
        <Tabs variant='soft-rounded' colorScheme='green'
          margin={'1rem'}
          marginLeft={'4.5rem'}
          marginRight={'4.5rem'}>

          <TabList>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>

      </Box>
    </Container>
  )
}

export default HomePage
