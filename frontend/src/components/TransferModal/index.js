import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Radio
} from "@material-ui/core";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import "../../styles/wpls-theme.css";

// Modal unificado de transferência (ADR-015).
// Props: open, onClose, ticket
const TransferModal = ({ open, onClose, ticket }) => {
  const [tab, setTab] = useState("instance");
  const [instances, setInstances] = useState([]);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [transferMessage, setTransferMessage] = useState("");
  const [notifyContact, setNotifyContact] = useState(true);
  const [forwardNumber, setForwardNumber] = useState("");
  const [includeHistory, setIncludeHistory] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const { data } = await api.get("/whatsapp/?session=0");
        const connected = (data || []).filter(
          (w) => w.channel === "whatsapp" && w.status === "CONNECTED" && w.id !== ticket?.whatsappId
        );
        setInstances(connected);
      } catch (err) {
        toastError(err);
      }
    })();
  }, [open, ticket]);

  const handleTransferInstance = async () => {
    if (!selectedInstance) { toast.warn("Selecione uma instância."); return; }
    setLoading(true);
    try {
      await api.post(`/tickets/${ticket.id}/transfer-instance`, {
        targetWhatsappId: selectedInstance,
        notifyContact,
        transferMessage: transferMessage || undefined
      });
      toast.success("Conversa transferida.");
      onClose();
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  const handleForward = async () => {
    if (!forwardNumber.trim()) { toast.warn("Informe o número."); return; }
    setLoading(true);
    try {
      await api.post(`/tickets/${ticket.id}/forward`, {
        targetNumber: forwardNumber,
        includeHistory
      });
      toast.success("Conversa encaminhada.");
      onClose();
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Transferir conversa</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} indicatorColor="primary" textColor="primary">
          <Tab label="Outro número" value="instance" />
          <Tab label="Encaminhar externo" value="forward" />
        </Tabs>

        {tab === "instance" && (
          <div style={{ marginTop: 12 }}>
            {instances.length === 0 && <p style={{ color: "#888" }}>Nenhuma outra instância conectada.</p>}
            <List>
              {instances.map((w) => (
                <ListItem key={w.id} button onClick={() => setSelectedInstance(w.id)}>
                  <Radio checked={selectedInstance === w.id} />
                  <ListItemText
                    primary={w.name}
                    secondary={`${w.provider === "evolution" ? "Evolution" : "Baileys"} · ${w.status}`}
                  />
                </ListItem>
              ))}
            </List>
            <FormControlLabel
              control={<Checkbox checked={notifyContact} onChange={(e) => setNotifyContact(e.target.checked)} />}
              label="Avisar cliente pelo novo número"
            />
            {notifyContact && (
              <TextField
                fullWidth
                multiline
                variant="outlined"
                size="small"
                label="Mensagem de transição (opcional)"
                value={transferMessage}
                onChange={(e) => setTransferMessage(e.target.value)}
              />
            )}
          </div>
        )}

        {tab === "forward" && (
          <div style={{ marginTop: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Número externo (com DDD)"
              placeholder="5511999999999"
              value={forwardNumber}
              onChange={(e) => setForwardNumber(e.target.value)}
            />
            <FormControlLabel
              style={{ marginTop: 8 }}
              control={<Checkbox checked={includeHistory} onChange={(e) => setIncludeHistory(e.target.checked)} />}
              label="Incluir histórico da conversa (até 50 msgs)"
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancelar</Button>
        {tab === "instance" ? (
          <Button color="primary" variant="contained" onClick={handleTransferInstance} disabled={loading}>Transferir</Button>
        ) : (
          <Button color="primary" variant="contained" onClick={handleForward} disabled={loading}>Encaminhar</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TransferModal;
