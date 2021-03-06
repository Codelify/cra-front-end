import React from "react";
import {
    Box,
} from "@chakra-ui/core";

const Container = (props) => {
    return(
        <Box width="full" maxWidth="1600px" mx="auto" {...props} />
    );
}

export default Container