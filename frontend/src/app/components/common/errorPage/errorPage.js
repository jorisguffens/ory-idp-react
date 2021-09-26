import React from "react";
import {Link} from "react-router-dom";

import {Container, Paper, Typography} from "@mui/material";
import Center from "../../common/center/center";

export default function ErrorPage({title, subTitle, description, return_path = "/", return_text = "Go to homepage"}) {
    return (
        <Center fillPage vertical horizontal>
            <Container maxWidth={"lg"}>
                <Paper square className={"text-center"}>
                    <Typography variant="h3" component="h1">{title}</Typography>
                    <br/><br/>

                    {subTitle && (
                        <>
                            <Typography variant="h5" component="h2">{subTitle}</Typography>
                            <br/>
                        </>
                    )}

                    {description && (
                        <>
                            <Typography>{description}</Typography>
                            <br/>
                        </>
                    )}

                    <Link to={return_path}>{return_text}</Link>
                </Paper>
            </Container>
        </Center>
    );
}