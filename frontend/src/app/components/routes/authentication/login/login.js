import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";

import {Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

import {submitForm, useKratos} from "../../../../hooks/kratos";
import PasswordForm from "../../../common/passwordForm/passwordForm";

export default function Login({flowInfo}) {

    const kratos = useKratos();

    const [flow, setFlow] = useState(flowInfo);
    const config = flow.ui;

    // handling
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState("");

    function submit(nodes) {
        if ( busy ) {
            return;
        }

        setBusy(true);

        submitForm(config.action, config.method, nodes, flow.return_to).then(success => {
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