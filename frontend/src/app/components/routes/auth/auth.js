import React, {useEffect, useState} from 'react'
import {Redirect, Route, Switch, useLocation, useRouteMatch} from "react-router-dom";
import queryString from "query-string";

import {Container, Paper} from "@mui/material";

import {useKratos} from "../../../hooks/kratos";

import ErrorBoundary from "../../common/errorBoundary/errorBoundary";
import DefaultLoader from "../../common/defaultLoader/defaultLoader";
import Center from "../../common/center/center";

import Login from "./login/login";
import Register from "./register/register";
import Consent from "./consent/consent";

export default function Auth() {

    const kratos = useKratos();
    const {url} = useRouteMatch();

    function initLogin() {
        return kratos.initializeSelfServiceLoginViaBrowserFlow();
    }

    function fetchLogin(id) {
        return kratos.getSelfServiceLoginFlow(id);
    }

    function initRegister() {
        return kratos.initializeSelfServiceRegistrationViaBrowserFlow();
    }

    function fetchRegister(id) {
        return kratos.getSelfServiceRegistrationFlow(id);
    }

    return (
        <Switch>
            <Route exact path={url + "/login"}>
                <WrappedAuthRoute init={initLogin} fetch={fetchLogin} component={Login}/>
            </Route>

            <Route exact path={url + "/register"}>
                <WrappedAuthRoute init={initRegister} fetch={fetchRegister} component={Register}/>
            </Route>

            <Route exact path={url + "/consent"} component={Consent}/>

            <Redirect to={url + "/login"}/>
        </Switch>
    )
}

function WrappedAuthRoute({init, fetch, component}) {

    const location = useLocation();
    const params = queryString.parse(location.search);
    const [flow, setFlow] = useState(null);

    useEffect(() => {
        let unmounted = false;

        const func = params.flow ? () => fetch(params.flow) : init;
        func().then(res => {
            if (unmounted) return;
            setFlow(res.data);
            console.log(res.data);
        });

        return () => {
            unmounted = true;
        }
    }, []);

    function handleError() {
        //window.location.href = initUrl;
    }

    if ( flow == null ) {
        return <DefaultLoader/>
    }

    const Comp = component;
    return (
        <ErrorBoundary fallback={<DefaultLoader/>} onError={handleError}>
            <Center fillPage vertical>
                <Container maxWidth={"xs"}>
                    <Paper square align={"center"}>
                        <Comp flowInfo={flow}/>
                    </Paper>
                </Container>
            </Center>
        </ErrorBoundary>
    )
}