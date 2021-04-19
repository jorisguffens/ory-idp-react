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
            root: {
                padding: "60px 25px"
            }
        },
    }
});