import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  CircularProgress
} from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  mainPaper: { flex: 1, padding: theme.spacing(2), overflowY: "auto", ...theme.scrollbarStyles },
  nodeCard: { border: `1px solid ${theme.palette.divider}`, borderRadius: 10, padding: theme.spacing(1.5), marginBottom: theme.spacing(1.5) },
  nodeHead: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  hint: { fontSize: 12, color: "#888", marginBottom: 8 }
}));

const NODE_TYPES = [
  { v: "start", l: "Início" },
  { v: "message", l: "Mensagem" },
  { v: "menu", l: "Menu de opções" },
  { v: "queue", l: "Transferir p/ fila" },
  { v: "funnel", l: "Mover funil" },
  { v: "ai", l: "AI Copilot" },
  { v: "end", l: "Fim" }
];

const FUNNEL_STAGES = ["novo", "qualificado", "proposta", "negociacao", "ganho"];

// Editor linear simples: nodes em sequência (edge implícita p/ próximo).
// Menu usa options com target = id do node alvo.
const FlowNodeEditor = ({ flowId, onBack }) => {
  const classes = useStyles();
  const [nodes, setNodes] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/flows/${flowId}`);
      setName(data.name);
      const ns = Array.isArray(data.nodes) ? data.nodes : [];
      if (ns.length === 0) {
        setNodes([{ id: "start", type: "start", data: {} }]);
      } else {
        setNodes(ns);
      }
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  }, [flowId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addNode = () => {
    const id = `n${Date.now()}`;
    setNodes([...nodes, { id, type: "message", data: { text: "" } }]);
  };

  const updateNode = (idx, patch) => {
    const copy = [...nodes];
    copy[idx] = { ...copy[idx], ...patch, data: { ...copy[idx].data, ...(patch.data || {}) } };
    setNodes(copy);
  };

  const removeNode = (idx) => {
    setNodes(nodes.filter((_, i) => i !== idx));
  };

  // Edges lineares: cada node → próximo (exceto menu, que roteia por options.target)
  const buildEdges = () => {
    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      if (nodes[i].type !== "menu" && nodes[i].type !== "end") {
        edges.push({ id: `e${i}`, source: nodes[i].id, target: nodes[i + 1].id });
      }
    }
    return edges;
  };

  const save = async () => {
    try {
      await api.put(`/flows/${flowId}`, { nodes, edges: buildEdges() });
      toast.success("Fluxo salvo.");
    } catch (err) {
      toastError(err);
    }
  };

  if (loading) {
    return (
      <MainContainer>
        <Paper className={classes.mainPaper}><CircularProgress size={24} /></Paper>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <MainHeader>
        <IconButton onClick={onBack}><ArrowBackIcon /></IconButton>
        <Title>Editar: {name}</Title>
        <MainHeaderButtonsWrapper>
          <Button onClick={addNode}>+ Node</Button>
          <Button variant="contained" color="primary" onClick={save}>Salvar</Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Typography className={classes.hint}>
          Nodes executam em sequência (de cima p/ baixo). Menu roteia por opção; node "Fim" encerra.
        </Typography>
        {nodes.map((node, idx) => (
          <div key={node.id} className={classes.nodeCard}>
            <div className={classes.nodeHead}>
              <TextField
                select
                size="small"
                variant="outlined"
                label="Tipo"
                value={node.type}
                onChange={(e) => updateNode(idx, { type: e.target.value })}
                style={{ minWidth: 180 }}
                disabled={node.type === "start"}
              >
                {NODE_TYPES.map((t) => <MenuItem key={t.v} value={t.v}>{t.l}</MenuItem>)}
              </TextField>
              <span style={{ color: "#888", fontSize: 12 }}>id: {node.id}</span>
              {node.type !== "start" && (
                <IconButton size="small" style={{ marginLeft: "auto" }} onClick={() => removeNode(idx)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </div>

            {(node.type === "message" || node.type === "menu") && (
              <TextField
                fullWidth multiline minRows={2} size="small" variant="outlined"
                label={node.type === "menu" ? "Texto do menu" : "Mensagem"}
                value={node.data.text || ""}
                onChange={(e) => updateNode(idx, { data: { text: e.target.value } })}
              />
            )}

            {node.type === "menu" && (
              <div style={{ marginTop: 8 }}>
                <Typography className={classes.hint}>Opções (tecla | rótulo | id do node alvo):</Typography>
                <TextField
                  fullWidth multiline minRows={2} size="small" variant="outlined"
                  placeholder={"1 | Vendas | n123\n2 | Suporte | n456"}
                  value={(node.data.options || []).map((o) => `${o.key} | ${o.label} | ${o.target}`).join("\n")}
                  onChange={(e) => {
                    const options = e.target.value.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
                      const [key, label, target] = l.split("|").map((s) => s.trim());
                      return { key, label, target };
                    });
                    updateNode(idx, { data: { options } });
                  }}
                />
              </div>
            )}

            {node.type === "funnel" && (
              <TextField
                select size="small" variant="outlined" label="Estágio" style={{ minWidth: 200 }}
                value={node.data.funnelStage || "novo"}
                onChange={(e) => updateNode(idx, { data: { funnelStage: e.target.value } })}
              >
                {FUNNEL_STAGES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            )}

            {node.type === "queue" && (
              <TextField
                size="small" variant="outlined" label="ID da fila" type="number"
                value={node.data.queueId || ""}
                onChange={(e) => updateNode(idx, { data: { queueId: parseInt(e.target.value, 10) } })}
              />
            )}

            {node.type === "ai" && (
              <TextField
                fullWidth multiline minRows={2} size="small" variant="outlined"
                label="Prompt do sistema (opcional)"
                value={node.data.aiPrompt || ""}
                onChange={(e) => updateNode(idx, { data: { aiPrompt: e.target.value } })}
              />
            )}
          </div>
        ))}
      </Paper>
    </MainContainer>
  );
};

export default FlowNodeEditor;
