import React from 'react';
import {BrowserRouter} from "react-router-dom";
import {StylesProvider, ThemeProvider} from '@material-ui/core/styles';

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
            <ThemeProvider theme={theme}>
                <StylesProvider injectFirst>
                    <App />
                </StylesProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
