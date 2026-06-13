import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Select, MenuItem, TextField, Button } from "@material-ui/core";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import "../../styles/wpls-theme.css";

const useStyles = makeStyles((theme) => ({
  panel: { padding: theme.spacing(2), margin: theme.spacing(1), borderRadius: 10 },
  title: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  row: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  label: { fontSize: 12, color: "#888", minWidth: 70 }
}));

const STAGES = [
  { v: "novo", l: "Novo" },
  { v: "qualificado", l: "Qualificado" },
  { v: "proposta", l: "Proposta" },
  { v: "negociacao", l: "Negociação" },
  { v: "ganho", l: "Ganho" }
];

// Painel CRM no ContactDrawer (ADR-007 T-007.5): estágio do funil + valor do negócio.
const CrmPanel = ({ ticket }) => {
  const classes = useStyles();
  const [stage, setStage] = useState("novo");
  const [deal, setDeal] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (ticket) {
      setStage(ticket.funnelStage || "novo");
      setDeal(ticket.dealValue != null ? String(ticket.dealValue) : "");
      setDirty(false);
    }
  }, [ticket]);

  if (!ticket || !ticket.id) return null;

  const changeStage = async (value) => {
    setStage(value);
    try {
      await api.patch(`/tickets/${ticket.id}/funnel`, { funnelStage: value });
      toast.success("Estágio atualizado.");
    } catch (err) {
      toastError(err);
    }
  };

  const saveDeal = async () => {
    try {
      await api.patch(`/tickets/${ticket.id}/funnel`, { dealValue: deal === "" ? null : parseFloat(deal) });
      toast.success("Valor salvo.");
      setDirty(false);
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Paper square variant="outlined" className={classes.panel}>
      <div className={classes.title}>
        <span className={`wpls-stage-dot ${stage}`} />
        <Typography variant="subtitle1">CRM / Funil</Typography>
      </div>

      <div className={classes.row}>
        <span className={classes.label}>Estágio</span>
        <Select value={stage} onChange={(e) => changeStage(e.target.value)} style={{ flex: 1 }}>
          {STAGES.map((s) => <MenuItem key={s.v} value={s.v}>{s.l}</MenuItem>)}
        </Select>
      </div>

      <div className={classes.row}>
        <span className={classes.label}>Valor R$</span>
        <TextField
          type="number"
          size="small"
          variant="outlined"
          value={deal}
          onChange={(e) => { setDeal(e.target.value); setDirty(true); }}
          style={{ flex: 1 }}
        />
        {dirty && <Button size="small" color="primary" onClick={saveDeal}>Salvar</Button>}
      </div>
    </Paper>
  );
};

export default CrmPanel;
