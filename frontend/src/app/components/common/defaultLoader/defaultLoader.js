import React from "react";

import {CircularProgress} from "@mui/material";

import Center from "../center/center";

export default function DefaultLoader() {
    return (
        <Center fillPage vertical horizontal>
            <CircularProgress/>
        </Center>
    )
}