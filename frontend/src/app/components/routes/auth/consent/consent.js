import React, {useState} from "react";
import clsx from "clsx";

import {
    Avatar,
    Button,
    Container,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {useAuth, useDataLoader} from "../../../../hooks/kratos";

import ErrorPage from "../../../common/errorPage/errorPage";
import DefaultLoader from "../../../common/defaultLoader/defaultLoader";
import ErrorBoundary from "../../../common/errorBoundary/errorBoundary";
import Center from "../../../common/center/center";

import style from "../auth.module.scss";


export default function Consent() {

    const {data, error, isLoading} = useDataLoader(() => {
        return fetch("/oauth/consentInfo").then(res => {
            if ( !res.ok ) {
                return res.json().then(json => {
                    throw new Error(json.error);
                })
            }
            return res.json()
        });
    });

    if (isLoading) {
        return <DefaultLoader/>
    }

    if ( error != null ) {
        return (
            <ErrorPage title={"Error"} subTitle={error.message}/>
        )
    }

    function handleError(err) {

    }

    return (
        <ErrorBoundary fallback={<DefaultLoader/>} onError={handleError}>
            <Center fillPage vertical>
                <Container maxWidth={"sm"}>
                    <Paper square className={style.paper}>
                        <ConsentForm data={data}/>
                    </Paper>
                </Container>
            </Center>
        </ErrorBoundary>
    )
}

function ConsentForm({data}) {
    const client = data.client

    const {user, isLoading} = useAuth();

    const [busy, setBusy] = useState(false);

    if (isLoading) {
        return <DefaultLoader/>
    }

    function post(body) {
        if (busy) {
            return;
        }
        setBusy(true);

        fetch("/oauth/consent", {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(res => {
            window.location.href = res.redirect_to;
        }).catch(err => {
            setBusy(false);
        });
    }

    function reject() {
        post({
            consent: false
        });
    }

    function allow() {
        post({
            grant_scope: data.requested_scope,
            consent: true
        });
    }

    return (
        <div className={clsx(busy && style.busy)}>
            {busy && (
                <>
                    <div className={style.busyOverlay}>&nbsp;</div>
                    <div className={style.busyProgress}><LinearProgress/></div>
                </>
            )}

            <div align={"center"}>
                <Stack direction={"row"} justifyContent={"center"} spacing={-1}>
                    <ClientAvatar client={client} width={56} height={56}/>
                    <Avatar sx={{width: 56, height: 56}}>OR</Avatar>
                </Stack>
                <br/>

                <Typography>
                    {user.traits.email}
                </Typography>
                <br/>

                <Typography variant="h5" component={"h1"}>{client.client_name} is asking permission for:</Typography>
            </div>
            <br/>

            <Container maxWidth={"xs"}>
                <List>
                    {data.requested_scope.map((item, i) => {
                        return (
                            <ListItem key={i}>
                                <ListItemIcon>
                                    <i className="far fa-dot-circle"/>
                                </ListItemIcon>
                                <ListItemText primary={item}/>
                            </ListItem>
                        )
                    })}
                </List>
                <br/>

                <div className={style.alignLeft}>
                    <Typography component={"h2"}>
                        <strong>
                            Make sure you trust {client.client_name}
                        </strong>
                    </Typography>
                    <Typography>
                        You may be sharing sensitive info with this site or app.
                    </Typography>
                </div>
                <br/><br/>

                <Stack direction={"row"} justifyContent={"end"} spacing={2}>
                    <Button variant={"text"} color={"primary"} onClick={reject}>
                        Cancel
                    </Button>
                    <Button variant={"contained"} color={"primary"}
                            disableElevation={true} onClick={allow}>
                        Allow
                    </Button>
                </Stack>
            </Container>

        </div>
    )
}

function ClientAvatar({client, width, height}) {
    const sx = {width, height}

    if (client.logo_uri) {
        return <Avatar sx={sx} img={client.logo_uri}/>
    }

    return (
        <Avatar sx={{bgcolor: "#123456", ...sx}}>
            {client.client_name.split(" ").map(s => s.substr(0, 1).toUpperCase()).join("")}
        </Avatar>
    )
}