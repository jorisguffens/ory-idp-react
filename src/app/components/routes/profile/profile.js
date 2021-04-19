import React, {Suspense} from "react";

import {CircularProgress, Container, Paper, Typography} from "@material-ui/core";

import {useAuth} from "../../../hooks/kratos";
import ErrorBoundary from "../../common/errorBoundary/errorBoundary";
import Layout from "../../layout/layout/layout";

export default function Profile() {
    //fallback={(
    //             <Redirect to={"/auth/login"}/>
    //         )}
    return (
        <ErrorBoundary >
            <Suspense fallback={(
                <>
                    <CircularProgress/>
                </>
            )}>
                <Layout>
                    <ProfilePage/>
                </Layout>
            </Suspense>
        </ErrorBoundary>
    )
}

function ProfilePage() {
    const {user} = useAuth();

    console.log(user);

    return (
        <>
            <Container maxWidth={"lg"}>
                <Paper square>

                    <Typography variant={"h1"}>Profile</Typography>

                    <Typography>
                        {user.traits.email}
                    </Typography>

                </Paper>
            </Container>
        </>
    )
}