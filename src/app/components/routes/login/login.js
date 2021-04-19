import React, {Suspense} from 'react'
import queryString from "query-string";
import {useLocation} from "react-router-dom";

import {CircularProgress, Container, Paper} from '@material-ui/core'

import Center from "../../common/center/center";
import ErrorBoundary from "../../common/errorBoundary/errorBoundary";
import LoginForm from "./loginForm";

export default function Login() {

    const location = useLocation();
    const params = queryString.parse(location.search);

    function initFlow() {
        window.location.href = "/self-service/login/browser";
    }

    // initialize login flow
    if (!params.flow) {
        initFlow();
        return null;
    }

    return (
        <Center vertical fillPage>
            <Container maxWidth="xs">
                <Paper square align={"center"}>
                    <ErrorBoundary fallback={initFlow}>
                        <Suspense fallback={(
                            <>
                                <br/><br/>
                                <CircularProgress color={"primary"}/>
                                <br/><br/>
                            </>
                        )}>
                            <LoginForm flowId={params.flow}/>
                        </Suspense>
                    </ErrorBoundary>
                </Paper>
            </Container>
        </Center>
    )
}