import React, {useEffect, useState} from "react";

import {Button, CircularProgress, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

import {parseMethods, submitForm, useDataLoader, useKratos} from "../../../../hooks/kratos";

import TraitFields from "../../../common/traitFields/traitFields";
import DefaultLoader from "../../../common/defaultLoader/defaultLoader";

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
    const [flow, setFlow] = useState(flowInfo);

    // fields state
    const [traits, setTraits] = useState([]);

    // handling state
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState(null)

    // calculate everything from state
    const { passwordMethodConfig, passwordMethodFields, socialMethods } = parseMethods(flow);
    useEffect(() => {
        setTraits(passwordMethodFields.reverse());
    }, []);

    function submit(event) {
        event.preventDefault();
        setBusy(true);

        submitForm(passwordMethodConfig.action, passwordMethodConfig.method, traits).then(success => {
            if ( success ) {
                return;
            }

            kratos.getSelfServiceRegistrationFlow(flow.id).then(({data}) => {
                setFlow(data);
            });
            setBusy(false);
        }).catch(err => {
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

            {socialMethods.length > 0 ? (
                <>
                    <div align={"center"}>SOCIAL LOGIN HERE</div>
                    <hr/>
                </>
            ) : null}

            <form onSubmit={submit} >

                <TraitFields traits={traits} onChange={(value) => setTraits(value)}/>

                <Button color="secondary" variant="contained" type="submit" disabled={busy}>
                    {busy ? <CircularProgress size={24}/> : "Register"}
                </Button>
            </form>
            <br/><br/>

            <a href="/self-service/login/browser">
                I already have an account.
            </a>
        </>
    )
}