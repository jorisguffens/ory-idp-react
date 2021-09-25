import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import style from "./footer.module.scss";

export default function Footer() {


    return (
        <footer className={style.footer}>
            <Container maxWidth="lg">
                <Typography variant="body2" color="textSecondary" align="center">
                    Copyright &copy;&nbsp;
                    {new Date().getFullYear()}&nbsp;
                    ORY Kratos React
                </Typography>
            </Container>
        </footer>
    )
}