import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import FlowNodeEditor from "./FlowNodeEditor";

const useStyles = makeStyles((theme) => ({
  mainPaper: { flex: 1, padding: theme.spacing(1), overflowY: "auto", ...theme.scrollbarStyles }
}));

const TRIGGERS = [
  { v: "first_contact", l: "Primeiro contato" },
  { v: "keyword", l: "Palavra-chave" },
  { v: "out_of_hours", l: "Fora do horário" }
];
const CHANNELS = [
  { v: "all", l: "Todos" },
  { v: "whatsapp", l: "WhatsApp" },
  { v: "instagram", l: "Instagram" },
  { v: "linkedin", l: "LinkedIn" }
];

const Flows = () => {
  const classes = useStyles();
  const [flows, setFlows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", triggerType: "first_contact", triggerValue: "", channelType: "all" });
  const [editorFlow, setEditorFlow] = useState(null);

  const fetch = useCallback(async () => {
    try {
      const { data } = await api.get("/flows");
      setFlows(data);
    } catch (err) {
      toastError(err);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async () => {
    if (!form.name.trim()) { toast.warn("Informe o nome."); return; }
    try {
      await api.post("/flows", form);
      toast.success("Fluxo criado.");
      setModalOpen(false);
      setForm({ name: "", triggerType: "first_contact", triggerValue: "", channelType: "all" });
      fetch();
    } catch (err) {
      toastError(err);
    }
  };

  const toggle = async (id) => {
    try {
      await api.patch(`/flows/${id}/toggle`);
      fetch();
    } catch (err) {
      toastError(err);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Excluir fluxo?")) return;
    try {
      await api.delete(`/flows/${id}`);
      fetch();
    } catch (err) {
      toastError(err);
    }
  };

  if (editorFlow) {
    return <FlowNodeEditor flowId={editorFlow} onBack={() => { setEditorFlow(null); fetch(); }} />;
  }

  return (
    <MainContainer>
      <MainHeader>
        <Title>Fluxos / URA</Title>
        <MainHeaderButtonsWrapper>
          <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>Novo Fluxo</Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Gatilho</TableCell>
              <TableCell>Canal</TableCell>
              <TableCell align="center">Ativo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flows.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.name}</TableCell>
                <TableCell>{(TRIGGERS.find(t => t.v === f.triggerType) || {}).l || f.triggerType}{f.triggerValue ? `: ${f.triggerValue}` : ""}</TableCell>
                <TableCell>{(CHANNELS.find(c => c.v === f.channelType) || {}).l || f.channelType}</TableCell>
                <TableCell align="center">
                  <Switch checked={!!f.isActive} onChange={() => toggle(f.id)} color="primary" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setEditorFlow(f.id)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => remove(f.id)}><DeleteOutlineIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Fluxo</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth margin="dense" select label="Gatilho" value={form.triggerType} onChange={(e) => setForm({ ...form, triggerType: e.target.value })}>
            {TRIGGERS.map((t) => <MenuItem key={t.v} value={t.v}>{t.l}</MenuItem>)}
          </TextField>
          {form.triggerType === "keyword" && (
            <TextField fullWidth margin="dense" label="Palavra-chave" value={form.triggerValue} onChange={(e) => setForm({ ...form, triggerValue: e.target.value })} />
          )}
          <TextField fullWidth margin="dense" select label="Canal" value={form.channelType} onChange={(e) => setForm({ ...form, channelType: e.target.value })}>
            {CHANNELS.map((c) => <MenuItem key={c.v} value={c.v}>{c.l}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button color="primary" variant="contained" onClick={create}>Criar</Button>
        </DialogActions>
      </Dialog>
    </MainContainer>
  );
};

export default Flows;
