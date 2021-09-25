import React from "react";
import {Link} from "react-router-dom";

import {Container, Paper, Typography} from "@material-ui/core";
import Center from "../../common/center/center";


export default function Error404() {

    return (
        <Center fillPage vertical horizontal>
            <Container maxWidth={"lg"}>
                <Paper square>
                    <Typography variant={"h1"}>404</Typography>

                    <Typography>
                        The page you are looking foor does not exist.
                    </Typography>
                    <br/><br/>

                    <Link to={"/"}>Go to homepage</Link>

                </Paper>
            </Container>
        </Center>
    );
}