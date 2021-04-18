import React, {useState, Suspense} from 'react'
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import {CircularProgress, Container, Paper, TextField, Typography, Button} from '@material-ui/core'
import {Alert} from '@material-ui/lab'

import {useRegisterFlow} from "../../../hooks/kratos";

import Center from "../../common/center/center";

import style from './register.scss'

export default function Register() {
    const location = useLocation();
    const params = queryString.parse(location.search);

    // initialize login flow
    if (!params.flow) {
        window.location.href = "/self-service/registration/browser";
        return null;
    }

    return (
        <Center vertical fillPage>
            <Container maxWidth="xs">
                <Paper square className={style.paper} align={"center"}>
                    <Suspense fallback={(
                        <>
                            <br/><br/>
                            <CircularProgress color={"primary"}/>
                            <br/><br/>
                        </>
                    )}>
                        <RegisterForm flowId={params.flow}/>
                    </Suspense>
                </Paper>
            </Container>
        </Center>
    )
}

function RegisterForm({flowId}) {

    const flow = useRegisterFlow(flowId);
    console.log(flow);

    // input
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // handling
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState(null)

    function submit(event) {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrors("Passwords do not match.");
            return false;
        }

        setBusy(true);
        // register(name, email, password).then(() => {
        //     history.push("/dashboard");
        // }).catch(err => {
        //     setErrors(err.message);
        //     setBusy(false);
        // });

        return false;
    }

    return (
        <>
            <Typography variant="h2" component={"h1"}>Register</Typography>
            <br/>

            {errors ? (
                <Alert severity="error" className={style.alert}>{errors.split("\n").map((line, i) => <span
                    key={i}>{line}<br/></span>)}</Alert>
            ) : null}

            <form onSubmit={submit}>
                <TextField value={name} label="Name" variant="outlined" autoFocus fullWidth
                           onChange={(e) => setName(e.target.value)}/>
                <br/><br/>

                <TextField value={email} label="Email" variant="outlined" fullWidth
                           onChange={(e) => setEmail(e.target.value)}/>
                <br/><br/>

                <TextField value={password} type="password" label="Password" variant="outlined" fullWidth
                           onChange={(e) => setPassword(e.target.value)}/>
                <br/><br/>

                <TextField value={confirmPassword} type="password" label="Confirm password" variant="outlined"
                           fullWidth
                           onChange={(e) => setConfirmPassword(e.target.value)}/>
                <br/><br/>

                <Button color={"secondary"} variant={"contained"} type={"submit"}
                        disabled={busy || name === "" || email === "" || password === "" || confirmPassword !== password}>
                    {busy ? <CircularProgress size={20}/> : "Register"}
                </Button>
            </form>
            <br/><br/>

            <a href="/self-service/login/browser">
                I already have an account.
            </a>
        </>
    )
}