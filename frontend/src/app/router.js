import React from "react";
import {Route, Switch, useLocation} from "react-router-dom";

import Login from "./components/routes/login/login";
import Register from "./components/routes/register/register";

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
                <Route exact path={"/auth/login"} component={Login}/>
                <Route exact path={"/auth/register"} component={Register}/>

                <p>404</p>
            </Switch>
        </>
    )
}
