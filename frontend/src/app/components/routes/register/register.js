import React, {Suspense} from 'react'
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import {CircularProgress, Container, Paper} from '@material-ui/core'

import ErrorBoundary from "../../common/errorBoundary/errorBoundary";
import Center from "../../common/center/center";
import RegisterForm from "./registerForm";

export default function Register() {

    const location = useLocation();
    const params = queryString.parse(location.search);

    function initFlow() {
        window.location.href = "/self-service/registration/browser";
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
                            <RegisterForm flowId={params.flow}/>
                        </Suspense>
                    </ErrorBoundary>
                </Paper>
            </Container>
        </Center>
    )
}