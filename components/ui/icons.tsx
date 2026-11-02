import type { SVGProps } from "react";

/** Icônes maison au trait (pas d'emoji, pas de librairie). 24×24, currentColor. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconDiscover = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 3h8v8H3zM13 13h8v8h-8z" />
    <path d="M17 3l4 4-4 4-4-4zM7 13l4 4-4 4-4-4z" />
  </Base>
);
export const IconSearch = (p: IconProps) => (
  <Base {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" />
  </Base>
);
export const IconLibrary = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 3h4v18H4zM10 3h4v18h-4z" />
    <path d="M16.5 4.5l3.8-1 2.2 16.5-3.8 1z" />
  </Base>
);
export const IconMe = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1-4.5 4.2-7 8-7s7 2.5 8 7" />
  </Base>
);
export const IconSun = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
);
export const IconMoon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
  </Base>
);
export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </Base>
);
export const IconClose = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </Base>
);
export const IconBolt = (p: IconProps) => (
  <Base {...p}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </Base>
);
export const IconPhone = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 2h10v20H7zM11 18h2" />
  </Base>
);
export const IconLeaf = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 21c0-9 6-16 18-18-1 12-8 18-17 18" />
    <path d="M3 21l9-9" />
  </Base>
);
export const IconChat = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 4h16v12H9l-5 4z" />
  </Base>
);
export const IconHome = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />
  </Base>
);
export const IconDownload = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
  </Base>
);
export const IconCart = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 3h3l2.6 12h11.2L21 7H6" />
    <circle cx="9" cy="20" r="1.3" />
    <circle cx="18" cy="20" r="1.3" />
  </Base>
);
export const IconHeart = (p: IconProps & { filled?: boolean }) => {
  const { filled, ...rest } = p;
  return (
    <Base {...rest}>
      <path
        d="M12 20s-8-4.6-8-10.2A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.8C20 15.4 12 20 12 20z"
        fill={filled ? "currentColor" : "none"}
      />
    </Base>
  );
};
export const IconShare = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12v8h16v-8M16 6l-4-4-4 4M12 2v13" />
  </Base>
);
export const IconGift = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12" />
    <path d="M12 9C10 4 6 5 7.5 7.5 8.4 9 12 9 12 9zM12 9c2-5 6-4 4.5-1.5C15.6 9 12 9 12 9z" />
  </Base>
);
export const IconPlay = (p: IconProps) => (
  <Base {...p} stroke="none">
    <path d="M7 4v16l13-8z" fill="currentColor" />
  </Base>
);
export const IconPause = (p: IconProps) => (
  <Base {...p} stroke="none">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" />
  </Base>
);
export const IconBack = (p: IconProps) => (
  <Base {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Base>
);
export const IconStar = (p: IconProps) => (
  <Base {...p} stroke="none">
    <path
      d="M12 2.5l2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z"
      fill="currentColor"
    />
  </Base>
);
export const IconLock = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4" />
  </Base>
);
export const IconChevron = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 6l6 6-6 6" />
  </Base>
);
export const IconGamepad = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 8h20v10H2zM7 11v4M5 13h4" />
    <path d="M15.5 12h.01M18 14h.01" strokeWidth={3} />
  </Base>
);
export const IconSchool = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 9l10-5 10 5-10 5zM6 11v5c2 2 10 2 12 0v-5M22 9v6" />
  </Base>
);
export const IconImage = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 4h18v16H3z" />
    <circle cx="9" cy="10" r="2" />
    <path d="M21 16l-5-5-10 9" />
  </Base>
);
export const IconMusic = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </Base>
);
export const IconBook = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-7v16" />
  </Base>
);
/* ── Catégories et outils di.si store ─────────────────────────────────────── */
export const IconApps = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
  </Base>
);
export const IconBuilding = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-5h6v5M9 11h.01M15 11h.01" />
  </Base>
);
export const IconBriefcase = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 7h18v13H3zM8 7V4h8v3M3 13h18" />
  </Base>
);
export const IconTender = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5" />
  </Base>
);
export const IconMic = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 4h6v9a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3" />
  </Base>
);
export const IconScan = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M7 12h10" />
  </Base>
);
export const IconBell = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 6 3 8 3 8H3s3-2 3-8M10 21h4" />
  </Base>
);
export const IconFlag = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 21V4h11l-2 4 2 4H5" />
  </Base>
);
export const IconLink = (p: IconProps) => (
  <Base {...p}>
    <path d="M10 14l4-4M9 7l2-2a4 4 0 0 1 6 6l-2 2M15 17l-2 2a4 4 0 0 1-6-6l2-2" />
  </Base>
);
export const IconMessage = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5h16v11H9l-5 4zM8 9h8M8 12h5" />
  </Base>
);
export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5h16v15H4zM4 10h16M8 3v4M16 3v4" />
  </Base>
);
export const IconMapPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Base>
);
export const IconPlus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);
export const IconGrid = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
  </Base>
);
export const IconUpload = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
  </Base>
);
