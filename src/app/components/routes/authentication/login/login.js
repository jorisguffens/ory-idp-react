import React, {useEffect, useState} from "react";

import {Button, CircularProgress, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

import {parseMethods, submitForm, useDataLoader, useKratos} from "../../../../hooks/kratos";
import DefaultLoader from "../../../common/defaultLoader/defaultLoader";
import TraitFields from "../../../common/traitFields/traitFields";

export default function Login({flowId}) {

    const kratos = useKratos();
    const {data, error, isLoading} = useDataLoader(() => {
        return kratos.getSelfServiceLoginFlow(flowId).then(({data}) => data);
    });

    if (error) {
        throw error;
    }

    if (isLoading) {
        return <DefaultLoader/>
    }

    return <LoginForm flowInfo={data}/>
}

function LoginForm({flowInfo}) {

    const kratos = useKratos();
    const [flow, setFlow] = useState(flowInfo);

    // fields state
    const [traits, setTraits] = useState([]);

    // handling
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState("");

    // calculate everything from state
    const {passwordMethodConfig, passwordMethodFields, socialMethods} = parseMethods(flow);
    useEffect(() => {
        setTraits(passwordMethodFields);
    }, []);

    function submit(event) {
        event.preventDefault();
        setBusy(true);

        submitForm(passwordMethodConfig.action, passwordMethodConfig.method, traits).then(success => {
            if ( success ) {
                return;
            }

            kratos.getSelfServiceLoginFlow(flow.id).then(({data}) => {
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
            <Typography variant="h2" component={"h1"}>Login</Typography>
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

            <form onSubmit={submit}>
                <TraitFields traits={traits} onChange={(value) => setTraits(value)}/>

                <Button color={"secondary"} variant={"contained"} type={"submit"} disabled={busy}>
                    {busy ? <CircularProgress size={20}/> : "Login"}
                </Button>
            </form>
            <br/><br/>

            <a href="/self-service/registration/browser">
                I don't have an account yet.
            </a>
        </>
    )
}