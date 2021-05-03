import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import {CircularProgress} from "@material-ui/core";

import {useAuth} from "../../../hooks/kratos";
import Center from "../../common/center/center";

import Profile from "./profile/profile";


export default function SelfService() {

    const { isAuthenticated, isLoading } = useAuth();
    console.log(isLoading);
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

    return (
        <Switch>
            <Route exact path={"/"}>
                <Redirect to={"/profile"}/>
            </Route>

            <Route exact path={"/profile"} component={Profile}/>

            <p>404</p>
        </Switch>
    )
}