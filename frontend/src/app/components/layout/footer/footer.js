import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

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