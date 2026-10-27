// Inline-SVG-Icons des DS Werkplan 2.0 (ADR-261). Strichbasiert, currentColor,
// flach, ohne Icon-Bibliothek als Abhängigkeit. Größe über `size`, die Farbe
// erbt vom Elternelement (color wird currentColor). Dekorativ, also aria-hidden.
import type { SVGProps } from "react";
import {
  ABO_ICON_CENTER,
  ABO_ICON_FAINT_OPACITY,
  ABO_ICON_RING_RADII,
  ABO_ICON_STROKE_WIDTH,
  ABO_ICON_SWEEP,
  ABO_ICON_SWEEP_WIDTHS,
  ABO_ICON_VIEWBOX,
  aboIconStage,
  type Paket,
} from "./abo-icon";
import { WERKPLAN_ICONS, type WerkplanIconName } from "./werte";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Icon({ size = 16, ...rest }: IconProps & { children: SVGProps<SVGSVGElement>["children"] }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
      {...rest}
    />
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Icon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </Icon>
  );
}

export function FileTextIcon(props: IconProps) {
  return <WerkplanIcon {...props} icon="file-text" />;
}

export function ScanIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M3 12h18" />
    </Icon>
  );
}

/** Browserfenster: steht für eine gebaute Seite (Website-Entwurf am Lead). */
export function BrowserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M7 6.5h.01M10 6.5h.01" />
    </Icon>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Icon>
  );
}

export function AlertCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </Icon>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </Icon>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </Icon>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m17 8-5-5-5 5" />
      <path d="M12 3v12" />
    </Icon>
  );
}

/** Lucide „check“: einfacher Haken. */
export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  );
}

/** Lucide „plus“. */
export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Icon>
  );
}

/** Lucide „images“: Bilderstapel (Leerzustand Datei-Eingang). */
export function ImagesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 22H4a2 2 0 0 1-2-2V6" />
      <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
      <circle cx="12" cy="8" r="2" />
      <rect width="16" height="16" x="6" y="2" rx="2" />
    </Icon>
  );
}

/** Lucide „video“: Kamera (Videodatei im Sichttisch). */
export function VideoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </Icon>
  );
}

/** Lucide „message-square“: Angabe des Kunden an einer Datei. */
export function MessageSquareIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Icon>
  );
}

/** Lucide „clock“. */
export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Icon>
  );
}

/** Lucide „x“. */
export function XIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  );
}

/** Lucide „sparkles“: Neuigkeiten der Kundenseite (ADR-250). */
export function FunkenIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </Icon>
  );
}

/** Lucide „undo“: Rücknahme. */
export function UndoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </Icon>
  );
}

/** Lucide „arrow-up-right“: Link, der eine fremde Seite in neuem Tab öffnet. */
export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </Icon>
  );
}

/** Lucide „arrow-right“. */
export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Icon>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Icon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </Icon>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </Icon>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Icon>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Icon>
  );
}

export function SendIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </Icon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </Icon>
  );
}

/**
 * Icons des Monatsberichts v3 (Plan monatsbericht-studie-d.md Step 16a). Die
 * Pfade stehen in ./werte.ts, damit Web und PDF
 * dieselbe Geometrie zeichnen. Gefüllte Elemente nehmen currentColor als
 * Fläche; Striche auf einer Fläche (Haken im gefüllten Kreis) stehen in der
 * hellsten Papierstufe ink-050.
 */
function WerkplanIcon({ icon, ...props }: IconProps & { icon: WerkplanIconName }) {
  return (
    <Icon {...props}>
      {WERKPLAN_ICONS[icon].map((el, i) =>
        el.art === "kreis" ? (
          <circle key={i} cx={el.cx} cy={el.cy} r={el.r} fill={"gefuellt" in el ? "currentColor" : undefined} />
        ) : (
          <path key={i} d={el.d} stroke={"aufFuellung" in el ? "var(--ink-050)" : undefined} />
        ),
      )}
    </Icon>
  );
}

export function CircleIcon(props: IconProps) {
  return <WerkplanIcon {...props} icon="circle" />;
}

/** Gefüllter Kreis mit Haken; der Umriss-Kreis bleibt CheckCircleIcon. */
export function CircleCheckFilledIcon(props: IconProps) {
  return <WerkplanIcon {...props} icon="circle-check-gefuellt" />;
}

export function CircleMinusIcon(props: IconProps) {
  return <WerkplanIcon {...props} icon="circle-minus" />;
}

export function CircleDashedIcon(props: IconProps) {
  return <WerkplanIcon {...props} icon="circle-dashed" />;
}

export function CalendarClockIcon(props: IconProps) {
  return <WerkplanIcon {...props} icon="calendar-clock" />;
}

export function HourglassIcon(props: IconProps) {
  return <WerkplanIcon {...props} icon="hourglass" />;
}

export function BanIcon(props: IconProps) {
  return <WerkplanIcon {...props} icon="ban" />;
}

/**
 * Zwei Personen: dieser Lead kam über eine Empfehlung, nicht über den Funnel.
 * Bewusst kein Handschlag und kein Megafon — beide zerfallen bei 15px zu einem
 * Fleck. Die Bedeutung trägt ohnehin das Wort daneben, das Zeichen trägt nur
 * die Wiedererkennung in der Zeile (dieselbe Arbeitsteilung wie beim
 * Browserfenster des Website-Entwurfs).
 */
export function EmpfehlungIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15.5 20v-1.6a3.2 3.2 0 0 0-3.2-3.2H5.7a3.2 3.2 0 0 0-3.2 3.2V20" />
      <circle cx="9" cy="8" r="3.2" />
      <path d="M21.5 20v-1.6a3.2 3.2 0 0 0-2.4-3.1" />
      <path d="M16.5 5.1a3.2 3.2 0 0 1 0 6.2" />
    </Icon>
  );
}

/**
 * Festes Abo-Icon eines Pakets: Radar-Reichweite in drei Stufen (Geometrie und
 * Entscheidung in ./abo-icon.ts). Eigenes <svg> statt `Icon`: das Radar braucht
 * eine eigene Strichstärke und gefüllte Teile, `Icon` zeichnet nur Striche der
 * Stärke 2. Ringe und Mitte nehmen currentColor, damit das Icon auf heller und
 * dunkler Karte gleich liest; nur der Schwenk ist fest Lime. Dekorativ: der
 * Paketname steht als Text daneben, also aria-hidden und kein eigenes Label.
 */
export function AboIcon({ paket, size = 24, ...rest }: IconProps & { paket: Paket }) {
  const stage = aboIconStage(paket);
  const { x: cx, y: cy, r: cr } = ABO_ICON_CENTER;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${ABO_ICON_VIEWBOX} ${ABO_ICON_VIEWBOX}`}
      fill="none"
      aria-hidden="true"
      data-abo-stage={stage}
      style={{ flexShrink: 0 }}
      {...rest}
    >
      <g stroke="currentColor" strokeWidth={ABO_ICON_STROKE_WIDTH} fill="none">
        {ABO_ICON_RING_RADII.map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} opacity={i < stage ? undefined : ABO_ICON_FAINT_OPACITY} />
        ))}
      </g>
      <g transform={`rotate(${ABO_ICON_SWEEP.angle} ${cx} ${cy})`}>
        <rect
          x={cx}
          y={ABO_ICON_SWEEP.y}
          width={ABO_ICON_SWEEP_WIDTHS[paket]}
          height={ABO_ICON_SWEEP.height}
          rx={ABO_ICON_SWEEP.rx}
          fill="var(--lime)"
        />
      </g>
      <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
    </svg>
  );
}
