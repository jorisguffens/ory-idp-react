import React from "react";
import clsx from "clsx";
import {Link as RouterLink} from "react-router-dom";

import {
    Avatar,
    Divider,
    Drawer as MuiDrawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    SwipeableDrawer, Typography
} from "@material-ui/core";

import {useAuth} from "../../../hooks/kratos";

import style from "./drawer.module.scss";

export default function Drawer({open, onClose, onOpen}) {

    const { user, isAuthenticated } = useAuth();

    const contents = (
        <>

            { isAuthenticated ? (
                <div className={style.avatar}>
                    <Avatar/>
                    <Typography className={style.avatarName}>
                        { user.traits.name.first } { user.traits.name.last }
                    </Typography>
                </div>
            ) : null }

            <List>
                <Divider/>
                <br/>

                <RouterLink to={"/profile"}>
                    <ListItem button>
                        <ListItemIcon>
                            <i className="fas fa-user"/>
                        </ListItemIcon>
                        <ListItemText primary="Your profile"/>
                    </ListItem>
                </RouterLink>
                <RouterLink to={"/security-settings"}>
                    <ListItem button>
                        <ListItemIcon>
                            <i className="fas fa-lock"/>
                        </ListItemIcon>
                        <ListItemText primary="Security settings"/>
                    </ListItem>
                </RouterLink>

                <br/>
                <Divider/>
                <br/>

                <a href={"/.ory/kratos/self-service/browser/flows/logout"}>
                    <ListItem button>
                        <ListItemIcon>
                            <i className="fas fa-sign-out-alt"/>
                        </ListItemIcon>
                        <ListItemText primary="Logout"/>
                    </ListItem>
                </a>
            </List>
        </>
    );

    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
        <>
            <Hidden smDown>
                <MuiDrawer variant="permanent" open className={clsx(style.root, style.desktop)}
                           classes={{paper: style.paper}}>
                    {contents}
                </MuiDrawer>
            </Hidden>
            <Hidden mdUp>
                <SwipeableDrawer variant="temporary" open={open} onClose={onClose} onOpen={onOpen}
                                 disableDiscovery={iOS} className={style.root} anchor="left"
                                 classes={{paper: style.paper}}
                                 ModalProps={{
                                     keepMounted: true, // Better open performance on mobile.
                                 }}>
                    {contents}
                </SwipeableDrawer>
            </Hidden>
        </>
    )
}