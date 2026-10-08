import type {SVGProps} from 'react';

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props
});

export const IconPhone = (p: P) => (
  <svg {...base(p)}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const IconWhatsApp = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.200 8.200 0 0 1-4.200-1.150l-.3-.18-3 .78.800-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200zm4.500-6.140c-.250-.120-1.460-.720-1.690-.800-.230-.090-.390-.130-.560.120-.160.250-.640.800-.780.970-.140.160-.290.180-.540.060a6.700 6.700 0 0 1-2-1.230 7.400 7.400 0 0 1-1.370-1.700c-.140-.250-.020-.380.110-.500.110-.110.250-.290.370-.430.120-.140.160-.250.250-.410.080-.160.040-.310-.020-.430-.060-.120-.560-1.340-.760-1.840-.200-.480-.410-.420-.560-.420h-.480c-.160 0-.430.060-.660.310-.220.250-.860.840-.860 2.050s.880 2.380 1 2.540c.130.160 1.740 2.650 4.200 3.720.590.250 1.050.400 1.400.520.590.190 1.130.160 1.550.100.470-.070 1.460-.600 1.670-1.170.200-.580.200-1.070.140-1.170-.060-.110-.220-.170-.470-.290z" />
  </svg>
);

export const IconCalendar = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4.500" width="18" height="16.500" rx="3" />
    <path d="M3 10h18M8 2.500v4M16 2.500v4" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12.500l4.500 4.500L19 7.500" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.500" y="4.500" width="19" height="15" rx="3" />
    <path d="M3 7l9 6.500L21 7" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21.500s7-6.200 7-11.500a7 7 0 1 0-14 0c0 5.300 7 11.500 7 11.500z" />
    <circle cx="12" cy="10" r="2.500" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 2.500l8 3v6c0 5-3.400 8.600-8 10-4.600-1.400-8-5-8-10v-6l8-3z" />
    <path d="M8.500 12l2.500 2.500 4.500-5" />
  </svg>
);

export const IconSteam = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 3c-1.500 2 1.500 3 0 5.500M12 3c-1.500 2 1.500 3 0 5.500M17 3c-1.500 2 1.500 3 0 5.500" />
    <path d="M3 13.500h18l-1.500 5.500a2 2 0 0 1-2 1.500h-11a2 2 0 0 1-2-1.500L3 13.500z" />
  </svg>
);

export const IconHome = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 11.500L12 4l9 7.500" />
    <path d="M5.500 10v10h13V10" />
    <path d="M10 20v-5.500h4V20" />
  </svg>
);

export const IconLeaf = (p: P) => (
  <svg {...base(p)}>
    <path d="M20.500 3.500C10 3.500 4.500 8.500 4.500 15a5.500 5.500 0 0 0 5.500 5.500c6.500 0 10.500-6 10.500-17z" />
    <path d="M3.500 21.500c2-5 5.500-8.500 10.500-11" />
  </svg>
);

export const IconStar = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2.500l2.900 6.100 6.600.900-4.800 4.600 1.200 6.600L12 17.500l-5.900 3.200 1.200-6.600L2.500 9.500l6.600-.900L12 2.500z" />
  </svg>
);

export const IconSofa = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 11V8.500A2.500 2.500 0 0 1 7.500 6h9A2.500 2.500 0 0 1 19 8.500V11" />
    <path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4.500a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V13z" />
    <path d="M6 18.500V20M18 18.500V20" />
  </svg>
);

export const IconSparkle = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800L12 3z" />
    <path d="M19 15.500l.700 2 2 .700-2 .700-.700 2-.700-2-2-.700 2-.700.700-2z" />
  </svg>
);

export const IconEuro = (p: P) => (
  <svg {...base(p)}>
    <path d="M18 6.500A7 7 0 0 0 6.500 12 7 7 0 0 0 18 17.500M4 10h9M4 14h9" />
  </svg>
);

export const IconDrag = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
  </svg>
);

export const IconChair = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v7H5.5V5A1.5 1.5 0 0 1 7 3.5z" />
    <path d="M4.5 12h15v3.5h-15z" />
    <path d="M6.5 15.5V21M17.5 15.5V21" />
  </svg>
);

export const IconBed = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 18.5V7M21 18.5v-6a2.5 2.5 0 0 0-2.5-2.5H3" />
    <path d="M3 15.5h18" />
    <path d="M6 10V8.5A1.5 1.5 0 0 1 7.5 7h3A1.5 1.5 0 0 1 12 8.5V10" />
  </svg>
);

/** blower / air flow — the free drying */
export const IconWind = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 9h10.5a2.5 2.5 0 1 0-2.4-3.2" />
    <path d="M3 13h15a2.5 2.5 0 1 1-2.4 3.2" />
    <path d="M3 17h7.5a2 2 0 1 1-1.9 2.6" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5.5v13M5.5 12h13" />
  </svg>
);
