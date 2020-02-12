import React, { useEffect, useState } from "react";
import { Event, PageView, initGA } from "../components/~common/Tracking";
import config from "../utils/config";
// import './App.css';
import {
  ThemeProvider,
  CSSReset,
  Box,
  Heading,
  Text,
  Button,
  Grid,
  Flex,
  Image,
  useDisclosure,
  useColorMode,
  Stack
} from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Container from "../components/Container";
import RequestAccess from "../components/RequestAccess";
// import GoogleButton from "../components/GoogleButton";
import { MdBookmark, MdFindInPage, MdDescription } from "react-icons/md";
import screenShotLight from "../assets/img/app-shot-light.png";
import screenShotDark from "../assets/img/app-shot-dark.png";
import SlackButton from "../components/SlackButton";
import { handleRouteChange } from "../utils/handleRouteChange";
//import GoogleLogin from "react-google-login";

const Feature = ({ title, icon, children, ...props }) => {
  return (
    <Box d="flex" alignItems="flex-start" {...props}>
      <Box>
        <Flex
          rounded="full"
          size={20}
          align="center"
          justify="center"
          borderWidth="1px"
          borderColor="teal.500"
          p="10px"
        >
          <Box size={40} color="teal.500" as={icon} />
        </Flex>
      </Box>
      <Box ml="15px">
        <Heading as="h2" size="md" fontWeight="semibold" mt="0em" mb="0.5em">
          {title}
        </Heading>
        <Text>{children}</Text>
      </Box>
    </Box>
  );
};

function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();

  useEffect(() => {
    initGA(config.googleAnalytics.apiKey);
    PageView();
    if (typeof window !== "undefined" && window.localStorage.getItem("token")) {
      setIsLoggedIn(true);
    } else setIsLoggedIn(false);
  }, [isLoggedIn]);

  return (
    <ThemeProvider>
      <CSSReset />
      <Box mb={20}>
        <Flex
          pt={["0px", "0px", "0px", "90px"]}
          maxW="1600px"
          m="auto"
          flexWrap="wrap"
          justifyContent="space-around"
        >
          <Box minWidth="340px" w="30%" as="section" pt={40} pb={50}>
            <Header landing={true} isLoggedIn={isLoggedIn} />
            <Container>
              <Box maxW="xl" mx="auto" px="10px" textAlign="center">
                <Heading
                  as="h1"
                  size="xl"
                  fontWeight="bold"
                  onClick={() =>
                    Event("Test Category", "Test Action", "Test Label")
                  }
                >
                  Your
                  <Box as="span" color="teal.500">
                    {" "}
                    code snippets
                  </Box>{" "}
                  library
                </Heading>

                <Text opacity="0.7" fontSize="lg" mt="6">
                  Codelify give to developers a central place to easily Store,
                  Manage and Retrieve code snippets they want to keep and reuse.
                </Text>

                <Box mt="6">
                  {isLoggedIn && (
                    <Button
                      mr="10px"
                      size="lg"
                      as="a"
                      variantColor="teal"
                      href={handleRouteChange()}
                      _focus={{ outline: "none" }}
                    >
                      Browse my Snippets
                    </Button>
                  )}
                  {!isLoggedIn && (
                    <Stack
                      mx="3px"
                      spacing={4}
                      d="flex"
                      justifyContent="center"
                      isInline
                    >
                      <Button
                        size="lg"
                        _focus={{ outline: "none" }}
                        onClick={onOpen}
                      >
                        Request Access
                      </Button>
                      <RequestAccess isOpen={isOpen} onClose={onClose} />
                      <SlackButton />
                      {/* <GoogleButton /> */}
                    </Stack>
                  )}
                </Box>
              </Box>
            </Container>
          </Box>

          <Container maxWidth="800px" mx="20px">
            <Image
              mt={["0px", "0px", "0px", "50px"]}
              minWidth="340px"
              w={["90%", "90%", "70%", "100%"]}
              maxW="1280px"
              borderRadius="5px"
              src={colorMode === "light" ? screenShotLight : screenShotDark}
              alt="Codelify app screenshot"
              style={{
                animation: "float 6s ease-in-out infinite"
              }}
            />
          </Container>
        </Flex>

        <Container maxW="1600px" m="auto" py={["50px", "0px", "0px", "120px"]}>
          <Box mx="20px">
            <Grid
              templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
              gap={10}
              px={{ md: 12 }}
            >
              <Feature icon={MdBookmark} title="Store">
                Code Snippets are everywhere in the developer info stream, on
                twitter, stack overflow, tutorials, medium/blog articles ...
                Codelify is the best place to store them all.
              </Feature>
              <Feature icon={MdDescription} title="Manage">
                Describe your snippets, assign meaningful Tags to each each of
                them, add the URL for context and futur reference.
              </Feature>
              <Feature icon={MdFindInPage} title="Retrieve">
                Easily retrieve any snippets with a built in search engine based
                on Snippets Tags and description... So they you can reuse them
                anytime
              </Feature>
            </Grid>
          </Box>
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default Landing;
