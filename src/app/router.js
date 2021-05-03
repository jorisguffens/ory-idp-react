import React from "react";
import {Route, Switch, useLocation} from "react-router-dom";

import Error from "./components/routes/self-service/error/error";
import SelfService from "./components/routes/self-service/self-service";
import Authentication from "./components/routes/authentication/authentication";

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

                <Route path={"/"} component={SelfService}/>
            </Switch>
        </>
    )
}
