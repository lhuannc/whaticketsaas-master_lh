import React, { useState } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { Drawer, Button, CircularProgress, Typography, Paper } from "@material-ui/core";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import "../../styles/wpls-theme.css";

const useStyles = makeStyles((theme) => ({
  drawer: { width: 300, padding: theme.spacing(2) },
  header: { display: "flex", alignItems: "center", gap: 8, marginBottom: theme.spacing(2), fontWeight: 700 },
  actionBtns: { display: "flex", flexDirection: "column", gap: 8, marginBottom: theme.spacing(2) },
  resultCard: { padding: theme.spacing(1.5), borderRadius: 12, background: "rgba(66,185,235,.08)", border: "1px solid rgba(66,185,235,.3)", whiteSpace: "pre-wrap", fontSize: 13 },
  resultActions: { display: "flex", gap: 8, marginTop: 8 }
}));

// CopilotDrawer (ADR-010 frontend).
// Props: open, onClose, ticketId, draft (texto atual do composer), onUseSuggestion(text)
const CopilotDrawer = ({ open, onClose, ticketId, draft, onUseSuggestion }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const run = async (action) => {
    setLoading(true);
    setResult("");
    try {
      const body = { ticketId, action };
      if (action === "correct") body.draft = draft || "";
      const { data } = await api.post("/ai/suggest", body);
      setResult(data.result || "");
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  const useResult = () => {
    if (onUseSuggestion && result) onUseSuggestion(result);
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className={classes.drawer}>
        <div className={classes.header}>
          <EmojiObjectsIcon style={{ color: "#42b9eb" }} />
          AI Copilot
        </div>

        <div className={classes.actionBtns}>
          <Button variant="outlined" onClick={() => run("suggest")} disabled={loading}>Sugerir resposta</Button>
          <Button variant="outlined" onClick={() => run("correct")} disabled={loading || !draft}>Corrigir tom do rascunho</Button>
          <Button variant="outlined" onClick={() => run("summarize")} disabled={loading}>Resumir conversa</Button>
        </div>

        {loading && <CircularProgress size={24} />}

        {result && (
          <Paper className={classes.resultCard} elevation={0}>
            {result}
            <div className={classes.resultActions}>
              <Button size="small" color="primary" variant="contained" onClick={useResult}>Usar</Button>
              <Button size="small" onClick={() => setResult("")}>Descartar</Button>
            </div>
          </Paper>
        )}
      </div>
    </Drawer>
  );
};

export default CopilotDrawer;
