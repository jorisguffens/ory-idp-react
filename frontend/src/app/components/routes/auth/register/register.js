import React, {useState} from "react";
import {Link} from "react-router-dom";

import {Typography, Alert} from "@mui/material";

import {submitForm, useKratos} from "../../../../hooks/kratos";

import PasswordForm from "../../../common/passwordForm/passwordForm";

export default function Register({ flowInfo }) {

    const kratos = useKratos();

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

        submitForm(config.action, config.method, nodes, flow.return_to).then(success => {
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