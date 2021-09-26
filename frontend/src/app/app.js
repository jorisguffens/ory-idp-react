import React from 'react';
import {BrowserRouter} from "react-router-dom";

import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';
import {CssBaseline} from "@mui/material";

import theme from "./theme";

import Router from "./router";

function App() {
    return (
        <div>
            <Router/>
        </div>
    )
}

export default function Wrapper() {
    return (
        <BrowserRouter>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <App/>
                </ThemeProvider>
            </StyledEngineProvider>
        </BrowserRouter>
    );
}
