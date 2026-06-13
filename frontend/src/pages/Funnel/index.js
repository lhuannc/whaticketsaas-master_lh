import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Paper, Avatar, CircularProgress } from "@material-ui/core";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay
} from "@dnd-kit/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import WplsChannelBadge from "../../components/WplsChannelBadge";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import useSocket from "../../hooks/useSocket";
import "../../styles/wpls-theme.css";

const STAGES = [
  { key: "novo", label: "Novo" },
  { key: "qualificado", label: "Qualificado" },
  { key: "proposta", label: "Proposta" },
  { key: "negociacao", label: "Negociação" },
  { key: "ganho", label: "Ganho" }
];

const useStyles = makeStyles((theme) => ({
  board: { display: "flex", gap: 12, overflowX: "auto", padding: theme.spacing(1), flex: 1, ...theme.scrollbarStyles },
  column: { minWidth: 280, maxWidth: 280, background: theme.palette.type === "dark" ? "#1a2535" : "#f4f7fa", borderRadius: 12, padding: 8, display: "flex", flexDirection: "column" },
  columnOver: { outline: "2px dashed #42b9eb", outlineOffset: -4 },
  colHeader: { display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", fontWeight: 700, fontSize: 13 },
  colTotal: { marginLeft: "auto", fontSize: 12, color: "#16a34a", fontWeight: 700 },
  card: { background: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 10, padding: 10, marginBottom: 8, cursor: "grab" },
  cardTop: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  cardName: { fontWeight: 600, fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  dealValue: { fontSize: 13, fontWeight: 700, color: "#16a34a" }
}));

const formatMoney = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Card({ ticket, onOpen }) {
  const classes = useStyles();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: String(ticket.id) });
  return (
    <div
      ref={setNodeRef}
      className={classes.card}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(ticket)}
    >
      <div className={classes.cardTop}>
        <Avatar style={{ width: 24, height: 24, fontSize: 12 }} src={ticket.contact?.profilePicUrl}>
          {(ticket.contact?.name || "?").charAt(0)}
        </Avatar>
        <span className={classes.cardName}>{ticket.contact?.name || ticket.contact?.number}</span>
        <WplsChannelBadge channel={ticket.contact?.channel || ticket.channel} short />
      </div>
      {ticket.dealValue != null && <div className={classes.dealValue}>{formatMoney(ticket.dealValue)}</div>}
    </div>
  );
}

function Column({ stage, items, total, onOpen }) {
  const classes = useStyles();
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });
  return (
    <div ref={setNodeRef} className={`${classes.column} ${isOver ? classes.columnOver : ""}`}>
      <div className={classes.colHeader}>
        <span className={`wpls-stage-dot ${stage.key}`} />
        {stage.label}
        <span style={{ color: "#888", fontWeight: 400 }}>({items.length})</span>
        <span className={classes.colTotal}>{formatMoney(total)}</span>
      </div>
      {items.map((t) => <Card key={t.id} ticket={t} onOpen={onOpen} />)}
    </div>
  );
}

const Funnel = () => {
  const classes = useStyles();
  const history = useHistory();
  const [stages, setStages] = useState({});
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const fetchFunnel = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tickets/funnel");
      setStages(data.stages || {});
      setTotals(data.totals || {});
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchFunnel(); }, [fetchFunnel]);

  useSocket(({ socket, companyId }) => {
    socket.off(`company-${companyId}-ticket`);
    socket.on(`company-${companyId}-ticket`, (data) => {
      if (data.action === "funnel-updated") fetchFunnel();
    });
  });

  const findTicketStage = (ticketId) => {
    for (const k of Object.keys(stages)) {
      if ((stages[k] || []).some((t) => String(t.id) === String(ticketId))) return k;
    }
    return null;
  };

  const handleDragStart = (e) => {
    const id = e.active.id;
    const from = findTicketStage(id);
    const t = (stages[from] || []).find((x) => String(x.id) === String(id));
    setActiveTicket(t);
  };

  const handleDragEnd = async (e) => {
    setActiveTicket(null);
    const { active, over } = e;
    if (!over) return;
    const ticketId = active.id;
    const targetStage = over.id;
    const fromStage = findTicketStage(ticketId);
    if (!fromStage || fromStage === targetStage) return;

    // Optimistic
    const ticket = (stages[fromStage] || []).find((t) => String(t.id) === String(ticketId));
    if (!ticket) return;
    setStages((prev) => ({
      ...prev,
      [fromStage]: prev[fromStage].filter((t) => String(t.id) !== String(ticketId)),
      [targetStage]: [{ ...ticket, funnelStage: targetStage }, ...(prev[targetStage] || [])]
    }));

    try {
      await api.patch(`/tickets/${ticketId}/funnel`, { funnelStage: targetStage });
    } catch (err) {
      toastError(err);
      fetchFunnel(); // reverte
    }
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>Funil CRM</Title>
      </MainHeader>
      <Paper style={{ flex: 1, display: "flex", padding: 8 }} variant="outlined">
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={classes.board}>
              {STAGES.map((stage) => (
                <Column
                  key={stage.key}
                  stage={stage}
                  items={stages[stage.key] || []}
                  total={totals[stage.key]}
                  onOpen={(t) => history.push(`/tickets/${t.uuid}`)}
                />
              ))}
            </div>
            <DragOverlay>
              {activeTicket ? (
                <div className={classes.card} style={{ width: 264 }}>
                  <div className={classes.cardTop}>
                    <Avatar style={{ width: 24, height: 24, fontSize: 12 }}>
                      {(activeTicket.contact?.name || "?").charAt(0)}
                    </Avatar>
                    <span className={classes.cardName}>{activeTicket.contact?.name || activeTicket.contact?.number}</span>
                  </div>
                  {activeTicket.dealValue != null && <div className={classes.dealValue}>{formatMoney(activeTicket.dealValue)}</div>}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </Paper>
    </MainContainer>
  );
};

export default Funnel;
