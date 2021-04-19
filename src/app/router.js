import React from "react";
import {Route, Switch, useLocation, Redirect} from "react-router-dom";

import Login from "./components/routes/login/login";
import Register from "./components/routes/register/register";
import Error from "./components/routes/error/error";
import Profile from "./components/routes/profile/profile";

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
                <Route exact path={"/auth/login"} component={Login}/>
                <Route exact path={"/auth/register"} component={Register}/>

                {/* Redirect to profile */}
                <Route exact path={"/"}>
                    <Redirect to={"/profile"}/>
                </Route>

                <Route exact path={"/profile"} component={Profile}/>

                <p>404</p>
            </Switch>
        </>
    )
}
