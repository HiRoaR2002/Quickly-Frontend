import { Button, FormControl, FormLabel, Image, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import passhide from '../../assets/passhidden.png'
import passshow from '../../assets/passshow.png'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
const Signup = () => {
  const [show, setShow] = useState('false');
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please Select an Image',
        // description: "We've created your account for you.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "QuickLy");
      data.append("cloud_name", "dymm3eptm");
      fetch("https://api.cloudinary.com/v1_1/dymm3eptm/image/upload", {
        method: "post",
        body: data,
      }).then((res) => res.json())
        .then(data => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please Select an Image',
        // description: "We've created your account for you.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      });
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !pass) {
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
        "/api/user", { name, email, pass, pic },
        config);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push('/');
      window.location.reload(true);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack>
      <FormControl id='name' isRequired>
        <FormLabel>Full Name</FormLabel>
        <Input type='name' placeholder='Enter the Full Name' onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type='email' placeholder='Enter the Email' onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input type={show ? 'text' : 'password'} placeholder='Enter the Password'
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
      <FormControl>
        <FormLabel>Upload your picture</FormLabel>
        <Input type='file' accept='image/'
          onChange={(e) => postDetails(e.target.files[0])}
          placeholder='Enter the Full Name' />
      </FormControl>
      <Button mt={'2rem'}
        colorScheme='green'
        variant='outline'
        onClick={submitHandler}
        isLoading={loading}> Sign Up</Button>
    </VStack >
  )
}

export default Signup
