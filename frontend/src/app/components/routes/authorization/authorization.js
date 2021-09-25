import React from "react";
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import {Container, Paper} from "@material-ui/core";

import ErrorBoundary from "../../common/errorBoundary/errorBoundary";
import DefaultLoader from "../../common/defaultLoader/defaultLoader";
import Center from "../../common/center/center";
import Consent from "./consent/consent";


function Authorization() {

    const location = useLocation();
    const params = queryString.parse(location.search);

    // initialize login flow
    if ( !params.flow ) {
        return (
            <p>
                Error: No flow given.
            </p>
        )
    }

    function handleError() {

    }

    return (
        <ErrorBoundary fallback={<DefaultLoader/>} onError={handleError}>
            <Center fillPage vertical>
                <Container maxWidth={"xs"}>
                    <Paper square align={"center"}>
                        <Consent flowId={params.flow}/>
                    </Paper>
                </Container>
            </Center>
        </ErrorBoundary>
    )
}