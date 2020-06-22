import React from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import GoogleLogin from "react-google-login";
import { Button, useToast } from "@chakra-ui/core";
import { navigate } from "@reach/router";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_SNIPPET, LOGIN_WITH_GOOGLE } from "../../graphql/mutation";
import { handleRouteChange } from "../../utils/handleRouteChange";

export default function GoogleButton() {
  const [ isLoading, setIsLoading] = React.useState(false)
  const [login] = useMutation(LOGIN_WITH_GOOGLE);
  const [createSnippet] = useMutation(CREATE_SNIPPET);
  const toasting = useToast();

  const responseGoogle = async response => {
    const { profileObj } = response;
    if (profileObj) {
      const {
        googleId: password,
        givenName: firstName,
        familyName: lastName,
        email,
        imageUrl: avatar
      } = profileObj;
      // localStorage.setItem("avatar", profileObj.imageUrl);
      try {
        const { data } = await login({
          variables: {
            input: { firstName, lastName, email, password, avatar }
          }
        });
        if (data) {
          localStorage.setItem("token", data.authWithGoogle.token);
          if (localStorage.getItem("snippetData")) {
            const snippetData = {
              ...JSON.parse(
                typeof window !== "undefined" &&
                  window.localStorage.getItem("snippetData")
              ),
              token: data.authWithGoogle.token
            };
            const { data: res, error } = await createSnippet({
              variables: snippetData
            });
            if (res) {
              typeof window !== "undefined" &&
                window.localStorage.removeItem("snippetData");
              toasting({
                position: "top-right",
                title: "Yooohooo ! 🍹",
                description: "Your snippet has been saved",
                status: "success",
                duration: 9000,
                isClosable: true
              });
            }
            if (error) {
              toasting({
                position: "top-right",
                title: "An error occurred.",
                description: "Unable to create this snippet.",
                status: "error",
                duration: 9000,
                isClosable: true
              });
            }
          }
          navigate(handleRouteChange());
        }
        navigate(handleRouteChange());
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      render={renderProps => (
        <Button
          _focus={{ outline: "none" }}
          variantColor="teal"
          variant="outline"
          as="a"
          size="md"
          href="#"
          isLoading={isLoading}
          loadingText="Submitting"
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          leftIcon={AiOutlineGoogle}
        >
          Google Login
        </Button>
      )}
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={()=>{setIsLoading(false)}}
      onRequest={()=>{setIsLoading(true)}}
      cookiePolicy={"single_host_origin"}
    />
  );
}
