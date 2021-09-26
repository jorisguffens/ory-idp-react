import React from "react";

import {Container, Paper, Typography} from "@mui/material";

import {useAuth} from "../../../../hooks/kratos";
import Layout from "../../../layout/layout/layout";

export default function Profile() {

    const { user } = useAuth();

    return (
        <Layout>
            <Container maxWidth={"lg"}>
                <Paper square>
                    <Typography variant={"h1"}>Profile</Typography>

                    <Typography>
                        {user.traits.email}
                    </Typography>

                </Paper>
            </Container>
        </Layout>
    )
}