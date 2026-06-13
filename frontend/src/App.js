import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { ptBR } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
    const [locale, setLocale] = useState();

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const preferredTheme = window.localStorage.getItem("preferredTheme");
    const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = createTheme(
        {
            scrollbarStyles: {
                "&::-webkit-scrollbar": {
                    width: '8px',
                    height: '8px',
                },
                "&::-webkit-scrollbar-thumb": {
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                    backgroundColor: "#e8e8e8",
                },
            },
            scrollbarStylesSoft: {
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: mode === "light" ? "#F3F3F3" : "#333333",
                },
            },
            palette: {
                type: mode,
                primary: { main: "#2a688f", light: "#42b9eb", dark: "#1f4d6b" },
                secondary: { main: "#42b9eb" },
                textPrimary: mode === "light" ? "#2a688f" : "#FFFFFF",
                borderPrimary: mode === "light" ? "#2a688f" : "#FFFFFF",
                dark: { main: mode === "light" ? "#0f2533" : "#F3F3F3" },
                light: { main: mode === "light" ? "#F3F3F3" : "#333333" },
                tabHeaderBackground: mode === "light" ? "#EEE" : "#666",
                optionsBackground: mode === "light" ? "#f4f7fa" : "#172130",
                fancyBackground: mode === "light" ? "#f4f7fa" : "#111c29",
                total: mode === "light" ? "#fff" : "#0a1018",
                messageIcons: mode === "light" ? "grey" : "#F3F3F3",
                inputBackground: mode === "light" ? "#FFFFFF" : "#111c29",
                barraSuperior: mode === "light" ? "linear-gradient(135deg, #2a688f, #42b9eb)" : "#111c29"
            },
            typography: {
                fontFamily: "'Manrope', 'Segoe UI', system-ui, sans-serif",
                fontWeightMedium: 600,
                button: { textTransform: "none", fontWeight: 600 }
            },
            shape: {
                borderRadius: 12
            },
            overrides: {
                MuiButton: {
                    root: { borderRadius: 10 },
                    containedPrimary: {
                        background: "linear-gradient(135deg, #2a688f, #42b9eb)",
                        boxShadow: "0 2px 8px rgba(42,104,143,.25)"
                    }
                },
                MuiPaper: {
                    rounded: { borderRadius: 14 },
                    elevation1: { boxShadow: "0 1px 3px rgba(0,0,0,.08)" }
                },
                MuiChip: {
                    root: { borderRadius: 16, fontWeight: 600 }
                }
            },
            mode,
        },
        locale
    );

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng");
        const browserLocale =
            i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

        if (browserLocale === "ptBR") {
            setLocale(ptBR);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("preferredTheme", mode);
    }, [mode]);

    return (
        <ColorModeContext.Provider value={{ colorMode }}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <Routes />
                </QueryClientProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
