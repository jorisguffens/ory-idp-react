import React from "react";

import {AppBar, Hidden, IconButton, Link, Toolbar} from "@material-ui/core";

import style from "./header.scss";

export default function Header({ onDrawerToggle }) {

    return (
        <AppBar position="fixed" className={style.root}>
            <Toolbar>
                <div className={style.contents}>
                    <div className={style.title}>
                        <Link>
                            Pogboer
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