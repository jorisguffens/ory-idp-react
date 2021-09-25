import React from "react";
import {Redirect, Route, Switch, useLocation} from "react-router-dom";

import {CircularProgress} from "@material-ui/core";

import {useAuth} from "./hooks/kratos";

import Error from "./components/routes/selfService/error/error";
import Authentication from "./components/routes/authentication/authentication";
import Profile from "./components/routes/selfService/profile/profile";
import Developer from "./components/routes/developer/developer";
import Center from "./components/common/center/center";
import Error404 from "./components/routes/error404/error404";
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

                {/* Authentication */}
                <Route path={"/auth"} component={Authentication}/>

                {/* Account settings */}
                <Route exact path={"/"}>
                    <Redirect to={"/profile"}/>
                </Route>

                <ProtectedRoute exact path={"/profile"} component={Profile}/>

                {/* Developer stuff */}
                <ProtectedRoute exact path={"/developer"} component={Developer}/>
                <ProtectedRoute exact path={"/developer/oauth2-apps"} component={OAuth2Apps}/>

                <Error404/>
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
