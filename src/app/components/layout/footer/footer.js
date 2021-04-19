import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

import style from "./footer.scss";

export default function Footer() {


    return (
        <>
            <div className={style.footerFill}/>
            <footer className={style.footer}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="textSecondary" align="center">
                        Copyright &copy;&nbsp;
                        {new Date().getFullYear()}&nbsp;
                        Poggers
                    </Typography>
                </Container>
            </footer>
        </>
    )
}