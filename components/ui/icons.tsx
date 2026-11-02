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
