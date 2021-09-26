import React, {useEffect, useState} from "react";

import {CssBaseline, Container, Toolbar, useMediaQuery, useTheme} from "@mui/material";

import Header from "../header/header";
import Footer from "../footer/footer";
import Drawer from "../drawer/drawer";

import style from "./layout.module.scss";

function Layout({children}) {

    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up('md'));

    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (desktop) {
            setDrawerOpen(false);
        }
    }, [desktop]);

    return (
        <>
            <CssBaseline/>
            <div className={style.root}>
                <Header onDrawerToggle={() => setDrawerOpen(!drawerOpen)}/>
                <Toolbar/>

                <div className={style.content}>
                    <Drawer open={desktop || drawerOpen}
                            onOpen={() => setDrawerOpen(true)}
                            onClose={() => setDrawerOpen(false)}/>

                    <main className={style.body}>
                        <div className={style.mainContent}>
                            <Container maxWidth="lg">
                                {children}
                            </Container>
                        </div>

                        <Footer/>
                    </main>
                </div>
            </div>
        </>
    );
}

export default Layout;