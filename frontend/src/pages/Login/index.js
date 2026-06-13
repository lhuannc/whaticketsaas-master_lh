import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    Container,
    InputAdornment,
    IconButton,
    Link
} from '@material-ui/core';

import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import { i18n } from "../../translate/i18n";

import { AuthContext } from "../../context/Auth/AuthContext";
import chatImage from "../../assets/logologin.png";
//import WhatsAppIcon from "@material-ui/icons/whatsapp";
import logo from "../../assets/logologin.png";
import { systemVersion } from "../../../package.json";
//import { system } from "../../config.json";


const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "stretch",
    background: theme.palette.type === "light"
      ? "linear-gradient(135deg, #2a688f 0%, #42b9eb 100%)"
      : "#0a1018"
  },
  hero: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(8),
    color: "#fff",
    [theme.breakpoints.down("sm")]: { display: "none" }
  },
  heroTitle: { fontSize: 40, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 },
  heroSub: { fontSize: 16, opacity: 0.9, maxWidth: 420 },
  loginSide: {
    width: 460,
    maxWidth: "100%",
    background: theme.palette.background.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
    [theme.breakpoints.down("sm")]: { width: "100%" }
  },
  paper: {
    width: "100%",
    maxWidth: 340,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  whatsapp: {
    backgroundColor: '#32d951'
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  containerWrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: theme.spacing(4),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  mobileContainer: {
    flex: 1,
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh'
  },
  hideOnMobile: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));




const Login = () => {
  const classes = useStyles();

  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleLogin(user);
  };

  return (
    //<div style={{ display: 'flex', 
      //flexDirection: 'column', 
      //minHeight: '100vh', 
      // backgroundImage: `url(${loginBackground})`,
      //backgroundSize: 'cover',
      //backgroundRepeat: 'no-repeat',
      //backgroundPosition: 'center'
    //}}>
    <div className={classes.root}>
      <CssBaseline />
      <div className={classes.hero}>
        <div className={classes.heroTitle}>WPLS Omnichannel</div>
        <div className={classes.heroSub}>
          Atendimento unificado: WhatsApp, Instagram e LinkedIn em uma só caixa de entrada,
          com AI Copilot, funil CRM e automação de fluxos.
        </div>
      </div>
      <div className={classes.loginSide}>
        <div className={classes.paper}>
          <img src={chatImage} style={{ width: "70%", marginBottom: 16 }} alt={process.env.REACT_APP_TITLE} />
          <Typography component="h1" variant="h5" style={{ fontWeight: 700 }}>
            {i18n.t("login.title")}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={i18n.t("login.form.email")}
                  name="email"
                  value={user.email}
                  onChange={handleChangeInput}
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={i18n.t("login.form.password")}
                  id="password"
                  value={user.password}
                  onChange={handleChangeInput}
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((e) => !e)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  {i18n.t("login.buttons.submit")}
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link
                      variant="body2"
                      component={RouterLink}
                      to="/signup"
                    >
                      {i18n.t("login.buttons.register")}
                    </Link>
                  </Grid>
                </Grid>
              </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 
