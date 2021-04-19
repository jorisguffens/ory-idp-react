import React, {useState} from "react";

import {Button, CircularProgress, Container, Paper, TextField, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

import Center from "../../common/center/center";
import {useHistory} from "react-router";
import {useRegisterFlow} from "../../../hooks/kratos";

export default function LoginForm({flowId}) {

    const history = useHistory();

    // flow information state
    const {data: flow, refresh} = useRegisterFlow(flowId);

    console.log(flow);

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
        //     history.push("/profile");
        // }).catch(err => {
        //     setErrors(err.message);
        //     setBusy(false);
        // });

        return false;
    }

    return (
        <Center vertical fillPage>
            <Container maxWidth="xs">
                <Paper square align={"center"}>
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