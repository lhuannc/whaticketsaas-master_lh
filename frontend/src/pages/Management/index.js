import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography } from "@material-ui/core";
import ContactlessOutlinedIcon from "@material-ui/icons/ContactlessOutlined";
import ExploreOutlinedIcon from "@material-ui/icons/ExploreOutlined";
import OfflineBoltOutlinedIcon from "@material-ui/icons/OfflineBoltOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import WrapTextOutlinedIcon from "@material-ui/icons/WrapTextOutlined";
import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { AuthContext } from "../../context/Auth/AuthContext";
import "../../styles/wpls-theme.css";

const useStyles = makeStyles((theme) => ({
  mainPaper: { flex: 1, padding: theme.spacing(2), overflowY: "auto", ...theme.scrollbarStyles },
  card: {
    padding: theme.spacing(3),
    borderRadius: 14,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    transition: "all .15s",
    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,.12)", transform: "translateY(-2px)" }
  },
  icon: { fontSize: 36, color: "#42b9eb" },
  label: { fontWeight: 600, fontSize: 14, textAlign: "center" },
  desc: { fontSize: 12, color: "#888", textAlign: "center" }
}));

const Management = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const sections = [
    { label: "Canais (IG/LinkedIn)", desc: "Conectar redes sociais", to: "/channels", icon: <ExploreOutlinedIcon className={classes.icon} /> },
    { label: "Conexões WhatsApp", desc: "Instâncias + QR Code", to: "/connections", icon: <ContactlessOutlinedIcon className={classes.icon} /> },
    { label: "IA (Persona/RAG)", desc: "Tom, persona, base conhecimento", to: "/ia-config", icon: <OfflineBoltOutlinedIcon className={classes.icon} /> },
    { label: "Fluxos / URA", desc: "Editor de fluxos", to: "/flows", icon: <AccountTreeOutlinedIcon className={classes.icon} /> },
    { label: "Equipe", desc: "Operadores e papéis", to: "/users", icon: <PeopleAltOutlinedIcon className={classes.icon} /> },
    { label: "Filas", desc: "Roteamento de atendimento", to: "/queues", icon: <WrapTextOutlinedIcon className={classes.icon} /> },
    { label: "Financeiro", desc: "Plano e faturas", to: "/financeiro", icon: <MonetizationOnOutlinedIcon className={classes.icon} /> },
    { label: "Configurações", desc: "Horários, saudações", to: "/settings", icon: <SettingsOutlinedIcon className={classes.icon} /> }
  ];

  if (user?.super) {
    sections.push({ label: "Super Admin", desc: "Gerenciar tenants", to: "/super-admin", icon: <SupervisorAccountIcon className={classes.icon} /> });
  }

  return (
    <MainContainer>
      <MainHeader>
        <Title>Gestão</Title>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Grid container spacing={2}>
          {sections.map((s) => (
            <Grid item xs={6} sm={4} md={3} key={s.to}>
              <Paper className={classes.card} variant="outlined" onClick={() => history.push(s.to)}>
                {s.icon}
                <Typography className={classes.label}>{s.label}</Typography>
                <Typography className={classes.desc}>{s.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </MainContainer>
  );
};

export default Management;
