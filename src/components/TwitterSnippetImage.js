import React, { useState } from "react";
import { 
  Box, 
  Button, 
  Flex, 
  useColorMode, 
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Stack,   
  Text,
} from "@chakra-ui/core";
import CodeLangageBar from "../components/CodeLangageBar";
import SnippetContent from "../components/SnippetContent";
import SnippetContext from "../context/SnippetContext";
import { useQuery } from "@apollo/react-hooks";
import { GET_SNIPPET } from "../graphql/query";
import { FaTwitter } from "react-icons/fa";
import config from "../utils/config";
import domtoimage from "dom-to-image";
import axios from "axios";
import { navigate } from "@reach/router";
import { FaSurprise } from "react-icons/fa"

const TwitterSnippetImage = ({shareId}) => {
  const snippetPublicLink = `${config.host.uri}/view/snippet/${shareId}`;
  const snippetId = shareId;
  const { colorMode } = useColorMode();
  const disableEdit = true;
  const { data, loading } = useQuery(GET_SNIPPET, {
    variables: { snippetId }
  });
  const [isTwitting, setIsTwitting] = useState(false);
  const [isSuccessTwitt, setIsSuccessTwitt] = useState(false);

  const [isOpen, setIsOpen] = React.useState();
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();  

  function openTwitterUrl(twitterUrl) {
    const width = 575;
    const height = 400;
    const left = (window.outerWidth - width) / 2;
    const top = (window.outerHeight - height) / 2;
    const opts = `status=1,width=${width},height=${height},top=${top},left=${left}`;

    const twitterWindow = window.open(twitterUrl, "twitter", opts);

    var loop = setInterval(function() {
      if (twitterWindow && twitterWindow.closed) {
        clearInterval(loop);
        setIsTwitting(false);
        setIsSuccessTwitt(true);
      }
    }, 1000);
  }

  const handleShare = () => {
    setIsTwitting(true);
    let node = document.getElementById(`post-img-${shareId}`);
    domtoimage
      .toPng(node)
      .then(dataUrl => {
        axios
          .post(`${config.backend.uri}/imagetotweet`, {
            dataUrl: dataUrl,
            shareId
          })
          .then(res => {
            const url = snippetPublicLink;
            const via = "Codelify_dev";
            const title = res.data.message;
            const hashtags = "codelify,snippet";
            const twitterURL = `https://twitter.com/share?url=${url}&text=${title}&via=${via}&hashtags=${hashtags}`;
            openTwitterUrl(twitterURL);
          })
          // .finally(() => {
          //   setIsTwitting(false);
          // })
          .catch(err => {
            console.log(err, "Error trying to tweet")
            setIsTwitting(false);
            setIsSuccessTwitt(false);
            setIsOpen(true)
          } );
      })
      .catch(err => console.log(err));
  };

  return (
    <>
    <Box d="flex" flexDir="column" alignItems="center" py="40px">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Flex
            id={`post-img-${data.getSnippetDetails.shareId}`}
            w="900px"
            py="50px"
            px="80px"
            backgroundColor={colorMode === "light" ? "#FAFAFA" : "#1c222f"}
          >
            <SnippetContext.Provider value={disableEdit}>
              <Box w="100%" borderRadius="5px">
                <Box
                  py="0px"
                  pl="10px"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "auto",
                    opacity: "0.96",
                    background:
                      "linear-gradient(to bottom, transparent 50%, #051525 50%)"
                  }}
                >
                  <CodeLangageBar codeLangage={data.getSnippetDetails.lang} />
                </Box>
                <SnippetContent
                  content={data.getSnippetDetails.content}
                  id={data.getSnippetDetails.id}
                  isFav={data.getSnippetDetails.isFav}
                  codeLangage={data.getSnippetDetails.lang}
                />
              </Box>
            </SnippetContext.Provider>
          </Flex>
          <Box d="flex" w="900px" py="50px" justifyContent="flex-end">
            <Button
              _focus={{ outline: "none" }}
              variantColor="teal"
              mr={3}
              type="submit"
              isLoading={isTwitting}
              loadingText="Wiring Twitter"
              leftIcon={FaTwitter}
              onClick={
                isSuccessTwitt
                  ? () => {
                      navigate("/app");
                    }
                  : handleShare
              }
            >
              {isSuccessTwitt
                ? "All done ! Close this"
                : "Tweet this snippet !"}
            </Button>
            {!isSuccessTwitt && (
              <Button
                _focus={{ outline: "none" }}
                onClick={() => {
                  navigate("/app");
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
      <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Oooops !
          </AlertDialogHeader>        
        <AlertDialogBody>
          <Stack isInline spacing={6} alignItems="center" >
          <Box as={FaSurprise} color="red.400" size="64px"/>
          <Text fontSize="xl" >
            Looks like something went wrong
          </Text>
          </Stack>
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button variantColor="teal" ref={cancelRef} onClick={onClose} _focus={{outline:"none"}} >
            OK, will try later
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>    
  );
};

export default TwitterSnippetImage;
