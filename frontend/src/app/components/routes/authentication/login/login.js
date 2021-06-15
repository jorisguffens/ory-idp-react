import React, {useState} from "react";
import {useHistory} from "react-router";

import {Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

import {submitForm, useDataLoader, useKratos} from "../../../../hooks/kratos";
import DefaultLoader from "../../../common/defaultLoader/defaultLoader";
import PasswordForm from "../../../common/passwordForm/passwordForm";
import {Link} from "react-router-dom";

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
    const config = flow.ui;

    const history = useHistory();

    // handling
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState("");

    function submit(nodes) {
        if ( busy ) {
            return;
        }

        setBusy(true);

        submitForm(config.action, config.method, nodes, history).then(success => {
            if (success) {
                return;
            }

            kratos.getSelfServiceLoginFlow(flow.id).then(({data}) => {
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
            <Typography variant="h2" component={"h1"}>Login</Typography>
            <br/>

            {errors && (
                <>
                    <Alert severity="error" align="left">
                        {errors.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}
                    </Alert>
                    <br/><br/>
                </>
            )}

            {/*{socialMethods.length > 0 && (*/}
            {/*    <>*/}
            {/*        <div align={"center"}>SOCIAL LOGIN HERE</div>*/}
            {/*        <hr/>*/}
            {/*    </>*/}
            {/*)}*/}

            <PasswordForm config={config} onSubmit={submit}/>
            <br/><br/>

            <Link to={"/auth/register"}>
                I don't have an account yet.
            </Link>
        </>
    )
}