import React, {useState, Suspense, useEffect} from 'react'
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import {CircularProgress, Container, Paper, TextField, Typography, Button} from '@material-ui/core'
import {Alert} from '@material-ui/lab'

import {useRegisterFlow} from "../../../hooks/kratos";

import ErrorBoundary from "../../common/errorBoundary/errorBoundary";
import Center from "../../common/center/center";

import style from './register.scss'

export default function Register() {

    const location = useLocation();
    const params = queryString.parse(location.search);

    function initFlow() {
        window.location.href = "/self-service/registration/browser";
    }

    // initialize login flow
    if (!params.flow) {
        initFlow();
        return null;
    }

    return (
        <Center vertical fillPage>
            <Container maxWidth="xs">
                <Paper square className={style.paper} align={"center"}>
                    <ErrorBoundary fallback={initFlow}>
                        <Suspense fallback={(
                            <>
                                <br/><br/>
                                <CircularProgress color={"primary"}/>
                                <br/><br/>
                            </>
                        )}>
                            <RegisterForm flowId={params.flow}/>
                        </Suspense>
                    </ErrorBoundary>
                </Paper>
            </Container>
        </Center>
    )
}

function RegisterForm({flowId}) {

    const [flow, unset] = useRegisterFlow(flowId);

    const passwordMethodConfig = flow.methods.password.config;
    const socialMethods = [];
    for (let method of Object.keys(flow.methods)) {
        if (method.method === "oidc") {
            socialMethods.push(method);
        }
    }

    // fields
    const [traits, setTraits] = useState([]);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    // handling
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState(null)

    useEffect(() => {
        const fields = passwordMethodConfig.fields;
        setTraits(fields.filter((trait) => trait.name.substr(0, 6) === "traits"));
    }, []);

    function submit(event) {
        event.preventDefault();
        setBusy(true);

        const formBody = new FormData();
        formBody.set("csrf_token", passwordMethodConfig.fields[0].value);
        formBody.set("password", password);

        for ( let trait of traits ) {
            formBody.set(trait.name, trait.value);
        }

        fetch(passwordMethodConfig.action, {
            method: passwordMethodConfig.method,
            credentials: "include",
            body: formBody
        }).then(res => {
            if ( res.redirected ) {
                //window.location.href = res.url;
            }
            console.log(res);
        }) .catch(err => {
            setErrors(err.message);
            setBusy(false);
        }).finally(() => {
            unset();
        })

        return false;
    }

    // render
    return (
        <>
            <Typography variant="h2" component={"h1"}>Register</Typography>
            <br/>

            {errors ? (
                <Alert severity="error" className={style.alert}>{errors.split("\n").map((line, i) => <span
                    key={i}>{line}<br/></span>)}</Alert>
            ) : null}

            {socialMethods.length > 0 ? (
                <>
                    <div align={"center"}>SOCIAL LOGIN HERE</div>
                    <hr/>
                </>
            ) : null}

            <form onSubmit={submit}>

                <TraitFields traits={traits} onChange={(value) => setTraits(value)}/>

                <TextField value={password} type="password" label="Password"
                           variant="outlined" fullWidth
                           onChange={(e) => setPassword(e.target.value)}/>
                <br/><br/>

                <TextField value={repeatPassword} type="password" label="Repeat password"
                           variant="outlined" fullWidth
                           onChange={(e) => setRepeatPassword(e.target.value)}/>
                <br/><br/>

                <Button color={"secondary"} variant={"contained"} type={"submit"}
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

function TraitFields({traits, onChange}) {

    function update(trait, value) {
        trait.value = value;
        onChange([...traits]);
    }

    function parseTraitName(trait) {
        let name = ""
        const parts = trait.name.split(".");
        for (let i = parts.length - 1; i > 0; i--) {
            name += parts[i] + " ";
        }
        return name.substr(0, 1).toUpperCase() + name.substr(1);
    }

    return (
        <>
            {traits.map((trait, i) => {
                const props = {
                    label: parseTraitName(trait),
                    value: trait.value ? trait.value : "",
                    type: trait.type
                };

                if ( i === 0 ) {
                    props.autoFocus = true;
                }

                return (
                    <React.Fragment key={i}>
                        <TextField variant="outlined" fullWidth
                                   onChange={(e) => update(trait, e.target.value)}
                                   {...props}
                        />
                        <br/><br/>
                    </React.Fragment>
                )
            })}
        </>
    )
}