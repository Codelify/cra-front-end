import React, { useState } from "react";
import {
  Box,
  Flex,
  Stack,
  Link,
  Icon,
  Divider,
} from "@chakra-ui/core";
import SnippetHeading from "./SnippetHeading";
import Description from "./SnippetDescription";
import SnippetTags from "./SnippetTags";
import { FaStar } from "react-icons/fa";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_SNIPPET } from "../graphql/mutation";
import SnippetContent from "./SnippetContent";
import SnippetMenu from './SnippetMenu'

const CodeSnippet = ({
  title,
  id,
  description,
  url,
  tags,
  content,
  isFav,
  index
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
  const [updateSnippet] = useMutation(UPDATE_SNIPPET);


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

  return (
    <>
      {
        index !== 0 && <Divider py="10px" mb="30px" />
      }
      <Flex flexWrap="wrap">
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
        <SnippetMenu {...{isFav, id}}/>
      </Flex>
    </>
  );
};

export default CodeSnippet;
