import React, { useState, useEffect, useReducer, useCallback, useRef } from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  TextField,
  Avatar,
  Chip,
  CircularProgress,
  Tabs,
  Tab
} from "@material-ui/core";
import ReplyIcon from "@material-ui/icons/Reply";
import BlockIcon from "@material-ui/icons/Block";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ForumIcon from "@material-ui/icons/Forum";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import WplsChannelBadge from "../../components/WplsChannelBadge";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import useSocket from "../../hooks/useSocket";
import { useHistory } from "react-router-dom";

const reducer = (state, action) => {
  if (action.type === "LOAD_COMMENTS") {
    const comments = action.payload;
    const newItems = [];
    comments.forEach((c) => {
      const idx = state.findIndex((s) => s.id === c.id);
      if (idx !== -1) state[idx] = c;
      else newItems.push(c);
    });
    return [...state, ...newItems];
  }
  if (action.type === "UPDATE_COMMENT") {
    const c = action.payload;
    const idx = state.findIndex((s) => s.id === c.id);
    if (idx !== -1) { state[idx] = c; return [...state]; }
    return [c, ...state];
  }
  if (action.type === "RESET") return [];
  return state;
};

const useStyles = makeStyles((theme) => ({
  mainPaper: { flex: 1, padding: theme.spacing(2), overflowY: "auto", ...theme.scrollbarStyles },
  filters: { display: "flex", gap: 8, marginBottom: theme.spacing(2), flexWrap: "wrap" },
  commentCard: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    display: "flex",
    gap: 12
  },
  spamCard: { borderLeft: "3px solid #ef4444" },
  repliedCard: { borderLeft: "3px solid #16a34a", opacity: 0.7 },
  body: { flex: 1 },
  authorRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  authorName: { fontWeight: 600, fontSize: 14 },
  text: { fontSize: 14, marginBottom: 8 },
  actions: { display: "flex", gap: 8, marginTop: 8 },
  replyBox: { marginTop: 8, display: "flex", gap: 8 }
}));

