import React, { useContext, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Paper, Avatar, Button, Select, MenuItem, Grid, Typography } from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { AuthContext } from "../../context/Auth/AuthContext";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { socketConnection } from "../../services/socket";
import "../../styles/wpls-theme.css";

const useStyles = makeStyles((theme) => ({
  mainPaper: { flex: 1, padding: theme.spacing(3), overflowY: "auto", ...theme.scrollbarStyles, maxWidth: 600 },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: theme.spacing(3) },
  avatar: { width: 64, height: 64, fontSize: 28 },
  name: { fontWeight: 700, fontSize: 18 },
  email: { color: "#888", fontSize: 13 },
  statCard: { padding: theme.spacing(2), borderRadius: 12, textAlign: "center" },
  statVal: { fontSize: 24, fontWeight: 700, color: "#42b9eb" },
  statLabel: { fontSize: 12, color: "#888" },
  row: { marginTop: theme.spacing(3), display: "flex", alignItems: "center", gap: 12 }
}));

const Profile = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user, handleLogout } = useContext(AuthContext);
  const [presence, setPresence] = useState("online");
  const [stats, setStats] = useState({ open: 0, closed: 0 });

  const fetchStats = useCallback(async () => {
    try {
      // Dashboard fornece contagens; fallback silencioso se indisponível
      const { data } = await api.get("/dashboard");
      setStats({
        open: data?.counters?.supportHappening ?? data?.counters?.open ?? 0,
        closed: data?.counters?.supportFinished ?? data?.counters?.closed ?? 0
      });
    } catch {
      // ignore — stats opcionais
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const changePresence = (value) => {
    setPresence(value);
    try {
      const companyId = localStorage.getItem("companyId");
      const socket = socketConnection({ companyId });
      socket.emit("operatorPresence", { userId: user?.id, presence: value });
    } catch (err) {
      toastError(err);
    }
  };

  const doLogout = () => {
    if (handleLogout) handleLogout();
    else history.push("/login");
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>Meu Perfil</Title>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <div className={classes.header}>
          <Avatar className={classes.avatar}>{(user?.name || "?").charAt(0).toUpperCase()}</Avatar>
          <div>
            <div className={classes.name}>{user?.name}</div>
            <div className={classes.email}>{user?.email}</div>
            <div className={classes.email}>Perfil: {user?.profile}</div>
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper className={classes.statCard} variant="outlined">
              <div className={classes.statVal}>{stats.open}</div>
              <div className={classes.statLabel}>Em atendimento</div>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.statCard} variant="outlined">
              <div className={classes.statVal}>{stats.closed}</div>
              <div className={classes.statLabel}>Resolvidos</div>
            </Paper>
          </Grid>
        </Grid>

        <div className={classes.row}>
          <Typography>Disponibilidade:</Typography>
          <Select value={presence} onChange={(e) => changePresence(e.target.value)}>
            <MenuItem value="online">🟢 Online</MenuItem>
            <MenuItem value="away">🟡 Ausente</MenuItem>
            <MenuItem value="offline">⚫ Offline</MenuItem>
          </Select>
        </div>

        <div className={classes.row}>
          <Button variant="outlined" onClick={() => history.push("/management")}>Ir para Gestão</Button>
          <Button variant="outlined" style={{ color: "#ef4444" }} onClick={doLogout}>Sair</Button>
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Profile;
