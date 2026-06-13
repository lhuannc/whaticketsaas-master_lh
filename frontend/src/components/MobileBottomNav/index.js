import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { BottomNavigation, BottomNavigationAction, useMediaQuery } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import ForumIcon from "@material-ui/icons/Forum";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1200,
    borderTop: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper
  }
}));

// Bottom-tab nav (ADR-006). Visível só em mobile (<600px).
const TABS = [
  { to: "/tickets", label: "Conversas", icon: <ChatIcon /> },
  { to: "/moderation", label: "Comentários", icon: <ForumIcon /> },
  { to: "/funnel", label: "Funil", icon: <ViewColumnIcon /> },
  { to: "/profile", label: "Perfil", icon: <PersonIcon /> }
];

const MobileBottomNav = () => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  if (!isMobile) return null;

  const current = TABS.findIndex((t) => location.pathname.startsWith(t.to));

  return (
    <BottomNavigation
      className={classes.root}
      value={current === -1 ? 0 : current}
      onChange={(e, idx) => history.push(TABS[idx].to)}
      showLabels
    >
      {TABS.map((t) => (
        <BottomNavigationAction key={t.to} label={t.label} icon={t.icon} />
      ))}
    </BottomNavigation>
  );
};

export default MobileBottomNav;
