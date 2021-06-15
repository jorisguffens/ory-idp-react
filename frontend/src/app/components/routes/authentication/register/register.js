import React, {useEffect, useState} from "react";

import {Button, CircularProgress, Link, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

import {parseMethods, submitForm, useDataLoader, useKratos} from "../../../../hooks/kratos";

import PasswordForm from "../../../common/passwordForm/passwordForm";
import DefaultLoader from "../../../common/defaultLoader/defaultLoader";
import {useHistory} from "react-router";

export default function Register({ flowId }) {

    const kratos = useKratos();
    const { data, error, isLoading } = useDataLoader(() => {
        return kratos.getSelfServiceRegistrationFlow(flowId).then(({data}) => data);
    });

    if ( error ) {
        throw error;
    }

    if ( isLoading ) {
        return <DefaultLoader/>
    }

    return <RegisterForm flowInfo={data} />
}

function RegisterForm({ flowInfo }) {

    const kratos = useKratos();
    const history = useHistory();

    const [flow, setFlow] = useState(flowInfo);
    const config = flow.ui;

    // handling state
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState(null)

    function submit(nodes) {
        if ( busy ) {
            return;
        }
        setBusy(true);

        submitForm(config.action, config.method, nodes, history).then(success => {
            if ( success ) {
                return;
            }

            kratos.getSelfServiceRegistrationFlow(flow.id).then(({data}) => {
                setFlow(data);

                if ( data.ui.messages ) {
                    setErrors(data.ui.messages.map(msg => msg.text).join("\n"));
                }
            });
            setBusy(false);
        }).catch(err => {
            console.error(err);
            setErrors(err.message);
            setBusy(false);
        });

        return false;
    }

    return (
        <>
            <Typography variant="h2" component={"h1"}>Register</Typography>
            <br/>

            {errors ? (
                <>
                    <Alert severity="error">
                        {errors.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}
                    </Alert>
                    <br/><br/>
                </>
            ) : null}

            {/*{socialMethods.length > 0 ? (*/}
            {/*    <>*/}
            {/*        <div align={"center"}>SOCIAL LOGIN HERE</div>*/}
            {/*        <hr/>*/}
            {/*    </>*/}
            {/*) : null}*/}


            <PasswordForm config={config} onSubmit={submit}/>
            <br/><br/>

            <Link to={"/auth/login"}>
                I already have an account.
            </Link>
        </>
    )
}