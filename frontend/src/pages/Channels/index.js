import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { Paper, Button, Grid, Typography } from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import "../../styles/wpls-theme.css";

const useStyles = makeStyles((theme) => ({
  mainPaper: { flex: 1, padding: theme.spacing(2), overflowY: "auto", ...theme.scrollbarStyles },
  card: { padding: theme.spacing(2), borderRadius: 12, display: "flex", flexDirection: "column", gap: 8, minHeight: 160 },
  cardTitle: { display: "flex", alignItems: "center", gap: 8, fontWeight: 700 },
  status: { fontSize: 13 },
  spacer: { flex: 1 }
}));

const getToken = () => {
  try { return JSON.parse(localStorage.getItem("token")); } catch { return localStorage.getItem("token"); }
};

const Channels = () => {
  const classes = useStyles();
  const [ig, setIg] = useState(null);
  const [li, setLi] = useState(null);

  const fetchAccounts = useCallback(async () => {
    try {
      const [igRes, liRes] = await Promise.all([
        api.get("/api/instagram/account"),
        api.get("/api/linkedin/account")
      ]);
      setIg(igRes.data);
      setLi(liRes.data);
    } catch (err) {
      toastError(err);
    }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  // Re-fetch ao voltar do popup OAuth
  useEffect(() => {
    const onFocus = () => fetchAccounts();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchAccounts]);

  const connect = (provider) => {
    const token = getToken();
    const base = process.env.REACT_APP_BACKEND_URL;
    window.open(`${base}/api/${provider}/auth?token=${token}`, "_blank", "width=600,height=700");
  };

  const disconnect = async (provider) => {
    try {
      await api.delete(`/api/${provider}/disconnect`);
      toast.success("Desconectado.");
      fetchAccounts();
    } catch (err) {
      toastError(err);
    }
  };

  const pill = (status) => {
    const cls = status === "connected" ? "ok" : status === "token_expired" ? "warn" : "bad";
    const label = status === "connected" ? "Conectado" : status === "token_expired" ? "Token expirado" : "Desconectado";
    return <span className={`wpls-pill ${cls}`}>{label}</span>;
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>Canais — Redes Sociais</Title>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card} variant="outlined">
              <div className={classes.cardTitle}>
                <span className="wpls-badge ig">Instagram</span>
              </div>
              {ig ? (
                <>
                  <div className={classes.status}>@{ig.igUsername}</div>
                  <div>{pill(ig.status)}</div>
                  {ig.tokenExpiresAt && (
                    <Typography variant="caption" color="textSecondary">
                      Expira: {new Date(ig.tokenExpiresAt).toLocaleDateString("pt-BR")}
                    </Typography>
                  )}
                  <div className={classes.spacer} />
                  <Button size="small" style={{ color: "#ef4444" }} onClick={() => disconnect("instagram")}>Desconectar</Button>
                </>
              ) : (
                <>
                  <div className={classes.status} style={{ color: "#888" }}>Não conectado</div>
                  <div className={classes.spacer} />
                  <Button size="small" variant="contained" color="primary" onClick={() => connect("instagram")}>Conectar Instagram</Button>
                </>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper className={classes.card} variant="outlined">
              <div className={classes.cardTitle}>
                <span className="wpls-badge li">LinkedIn</span>
              </div>
              {li ? (
                <>
                  <div className={classes.status}>{li.liOrganizationName}</div>
                  <div>{pill(li.status)}</div>
                  {li.lastPollAt && (
                    <Typography variant="caption" color="textSecondary">
                      Último poll: {new Date(li.lastPollAt).toLocaleString("pt-BR")}
                    </Typography>
                  )}
                  <div className={classes.spacer} />
                  <Button size="small" style={{ color: "#ef4444" }} onClick={() => disconnect("linkedin")}>Desconectar</Button>
                </>
              ) : (
                <>
                  <div className={classes.status} style={{ color: "#888" }}>Não conectado</div>
                  <div className={classes.spacer} />
                  <Button size="small" variant="contained" color="primary" onClick={() => connect("linkedin")}>Conectar LinkedIn</Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </MainContainer>
  );
};

export default Channels;
