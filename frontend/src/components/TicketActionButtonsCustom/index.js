import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { makeStyles, createTheme, ThemeProvider } from "@material-ui/core/styles";
import { IconButton, Select, MenuItem } from "@material-ui/core";
import { MoreVert, Replay } from "@material-ui/icons";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import EmojiObjectsIcon from "@material-ui/icons/EmojiObjects";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import TicketOptionsMenu from "../TicketOptionsMenu";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { TicketsContext } from "../../context/Tickets/TicketsContext";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import UndoRoundedIcon from '@material-ui/icons/UndoRounded';
import Tooltip from '@material-ui/core/Tooltip';
import { green } from '@material-ui/core/colors';
import TransferModal from "../TransferModal";
import CopilotDrawer from "../CopilotDrawer";


const useStyles = makeStyles(theme => ({
	actionButtons: {
		marginRight: 6,
		flex: "none",
		alignSelf: "center",
		marginLeft: "auto",
		"& > *": {
			margin: theme.spacing(0.5),
		},
	},
}));

const TicketActionButtonsCustom = ({ ticket }) => {
	const classes = useStyles();
	const history = useHistory();
	const [anchorEl, setAnchorEl] = useState(null);
	const [loading, setLoading] = useState(false);
	const [transferOpen, setTransferOpen] = useState(false);
	const [copilotOpen, setCopilotOpen] = useState(false);
	const ticketOptionsMenuOpen = Boolean(anchorEl);
	const { user } = useContext(AuthContext);
	const { setCurrentTicket } = useContext(TicketsContext);

	const customTheme = createTheme({
		palette: {
		  	primary: green,
		}
	});

	const handleOpenTicketOptionsMenu = e => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseTicketOptionsMenu = e => {
		setAnchorEl(null);
	};

	const FUNNEL_STAGES = ["novo", "qualificado", "proposta", "negociacao", "ganho"];

	const handleChangeFunnel = async (stage) => {
		try {
			await api.patch(`/tickets/${ticket.id}/funnel`, { funnelStage: stage });
		} catch (err) {
			toastError(err);
		}
	};

	const handleUpdateTicketStatus = async (e, status, userId) => {
		setLoading(true);
		try {
			await api.put(`/tickets/${ticket.id}`, {
				status: status,
				userId: userId || null,
			});

			setLoading(false);
			if (status === "open") {
				setCurrentTicket({ ...ticket, code: "#open" });
			} else {
				setCurrentTicket({ id: null, code: null })
				history.push("/tickets");
			}
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	return (
		<div className={classes.actionButtons}>
			{ticket.status === "closed" && (
				<ButtonWithSpinner
					loading={loading}
					startIcon={<Replay />}
					size="small"
					onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
				>
					{i18n.t("messagesList.header.buttons.reopen")}
				</ButtonWithSpinner>
			)}
			{ticket.status === "open" && (
				<>
					<Tooltip title={i18n.t("messagesList.header.buttons.return")}>
						<IconButton onClick={e => handleUpdateTicketStatus(e, "pending", null)}>
							<UndoRoundedIcon />
						</IconButton>
					</Tooltip>
					<ThemeProvider theme={customTheme}>
						<Tooltip title={i18n.t("messagesList.header.buttons.resolve")}>
							<IconButton onClick={e => handleUpdateTicketStatus(e, "closed", user?.id)} color="primary">
								<CheckCircleIcon />
							</IconButton>
						</Tooltip>
					</ThemeProvider>
					<Select
						value={ticket.funnelStage || "novo"}
						onChange={(e) => handleChangeFunnel(e.target.value)}
						style={{ fontSize: 12, marginRight: 4 }}
						title="Estágio do funil"
					>
						{FUNNEL_STAGES.map((s) => (
							<MenuItem key={s} value={s}>{s}</MenuItem>
						))}
					</Select>
					{ticket.channel === "whatsapp" && (
						<Tooltip title="Transferir para outro número">
							<IconButton onClick={() => setTransferOpen(true)}>
								<SwapHorizIcon />
							</IconButton>
						</Tooltip>
					)}
					<Tooltip title="AI Copilot">
						<IconButton onClick={() => setCopilotOpen(true)}>
							<EmojiObjectsIcon style={{ color: "#42b9eb" }} />
						</IconButton>
					</Tooltip>
					{/* <ButtonWithSpinner
						loading={loading}
						startIcon={<Replay />}
						size="small"
						onClick={e => handleUpdateTicketStatus(e, "pending", null)}
					>
						{i18n.t("messagesList.header.buttons.return")}
					</ButtonWithSpinner>
					<ButtonWithSpinner
						loading={loading}
						size="small"
						variant="contained"
						color="primary"
						onClick={e => handleUpdateTicketStatus(e, "closed", user?.id)}
					>
						{i18n.t("messagesList.header.buttons.resolve")}
					</ButtonWithSpinner> */}
					<IconButton onClick={handleOpenTicketOptionsMenu}>
						<MoreVert />
					</IconButton>
					<TicketOptionsMenu
						ticket={ticket}
						anchorEl={anchorEl}
						menuOpen={ticketOptionsMenuOpen}
						handleClose={handleCloseTicketOptionsMenu}
					/>
				</>
			)}
			{ticket.status === "pending" && (
				<ButtonWithSpinner
					loading={loading}
					size="small"
					variant="contained"
					color="primary"
					onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
				>
					{i18n.t("messagesList.header.buttons.accept")}
				</ButtonWithSpinner>
			)}

			<TransferModal
				open={transferOpen}
				onClose={() => setTransferOpen(false)}
				ticket={ticket}
			/>
			<CopilotDrawer
				open={copilotOpen}
				onClose={() => setCopilotOpen(false)}
				ticketId={ticket.id}
				draft=""
				onUseSuggestion={(text) => {
					if (navigator.clipboard) navigator.clipboard.writeText(text);
					toast.info("Sugestão copiada — cole no campo de mensagem.");
				}}
			/>
		</div>
	);
};

export default TicketActionButtonsCustom;
