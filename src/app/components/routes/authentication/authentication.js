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
                <WrappedAuthRoute initUrl={"/.ory/kratos/self-service/login/browser"} component={Login}/>
            </Route>

            <Route exact path={url + "/register"}>
                <WrappedAuthRoute initUrl={"/.ory/kratos/self-service/registration/browser"} component={Register}/>
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

        // just a reminder to use this app behind a proxy, even I fall for the same mistake everytime
        const val = sessionStorage.getItem("redirect_count");
        if ( val >= 5 ) {
            sessionStorage.setItem("redirect_count", "0");
            window.alert("Too many redirects, please use this app behind a proxy!");
            return null;
        } else {
            sessionStorage.setItem("redirect_count", (val ? parseInt(val) + 1 : 1) + "");
        }

        window.location.href = initUrl;
        return null;
    }

    function handleError() {
        //window.location.href = initUrl;
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