const Moderation = () => {
  const classes = useStyles();
  const history = useHistory();

  const [comments, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusTab, setStatusTab] = useState("pending");
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [posts, setPosts] = useState([]);
  const [postFilter, setPostFilter] = useState(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (channelFilter !== "all") params.channelType = channelFilter;
      if (statusTab === "pending") { params.isReplied = false; params.isSpam = false; }
      if (statusTab === "replied") params.isReplied = true;
      if (statusTab === "spam") params.isSpam = true;
      if (postFilter) params.postId = postFilter;

      const { data } = await api.get("/comments", { params });
      dispatch({ type: "RESET" });
      dispatch({ type: "LOAD_COMMENTS", payload: data.comments });
    } catch (err) {
      toastError(err);
    }
    setLoading(false);
  }, [channelFilter, statusTab, postFilter]);

  const fetchPosts = useCallback(async () => {
    try {
      const params = {};
      if (channelFilter !== "all") params.channelType = channelFilter;
      const { data } = await api.get("/comments/posts", { params });
      setPosts(data.posts || []);
    } catch (err) {
      // posts opcionais
    }
  }, [channelFilter]);

  useEffect(() => { fetchComments(); }, [fetchComments]);
  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Mantém ref da última fetchComments p/ refetch on reconnect sem re-subscrever socket
  const fetchRef = useRef(fetchComments);
  useEffect(() => { fetchRef.current = fetchComments; }, [fetchComments]);

  useSocket(({ socket, companyId }) => {
    socket.off(`company-${companyId}-comment`);
    socket.on(`company-${companyId}-comment`, (data) => {
      if (data.action === "create" || data.action === "update") {
        dispatch({ type: "UPDATE_COMMENT", payload: data.comment });
      }
    });
    if (fetchRef.current) fetchRef.current();
  });

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      await api.post(`/comments/${commentId}/reply`, { body: replyText });
      toast.success("Resposta enviada.");
      setReplyingId(null);
      setReplyText("");
      fetchComments();
    } catch (err) {
      toastError(err);
    }
  };

  const handleSpam = async (commentId) => {
    try {
      await api.post(`/comments/${commentId}/spam`);
      toast.success("Comentário marcado como spam.");
      fetchComments();
    } catch (err) {
      toastError(err);
    }
  };

  const handleConvertToDM = async (commentId) => {
    try {
      const { data } = await api.post(`/comments/${commentId}/convert-to-dm`);
      if (data.ticketId) history.push(`/tickets/${data.ticketId}`);
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>Moderação de Comentários</Title>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <div className={classes.filters}>
          <Chip label="Todos" color={channelFilter === "all" ? "primary" : "default"} onClick={() => setChannelFilter("all")} clickable />
          <Chip label="Instagram" color={channelFilter === "instagram" ? "primary" : "default"} onClick={() => setChannelFilter("instagram")} clickable />
          <Chip label="LinkedIn" color={channelFilter === "linkedin" ? "primary" : "default"} onClick={() => setChannelFilter("linkedin")} clickable />
        </div>

        {posts.length > 0 && (
          <div className={classes.filters} style={{ marginTop: 8 }}>
            <Chip
              size="small"
              label="Todos os posts"
              color={!postFilter ? "primary" : "default"}
              onClick={() => setPostFilter(null)}
              clickable
            />
            {posts.map((p) => (
              <Chip
                key={p.postId || "sem-post"}
                size="small"
                label={`${(p.postId || "sem-post").slice(-8)} · ${p.pending}/${p.total}`}
                color={postFilter === p.postId ? "primary" : "default"}
                onClick={() => setPostFilter(p.postId)}
                clickable
              />
            ))}
          </div>
        )}

        <Tabs value={statusTab} onChange={(e, v) => setStatusTab(v)} indicatorColor="primary" textColor="primary">
          <Tab label="Pendentes" value="pending" />
          <Tab label="Respondidos" value="replied" />
          <Tab label="Spam" value="spam" />
        </Tabs>

        <div style={{ marginTop: 16 }}>
          {loading && <CircularProgress size={24} />}
          {!loading && comments.length === 0 && <p style={{ color: "#888" }}>Nenhum comentário.</p>}
          {comments.map((c) => (
            <div
              key={c.id}
              className={`${classes.commentCard} ${c.isSpam ? classes.spamCard : ""} ${c.isReplied ? classes.repliedCard : ""}`}
            >
              <Avatar>{(c.authorName || "?").charAt(0).toUpperCase()}</Avatar>
              <div className={classes.body}>
                <div className={classes.authorRow}>
                  <span className={classes.authorName}>{c.authorName || c.authorUsername}</span>
                  <WplsChannelBadge channel={c.channelType} />
                  {c.isReplied && <CheckCircleIcon style={{ color: "#16a34a", fontSize: 16 }} />}
                  {c.isSpam && <Chip size="small" label="Spam" style={{ background: "#fee2e2", color: "#ef4444" }} />}
                </div>
                <div className={classes.text}>{c.body}</div>
                {!c.isReplied && !c.isSpam && (
                  <div className={classes.actions}>
                    <Button size="small" startIcon={<ReplyIcon />} onClick={() => { setReplyingId(c.id); setReplyText(""); }}>
                      Responder
                    </Button>
                    <Button size="small" startIcon={<BlockIcon />} onClick={() => handleSpam(c.id)} style={{ color: "#ef4444" }}>
                      Spam
                    </Button>
                    <Button size="small" startIcon={<ForumIcon />} onClick={() => handleConvertToDM(c.id)}>
                      Converter DM
                    </Button>
                  </div>
                )}
                {replyingId === c.id && (
                  <div className={classes.replyBox}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      placeholder="Escreva uma resposta..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      multiline
                    />
                    <Button variant="contained" color="primary" onClick={() => handleReply(c.id)}>Enviar</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Moderation;
