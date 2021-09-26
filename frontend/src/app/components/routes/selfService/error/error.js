import React from "react";
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import {useSelfServiceError} from "../../../../hooks/kratos";
import DefaultLoader from "../../../common/defaultLoader/defaultLoader";
import ErrorPage from "../../../common/errorPage/errorPage";

export default function Error() {

    const location = useLocation();
    const params = queryString.parse(location.search);

    const {errorInfo, isLoading} = useSelfServiceError(params.error);
    if (isLoading) {
        return <DefaultLoader/>
    }

    const error = errorInfo.errors[0];

    return (
        <ErrorPage title={error.code} subTitle={error.message} description={error.reason}/>
    )
}