import React from "react";
import {Link} from "react-router-dom";

import {AppBar, Hidden, IconButton, Toolbar} from "@mui/material";

import style from "./header.module.scss";

export default function Header({onDrawerToggle}) {

    return (
        <AppBar position="fixed" className={style.root}>
            <Toolbar>
                <div className={style.contents}>
                    <div className={style.title}>
                        <Link to={"/"}>
                            ORY React Stack
                        </Link>
                    </div>

                    <Hidden mdUp>
                        <div className={style.menu}>
                            <IconButton color="inherit" onClick={onDrawerToggle}>
                                <i className="fas fa-bars"/>
                            </IconButton>
                        </div>
                    </Hidden>
                </div>
            </Toolbar>
        </AppBar>
    );
}