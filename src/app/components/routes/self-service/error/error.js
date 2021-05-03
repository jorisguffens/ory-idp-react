import React from "react";
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import {Container, Paper, Typography} from "@material-ui/core";

import {useSelfServiceError} from "../../../../hooks/kratos";

import Center from "../../../common/center/center";
import DefaultLoader from "../../../common/defaultLoader/defaultLoader";

export default function Error() {

    const location = useLocation();
    const params = queryString.parse(location.search);

    const {errorInfo, isLoading} = useSelfServiceError(params.error);
    if (isLoading) {
        return <DefaultLoader/>
    }

    const error = errorInfo.errors[0];

    return (
        <Center vertical fillPage>
            <Container maxWidth="sm">
                <Paper square align={"center"}>
                    <Typography variant="h3" component="h1">{error.code}</Typography>
                    <br/><br/>
                    <Typography variant="h5" component="h2">{error.message}</Typography>
                    <br/>
                    <Typography>{error.reason}</Typography>
                </Paper>
            </Container>
        </Center>
    )
}