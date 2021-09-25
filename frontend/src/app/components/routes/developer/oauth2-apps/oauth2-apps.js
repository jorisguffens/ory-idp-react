import React from "react";
import Layout from "../../../layout/layout/layout";
import {Container, Paper, Typography} from "@material-ui/core";

export default function OAuth2Apps() {

    return (
        <Layout>
            <Container maxWidth={"lg"}>
                <Paper square>
                    <Typography variant={"h1"}>OAuth2 Apps</Typography>


                </Paper>
            </Container>
        </Layout>
    )
}