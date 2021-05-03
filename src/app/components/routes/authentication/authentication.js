import React from 'react'
import {Redirect, Route, Switch, useLocation, useRouteMatch} from "react-router-dom";
import queryString from "query-string";

import {Container, Paper} from "@material-ui/core";

import ErrorBoundary from "../../common/errorBoundary/errorBoundary";
import DefaultLoader from "../../common/defaultLoader/defaultLoader";
import Center from "../../common/center/center";

import Login from "./login/login";
import Register from "./register/register";

export default function Authentication() {
    const {url} = useRouteMatch();

    return (
        <Switch>
            <Route exact path={url + "/login"}>
                <WrappedAuthRoute initUrl={"/self-service/login/browser"} component={Login}/>
            </Route>

            <Route exact path={url + "/register"}>
                <WrappedAuthRoute initUrl={"/self-service/registration/browser"} component={Register}/>
            </Route>

            <Redirect to={url + "/login"}/>
        </Switch>
    )
}

function WrappedAuthRoute({initUrl, component}) {
    const location = useLocation();
    const params = queryString.parse(location.search);

    // initialize login flow
    if (!params.flow) {
        window.location.href = initUrl;
        return null;
    }

    function handleError() {
        window.location.href = initUrl;
    }

    const Comp = component;
    return (
        <ErrorBoundary fallback={<DefaultLoader/>} onError={handleError}>
            <Center fillPage vertical>
                <Container maxWidth={"xs"}>
                    <Paper square align={"center"}>
                        <Comp flowId={params.flow}/>
                    </Paper>
                </Container>
            </Center>
        </ErrorBoundary>
    )
}