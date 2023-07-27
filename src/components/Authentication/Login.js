import React from 'react'
import { useState } from 'react'
import passhide from '../../assets/passhidden.png'
import passshow from '../../assets/passshow.png'
import { FormControl, FormLabel, Input, VStack, Button, InputGroup, InputRightElement, Image } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
const Login = () => {
  const [show, setShow] = useState('false');
  const [email, setEmail] = useState('');
  const handleClick = () => setShow(!show);
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false)
  const toast = useToast();
  const history = useHistory();
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !pass) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/login`, { email, pass },
        config);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push('/chats');
      window.location.reload();
    }
    catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);

    }
  }
  return (
    <VStack spacing={'5px'}>
      <FormControl isRequired >
        <FormLabel>Email</FormLabel>
        <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter the Email' />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input type={show ? 'text' : 'password'} value={pass} placeholder='Enter the Password'
            onChange={(e) => setPass(e.target.value)} />
          <InputRightElement width={'4rem'}>
            <Button onClick={handleClick}>
              {show ?
                <Image src={passshow} /> : <Image src={passhide} />
              }
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme='green'
        variant='outline' mt={'2rem'}
        onClick={submitHandler} isLoading={loading}> Login </Button>
      <Button colorScheme='green' variant='solid' onClick={() => {
        setEmail("guest@example.com");
        setPass("1234567");
      }} >Login as a Guest User</Button>
    </VStack>
  )

}

export default Login
