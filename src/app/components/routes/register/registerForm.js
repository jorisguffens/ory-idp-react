import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";

import {Button, CircularProgress, TextField, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

import {useRegisterFlow} from "../../../hooks/kratos";

import TraitFields from "../../common/traitFields/traitFields";

export default function RegisterForm({flowId}) {

    const history = useHistory();

    // flow information state
    const {data: flow, refresh } = useRegisterFlow(flowId);

    // fields state
    const [traits, setTraits] = useState([]);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    // handling state
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState(null)

    // get register methods
    const passwordMethodConfig = flow.methods.password.config;
    const passwordMethodField = passwordMethodConfig.fields.filter(field => field.name === "password")[0];

    const socialMethods = [];
    for (let method of Object.keys(flow.methods)) {
        if (method.method === "oidc") {
            socialMethods.push(method);
        }
    }

    // create trait fields for password method
    useEffect(() => {
        const fields = passwordMethodConfig.fields;
        setTraits(fields.filter((trait) => trait.name.substr(0, 6) === "traits"));
    }, []);

    function submit(event) {
        event.preventDefault();
        setBusy(true);

        const formData = new FormData();
        formData.set("csrf_token", passwordMethodConfig.fields[0].value);
        formData.set("password", password);
        console.log(password);

        for (let trait of traits) {
            formData.set(trait.name, trait.value);
        }

        const body = [...formData.entries()]
            .map(e => encodeURIComponent(e[0]) + "=" + encodeURIComponent(e[1]))
            .join("&");

        fetch(passwordMethodConfig.action, {
            method: passwordMethodConfig.method,
            credentials: "include",
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            if (res.redirected) {
                const prefix = window.location.protocol + "//" + window.location.hostname;
                if (res.url.startsWith(prefix)) {
                    history.push(res.url.substr(prefix.length));
                } else {
                    //window.location.href = res.url;
                }
            }
            refresh();
        }).catch(err => {
            setErrors(err.message);
        }).finally(() => {
            setBusy(false);
        })

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

                <TextField type="password" label="Password" variant="outlined" fullWidth
                           value={password}
                           error={!!passwordMethodField.messages}
                           helperText={!!passwordMethodField.messages ? passwordMethodField.messages[0].text : ""}
                           onChange={(e) => setPassword(e.target.value)}/>
                <br/><br/>

                <TextField type="password" label="Repeat password" variant="outlined" fullWidth
                           value={repeatPassword}
                           onChange={(e) => setRepeatPassword(e.target.value)}/>
                <br/><br/>

                <Button color="secondary" variant="contained" type="submit"
                        disabled={busy || password === "" || password !== repeatPassword}>
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