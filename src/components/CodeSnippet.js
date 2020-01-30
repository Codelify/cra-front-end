import React, { useState, useContext } from "react";
import { AppContext } from "../utils/AppProvider";
import {
  Box,
  Flex,
  Stack,
  Link,
  Icon,
  Divider,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/core";
import SnippetHeading from "./SnippetHeading";
import Description from "./SnippetDescription";
import SnippetTags from "./SnippetTags";
import { MdDelete } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaStar, FaArchive, FaWindowRestore } from "react-icons/fa";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_SNIPPET, UPDATE_SNIPPET } from "../graphql/mutation";
import { MY_SNIPPETs } from "../graphql/query";
import SnippetContent from "./SnippetContent";

const CodeSnippet = ({
  title,
  id,
  description,
  url,
  tags,
  content,
  isFav,
  isArchived
}) => {
  //moved ControlButtons in each filed - so we can know whitch field user wants to update
  // const ControlButtons = () => {
  //   return (
  //     <ButtonGroup mb="10px" justifyContent="center" size="sm">
  //       <Button variantColor="teal">Save</Button>
  //       <IconButton icon="close" />
  //     </ButtonGroup>
  //   );
  // };
  const [titleToUpdate, setTitleToUpdate] = useState(title);
  const [descriptionToUpdate, setDescroptionToUpdate] = useState(description);
  const [contentToUpdate, setContentToUpdate] = useState(content);
  const [resoreSnippet, setRestoreSnippet] = useState(false);
  const { state, dispatch } = useContext(AppContext);
  const [deleteSnippet, data] = useMutation(DELETE_SNIPPET);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateSnippet] = useMutation(UPDATE_SNIPPET);
  const toast = useToast();
  //console.log(resoreSnippet);
  const handleDelete = async () => {
    console.log("DELETE");
    const token =
      typeof window !== "undefined" && window.localStorage.getItem("token");
    if (token) {
      try {
        const { data } = await deleteSnippet({
          variables: {
            snippetId: id,
            token,
            archive: state.currentView === "FiArchive" ? false : true
          },
          refetchQueries: [{ query: MY_SNIPPETs, variables: { token } }]
        });

        console.log(data);

        dispatch({ type: "DELETE_SNIPPET", payload: id });
        !data.loading && onClose(false);
        toast({
          position: "top-right",
          title: state.currentView === "FiArchive" ? "Delete" : "Update",
          description:
            state.currentView === "FiArchive"
              ? "Your snippet has been successfully deleted"
              : "Your snippet has been successfully archived ",
          status: "success",
          duration: 9000,
          isClosable: true
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdate = async typeOfAction => {
    const costumObject = {};
    //construct costum object for every case for not repeting the mutation of each field
    if (typeOfAction === "title") {
      costumObject[typeOfAction] = titleToUpdate;
    }
    if (typeOfAction === "description") {
      costumObject[typeOfAction] = descriptionToUpdate;
    }
    if (typeOfAction === "content") {
      costumObject[typeOfAction] = contentToUpdate;
    }

    const token = window.localStorage.getItem("token");
    try {
      const { data } = await updateSnippet({
        variables: {
          snippetId: id,
          snippetInfo: costumObject,
          token: token
        }
        //refetchQueries: [{ query: MY_SNIPPETs, variables: { token } }]
      });
    } catch (error) {
      console.log(error);
    }
    //console.log(data,error, loading);
  };

  const handleEdit = (event, typeOfAction) => {
    // Case we update the code from Live Provider
    // event from LiveProvider its comming as a string in transformCode prop
    if (typeof event === "string") {
      setContentToUpdate(event);
    }

    //Case we update the code from title/description - onChange function
    // we have to verify if event its not a string or it has a target property
    let dataWithUpdate = event.target && event.target.value;
    switch (typeOfAction) {
      case "title":
        setTitleToUpdate(dataWithUpdate);
        break;
      case "description":
        setDescroptionToUpdate(dataWithUpdate);
        break;
      default:
        return;
    }
  };

  const styledEdit = event => {
    document.getElementById(event.target.id).classList.add("edited-div");
  };

  const [favorite, setFavorite] = useState(isFav);
  const toggleFavorite = async () => {
    setFavorite(!favorite);
    const token = window.localStorage.getItem("token");
    try {
      const { data } = await updateSnippet({
        variables: {
          snippetId: id,
          snippetInfo: { isFav: !favorite },
          token: token
        },
        refetchQueries: [{ query: MY_SNIPPETs, variables: { token } }]
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Flex flexWrap="wrap" mt="30px">
        <Stack
          mr="15px"
          minWidth="310px"
          w={["100%", "100%", "100%", "35%"]}
          spacing="14px"
        >
          <SnippetHeading
            id={id}
            title={titleToUpdate}
            handleEdit={handleEdit}
            styledEdit={styledEdit}
            handleUpdate={handleUpdate}
          />

          <Description
            id={id}
            description={descriptionToUpdate}
            handleEdit={handleEdit}
            styledEdit={styledEdit}
            handleUpdate={handleUpdate}
          />
          <Box>
            {url && (
              <Link color="teal.500" href={url} isExternal>
                Link <Icon name="external-link" mx="2px" />
              </Link>
            )}
          </Box>

          <SnippetTags id={id} tags={tags} />
        </Stack>
        <Box
          minWidth="310px"
          w={["100%", "100%", "100%", "60%"]}
          borderRadius="5px"
        >
          <SnippetContent
            content={contentToUpdate}
            id={id}
            handleEdit={handleEdit}
            handleUpdate={handleUpdate}
          />
        </Box>
      </Flex>
      <Flex mt="40px" justify="space-between" w="95%">
        {isFav ? (
          <Box
            ml="10px"
            borderRadius="5px"
            p="7px"
            backgroundColor="#FEB2B2"
            as={FaStar}
            size="33px"
            color="#FFFFFF"
            style={{
              animation: "rotation 1.5s linear"
            }}
          />
        ) : (
          <Box />
        )}
        <Menu autoSelect={false}>
          <MenuButton _focus={{ outline: "none" }} as="div">
            <IconButton
              aria-label="More options"
              icon={FiMoreHorizontal}
              color="#319795"
              _focus={{
                outline: "none"
              }}
            />
          </MenuButton>
          <MenuList closeOnBlur={true} placement="top-end">
            {state.currentView !== "FiArchive" && (
              <MenuItem onClick={toggleFavorite} as="div">
                <IconButton
                  variant="ghost"
                  aria-label="Favorite Snippet"
                  fontSize="22px"
                  color="#FEB2B2"
                  icon={FaStar}
                  _focus={{
                    outline: "none"
                  }}
                />
                {favorite ? "Remove from Favorite" : "Add to Favorite"}
              </MenuItem>
            )}
            {state.currentView === "FiArchive" && (
              <MenuItem
                onClick={() => {
                  onOpen();
                  setRestoreSnippet(true);
                }}
                as="div"
              >
                <IconButton
                  variant="ghost"
                  aria-label="Restore Snippet"
                  icon={FaWindowRestore}
                  color="#81E6D9"
                  fontSize="20px"
                  _focus={{
                    outline: "none"
                  }}
                />
                Restore Snippet
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                onOpen();
                setRestoreSnippet(false);
              }}
              as="div"
            >
              <IconButton
                variant="ghost"
                aria-label="Delete Snippet"
                fontSize={state.currentView === "FiArchive" && "25px"}
                icon={state.currentView === "FiArchive" ? MdDelete : FaArchive}
                color="#CBD5E0"
                _focus={{
                  outline: "none"
                }}
              />
              {state.currentView === "FiArchive"
                ? "Delete Snippet"
                : "Move to Archive"}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Divider />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="5px">
          <ModalHeader>
            {state.currentView === "FiArchive"
              ? resoreSnippet
                ? "This will restore the Snippet"
                : "This will delete your Snippet"
              : "This will archive this Snippet"}
          </ModalHeader>
          <ModalCloseButton _focus={{ outline: "none" }} />
          <ModalBody>Do you want to continue ?</ModalBody>
          <ModalFooter>
            <Button variantColor="teal" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleDelete} isLoading={data.loading}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CodeSnippet;
