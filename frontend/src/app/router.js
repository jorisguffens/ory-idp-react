import React from "react";
import {Redirect, Route, Switch, useLocation} from "react-router-dom";

import {CircularProgress} from "@mui/material";

import {useAuth} from "./hooks/kratos";

import ErrorPage from "./components/common/errorPage/errorPage";

import Error from "./components/routes/selfService/error/error";
import Auth from "./components/routes/auth/auth";
import Profile from "./components/routes/selfService/profile/profile";
import Developer from "./components/routes/developer/developer";
import Center from "./components/common/center/center";
import OAuth2Apps from "./components/routes/developer/oauth2-apps/oauth2-apps";

function ScrollToTop() {
    const { pathname } = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default function Router() {
    return (
        <>
            <ScrollToTop/>
            <Switch>
                {/* Errors */}
                <Route exact path={"/error"} component={Error}/>

                {/* Auth */}
                <Route path={"/auth"} component={Auth}/>

                {/* Account settings */}
                <Route exact path={"/"}>
                    <Redirect to={"/profile"}/>
                </Route>

                <ProtectedRoute exact path={"/profile"} component={Profile}/>

                {/* Developer stuff */}
                <ProtectedRoute exact path={"/developer"} component={Developer}/>
                <ProtectedRoute exact path={"/developer/oauth2-apps"} component={OAuth2Apps}/>

                <ErrorPage title={"404"} subTitle={"The page you are looking for does not exist."}/>
            </Switch>
        </>
    )
}

function ProtectedRoute(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if ( isLoading ) {
        return (
            <Center fillPage vertical horizontal>
                <CircularProgress/>
            </Center>
        );
    }

    if ( !isAuthenticated ) {
        return (
            <Redirect to={"/auth/login"}/>
        )
    }

    return <Route {...props}/>
}
