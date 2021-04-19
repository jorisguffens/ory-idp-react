import {createMuiTheme} from "@material-ui/core";

export default createMuiTheme({
    palette: {
        primary: {
            main: "#B38724",
        },
        secondary: {
            main: "#FFD166",
            dark: "#c8a451"
        },
    },
    overrides: {
        MuiPaper: {
            elevation1: {
                padding: "60px 25px"
            }
        },
        MuiTypography: {
            h1: {
                fontSize: "3rem",
                fontWeight: "400"
            },
            h2: {
                fontSize: "2.6rem",
                fontWeight: "400"
            },
            h3: {
                fontSize: "2.2rem",
                fontWeight: "400"
            },
            h4: {
                fontSize: "1.8rem",
                fontWeight: "400"
            },
            h5: {
                fontSize: "1.4rem",
                fontWeight: "400"
            }
        }
    }
});