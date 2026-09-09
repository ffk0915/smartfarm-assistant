import { ExternalLink } from "lucide-react";
import "./ExternalLinkButton.css";

export default function ExternalLinkButton({ href, label, description }) {
  return (
    <a className="ext-link" href={href} target="_blank" rel="noopener noreferrer">
      <span>
        <span className="ext-link__label">{label}</span>
        {description && <span className="ext-link__desc">{description}</span>}
      </span>
      <ExternalLink size={18} strokeWidth={1.8} />
    </a>
  );
}
