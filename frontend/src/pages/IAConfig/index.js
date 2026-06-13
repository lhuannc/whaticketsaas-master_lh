import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import "../../styles/wpls-theme.css";

const useStyles = makeStyles((theme) => ({
  mainPaper: { flex: 1, padding: theme.spacing(3), overflowY: "auto", ...theme.scrollbarStyles, maxWidth: 720 },
  field: { marginBottom: theme.spacing(2) },
  hint: { fontSize: 12, color: "#888", marginBottom: theme.spacing(1) },
  section: { marginTop: theme.spacing(3), fontWeight: 700 }
}));

// Converte texto multiline "kw1,kw2 | conteúdo" → JSON [{keywords, text}]
const parseKnowledge = (raw) => {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [kwPart, ...rest] = line.split("|");
      if (rest.length === 0) return { keywords: [], text: kwPart.trim() };
      return {
        keywords: kwPart.split(",").map((k) => k.trim()).filter(Boolean),
        text: rest.join("|").trim()
      };
    });
};

const stringifyKnowledge = (json) => {
  try {
    const arr = JSON.parse(json || "[]");
    if (!Array.isArray(arr)) return "";
    return arr
      .map((c) => `${(c.keywords || []).join(", ")} | ${c.text}`)
      .join("\n");
  } catch {
    return "";
  }
};

const IAConfig = () => {
  const classes = useStyles();
  const [tone, setTone] = useState("cordial");
  const [persona, setPersona] = useState("");
  const [knowledge, setKnowledge] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/settings");
      const get = (k) => data.find((s) => s.key === k)?.value;
      setTone(get("aiTone") || "cordial");
      setPersona(get("aiPersona") || "");
      setKnowledge(stringifyKnowledge(get("aiKnowledgeBase")));
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/settings/aiTone", { value: tone });
      await api.put("/settings/aiPersona", { value: persona });
      await api.put("/settings/aiKnowledgeBase", { value: JSON.stringify(parseKnowledge(knowledge)) });
      toast.success("Configurações de IA salvas.");
    } catch (err) {
      toastError(err);
    }
    setSaving(false);
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>IA — Persona & Base de Conhecimento</Title>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <TextField
              className={classes.field}
              select
              fullWidth
              label="Tom de voz"
              variant="outlined"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <MenuItem value="formal">Formal</MenuItem>
              <MenuItem value="cordial">Cordial</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
            </TextField>

            <Typography className={classes.hint}>
              Persona do assistente: nome, personalidade, regras de comportamento.
            </Typography>
            <TextField
              className={classes.field}
              fullWidth
              multiline
              minRows={3}
              variant="outlined"
              label="Persona"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
            />

            <Typography className={classes.section}>Base de Conhecimento (RAG)</Typography>
            <Typography className={classes.hint}>
              Um item por linha, formato: <code>palavra-chave1, palavra-chave2 | texto da resposta</code>
            </Typography>
            <TextField
              className={classes.field}
              fullWidth
              multiline
              minRows={6}
              variant="outlined"
              label="Base de conhecimento"
              placeholder={"garantia, troca | Nossa garantia é de 12 meses.\nentrega, prazo | Entregamos em até 5 dias úteis."}
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
            />

            <Button variant="contained" color="primary" onClick={save} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </>
        )}
      </Paper>
    </MainContainer>
  );
};

export default IAConfig;
