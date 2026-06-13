import React from "react";
import "../../styles/wpls-theme.css";

const MAP = {
  whatsapp: { cls: "wa", label: "WhatsApp" },
  instagram: { cls: "ig", label: "Instagram" },
  linkedin: { cls: "li", label: "LinkedIn" },
  facebook: { cls: "li", label: "Facebook" }
};

const WplsChannelBadge = ({ channel, short }) => {
  const cfg = MAP[channel] || { cls: "wa", label: channel };
  const label = short ? cfg.label.slice(0, 2).toUpperCase() : cfg.label;
  return <span className={`wpls-badge ${cfg.cls}`}>{label}</span>;
};

export default WplsChannelBadge;
