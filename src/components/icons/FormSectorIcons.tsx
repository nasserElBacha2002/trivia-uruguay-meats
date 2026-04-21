import SvgIcon from "@mui/material/SvgIcon";
import type { ReactNode } from "react";

const sx = { fontSize: "1.55rem", color: "secondary.main" };

function IconShell({ children }: { children: ReactNode }) {
  return (
    <SvgIcon sx={sx} viewBox="0 0 24 24" aria-hidden>
      {children}
    </SvgIcon>
  );
}

/** Importador — envío / embarque */
export function SectorIconImporter() {
  return (
    <IconShell>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
        d="M4 17h16M6 17V9l4-3h4l4 3v8M9 14h2M13 14h2M10 6V4h4v2"
      />
    </IconShell>
  );
}

/** Distribuidor — caja / logística */
export function SectorIconDistributor() {
  return (
    <IconShell>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
        d="M4 8h16v10H4V8zm0 4h16M12 8v10M8 12h8M8 8l4-3h0l4 3"
      />
    </IconShell>
  );
}

/** Varejo — tienda */
export function SectorIconRetail() {
  return (
    <IconShell>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
        d="M4 10h16l-2 8H6l-2-8zm2 0V6h12v4M9 14h6v4H9v-4z"
      />
    </IconShell>
  );
}

/** Foodservice — cubiertos (tenedor + cuchillo) */
export function SectorIconFoodservice() {
  return (
    <IconShell>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        d="M9 4v7M9 11c0 1.5.5 3 1 4M10 4v3M8 4v3M11 15v5M7 15h8M16 5v14M16 5l2 2v12"
      />
    </IconShell>
  );
}

/** Indústria — fábrica */
export function SectorIconIndustry() {
  return (
    <IconShell>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
        d="M4 20h16V10l-4 3V9l-4 3V8L8 11v9M8 20V12h8v8M10 16h4M10 14h4"
      />
    </IconShell>
  );
}

/** Outro — tres puntos */
export function SectorIconOther() {
  return (
    <IconShell>
      <path
        fill="currentColor"
        d="M6 14a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z"
      />
    </IconShell>
  );
}
