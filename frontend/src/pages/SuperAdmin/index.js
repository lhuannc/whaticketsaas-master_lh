import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  Grid,
  CircularProgress
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import "../../styles/wpls-theme.css";

const useStyles = makeStyles((theme) => ({
  mainPaper: { flex: 1, padding: theme.spacing(2), overflowY: "auto", ...theme.scrollbarStyles },
  metrics: { marginBottom: theme.spacing(2) },
  metricCard: { padding: theme.spacing(2), borderRadius: 12, textAlign: "center" },
  metricVal: { fontSize: 28, fontWeight: 700, color: "#42b9eb" },
  metricLabel: { fontSize: 12, color: "#888" },
  search: { marginBottom: theme.spacing(2) }
}));

const statusPill = (status) => {
  const map = {
    active: { cls: "ok", label: "Ativo" },
    trial: { cls: "warn", label: "Trial" },
    blocked: { cls: "bad", label: "Bloqueado" }
  };
  const cfg = map[status] || { cls: "warn", label: status };
  return <span className={`wpls-pill ${cfg.cls}`}>{cfg.label}</span>;
};

const SuperAdmin = () => {
  const classes = useStyles();
  const [metrics, setMetrics] = useState({});
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [m, c] = await Promise.all([
        api.get("/super-admin/metrics"),
        api.get("/super-admin/companies", { params: { searchParam: search } })
      ]);
      setMetrics(m.data);
      setCompanies(c.data.companies || []);
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchAll, 400);
    return () => clearTimeout(t);
  }, [fetchAll]);

  const setStatus = async (companyId, status) => {
    try {
      await api.patch(`/super-admin/companies/${companyId}/status`, { status });
      toast.success("Status atualizado.");
      fetchAll();
    } catch (err) {
      toastError(err);
    }
  };

  const impersonate = async (companyId) => {
    try {
      const { data } = await api.post(`/super-admin/companies/${companyId}/impersonate`);
      toast.info(`Token de impersonation gerado para ${data.user.name}.`);
      // Estratégia: abrir nova aba com token — implementação a critério do front
      console.log("Impersonation token:", data.token);
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>Super Admin — Tenants</Title>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Grid container spacing={2} className={classes.metrics}>
          {[
            { label: "Total", val: metrics.totalCompanies },
            { label: "Ativos", val: metrics.activeCompanies },
            { label: "Trial", val: metrics.trialCompanies },
            { label: "Bloqueados", val: metrics.blockedCompanies }
          ].map((m) => (
            <Grid item xs={6} sm={3} key={m.label}>
              <Paper className={classes.metricCard} variant="outlined">
                <div className={classes.metricVal}>{m.val ?? "-"}</div>
                <div className={classes.metricLabel}>{m.label}</div>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <TextField
          className={classes.search}
          label="Buscar empresa"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <CircularProgress size={24} />}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Empresa</TableCell>
              <TableCell>Plano</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.plan || "-"}</TableCell>
                <TableCell>{statusPill(c.status)}</TableCell>
                <TableCell>{c.dueDate ? new Date(c.dueDate).toLocaleDateString("pt-BR") : "-"}</TableCell>
                <TableCell align="right">
                  {c.status !== "blocked" ? (
                    <Button size="small" style={{ color: "#ef4444" }} onClick={() => setStatus(c.id, "blocked")}>Bloquear</Button>
                  ) : (
                    <Button size="small" style={{ color: "#16a34a" }} onClick={() => setStatus(c.id, "active")}>Ativar</Button>
                  )}
                  <Button size="small" color="primary" onClick={() => impersonate(c.id)}>Impersonar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default SuperAdmin;
