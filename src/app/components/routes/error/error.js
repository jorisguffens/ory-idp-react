import React, {Suspense} from "react";
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import {CircularProgress, Container, Paper, Typography} from "@material-ui/core";

import {useErrorView, useRegisterFlow} from "../../../hooks/kratos";

import Center from "../../common/center/center";

export default function Error() {
    return (
        <Center vertical fillPage>
            <Container maxWidth="sm">
                <Paper square align={"center"}>
                    <Suspense fallback={(
                        <>
                            <br/><br/>
                            <CircularProgress color={"primary"}/>
                            <br/><br/>
                        </>
                    )}>
                        <ErrorDisplay/>
                    </Suspense>
                </Paper>
            </Container>
        </Center>
    )
}

function ErrorDisplay() {

    const location = useLocation();
    const params = queryString.parse(location.search);

    const [errorView] = useErrorView(params.error);
    const error = errorView.errors[0];

    return (
        <>
            <Typography variant="h3" component="h1">{error.code}</Typography>
            <br/><br/>
            <Typography variant="h5" component="h2">{error.message}</Typography>
            <br/>
            <Typography>{error.reason}</Typography>
        </>
    )
}