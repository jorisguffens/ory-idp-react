import React, {useState} from 'react'
import queryString from "query-string";
import {useLocation} from "react-router-dom";

import {Button, CircularProgress, Container, Paper, TextField, Typography} from '@material-ui/core'
import {Alert} from "@material-ui/lab";

import Center from "../../common/center/center";

import style from './login.scss'

export default function Login() {
    const location = useLocation();

    const params = queryString.parse(location.search);

    // initialize login flow
    if ( !params.flow ) {
        window.location.href = "/self-service/login/browser";
        return null;
    }

    return (
        <LoginForm flowId={params.flow}/>
    )
}

function LoginForm({ flowId }) {

    // input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // handling
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState("");

    function submit(event) {
        event.preventDefault();

        setBusy(true);
        // login(email, password).then(() => {
        //     history.push("/dashboard");
        // }).catch(err => {
        //     setErrors(err.message);
        //     setBusy(false);
        // });

        return false;
    }

    return (
        <Center vertical fillPage>
            <Container maxWidth="xs">
                <Paper square className={style.paper} align={"center"}>
                    <Typography variant="h2" component={"h1"}>Login</Typography>
                    <br/>

                    {errors ? (
                        <Alert severity="error" className={style.alert}>{errors.split("\n").map((line, i) => <span
                            key={i}>{line}<br/></span>)}</Alert>
                    ) : null}

                    <form onSubmit={submit}>
                        <TextField value={email} label="Email" variant="outlined" autoFocus fullWidth
                                   onChange={(e) => setEmail(e.target.value)}/>
                        <br/><br/>

                        <TextField value={password} type="password" label="Password" variant="outlined" fullWidth
                                   onChange={(e) => setPassword(e.target.value)}/>
                        <br/><br/>

                        <Button color={"secondary"} variant={"contained"} type={"submit"}
                                disabled={busy || email === "" || password === ""}>
                            {busy ? <CircularProgress size={20}/> : "Login"}
                        </Button>
                    </form>
                    <br/><br/>

                    <a href="/self-service/registration/browser">
                        I don't have an account yet.
                    </a>
                </Paper>
            </Container>
        </Center>
    )
}