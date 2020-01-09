import React, { useState, useContext } from "react";
import { AppContext } from "../utils/AppProvider";
import {
  Box,
  Flex,
  Input,
  Button,
  Stack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Textarea,
  useToast,
  Badge
} from "@chakra-ui/core";
import { LiveProvider, LiveEditor } from "react-live";
import theme from "prism-react-renderer/themes/nightOwl";
import { navigate } from "@reach/router";
import { useMutation } from "@apollo/react-hooks";
//import { toast } from "react-toastify";
import { CREATE_SNIPPET } from "../graphql/mutation";

const NewSnippet = props => {
  const { isOpen, onClose, firstField, btnRef, size } = props;
  const { dispatch } = useContext(AppContext);

  const initialFormValues = {
    sourceUrl: "",
    description: "",
    title: ""
  };

  const toastin = useToast();

  const [createSnippet] = useMutation(CREATE_SNIPPET);

  const handleSubmit = async () => {
    const snippetData = { ...formData, content: code };
    const token =
      (typeof window !== "undefined" && window.localStorage.getItem("token")) ||
      "";
    const variables = { input: { ...snippetData }, token };
    if (!token) {
      localStorage.setItem("snippetData", JSON.stringify(variables));
      onClose(false);
      navigate("/login");
    } else {
      const { data, error } = await createSnippet({ variables });
      if (data) {
        dispatch({
          type: "ADD_SNIPPET",
          payload: { ...data.createSnippet, title: formData.title }
        });
        onClose(false);
        toastin({
          position: "top-right",
          title: "Yooohooo ! 🍹",
          description: "Your snippet has been saved",
          status: "success",
          duration: 9000,
          isClosable: true
        });
        navigate("/app");
      }
      if (error) {
        toastin({
          position: "top-right",
          title: "An error occurred.",
          description: "Unable to create this snippet.",
          status: "error",
          duration: 9000,
          isClosable: true
        });
      }
    }
  };

  const snippetPlaceHolder = `
/* Edit or copy and paste your code snippet here */

const a = 10;
    `;

  const [code, setCode] = useState(snippetPlaceHolder);
  const [tags, setTags] = useState([]);

  const [formData, setFormData] = useState(initialFormValues);

  const handleSnippetChange = code => {
    setCode(code);
  };

  // specfifid function to managed entered tags
  const handleTags = (event) => {
    let newTag = false;
    let tag = event.target.value;
    if(tag.charAt(tag.length-1) === ','){
      // remove the comma
      tag = tag.substring(0, tag.length - 1); 
      newTag = true;
    }
    if ((event.key === "Enter" && event.target.value !== "") || newTag){
      // add it to the state holding the list of tags
      setTags(prevState => ([
        ...prevState,
        tag
      ]));
      // clear the value held in the input field
      console.dir(tags);      
    }


  }

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      finalFocusRef={btnRef}
      onClose={onClose}
      size={size}
      scrollBehavior="inside"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader
          textAlign="center"
          fontSize="xl"
          borderBottomWidth="1px"
          color="#319795"
          mb="30px"
        >
          Create a new Snippet
        </DrawerHeader>

        <DrawerBody>
          <Flex flexWrap="wrap" w="100%">
            <Stack
              borderWidth="1px"
              padding="10px"
              rounded="10px"
              minWidth="330px"
              w="35%"
              mt="20px"
              mr="20px"
              spacing="24px"
            >
              <Box>
                <FormLabel htmlFor="username">Title</FormLabel>
                <Input
                  ref={firstField}
                  id="title"
                  placeholder="Snippet title"
                  focusBorderColor="#319795"
                  name="title"
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="url">Url</FormLabel>
                <InputGroup>
                  <InputLeftAddon>http://</InputLeftAddon>
                  <Input
                    type="url"
                    id="url"
                    placeholder="Link to this snippet context/page"
                    rounded="0"
                    borderWidth="1px"
                    focusBorderColor="#319795"
                    name="sourceUrl"
                    onChange={handleChange}
                  />
                </InputGroup>
              </Box>
              <Stack justify="flex-start" isInline>
              {tags &&
              tags.map(tag => {
                return (
                  <>
                    <Badge mr="4px" variantColor="green">{tag}</Badge>
                  </>
                );
              })}
              </Stack>

              <Box>
                <FormLabel htmlFor="username">Tags</FormLabel>
                <Input
                  id="tags"
                  placeholder="Add a tags separated by comma"
                  focusBorderColor="#319795"
                  name="tags"
                  onKeyUp={handleTags}
                />
              </Box>              <Box>
                <FormLabel htmlFor="desc">Description</FormLabel>
                <Textarea
                  id="desc"
                  focusBorderColor="#319795"
                  name="description"
                  onChange={handleChange}
                />
              </Box>
            </Stack>

            <Box mt="20px" minWidth="330px" w="60%">
              <LiveProvider
                theme={theme}
                language="javascript"
                code={code.trim()}
              >
                <FormLabel htmlFor="desc">Code</FormLabel>
                <LiveEditor
                  padding={10}
                  onChange={code => handleSnippetChange(code)}
                  style={{
                    fontFamily: "Menlo,monospace",
                    borderRadius: "5px",
                    flex: 2,
                    fontSize: "14px",
                    minHeight: "300px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                />
              </LiveProvider>
            </Box>
          </Flex>
          <Flex mt="20px" justify="flex-end">
            <Button variant="outline" mr={13} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variantColor="teal" mr={35}>
              Submit
            </Button>
          </Flex>
          <Box mt="150px"></Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default NewSnippet;
