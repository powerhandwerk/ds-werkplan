# Inventur DS Werkplan 2.0

Stand 27.10.2026 (Paket-Plan Step 1). Diese Datei hält fest, woher jeder Wert des
Pakets kommt, was zwischen Portal und Website abwich und wie es entschieden ist. Der
Admin-Plan `ds-werkplan-fundament` übernimmt die Tabellen für Schriftgrade, Rundungen
und Olivgrün unverändert.

**Quellen.** Portal: `powerhandwerk-admin` auf `origin/main` 09e8c398f (dort
unverändert bis 83d0a5717): `components/werkplan/`, `components/kundenseite/*.module.css`,
`components/ds/{MarkerHighlight,icons,Logo}.tsx`, `lib/care/bericht/werkplan-werte.ts`,
`lib/abo-icon.ts`, `app/globals.css`. Website: `powerhandwerk/keteso` auf `origin/main`
923a5c4, gelesen per `git show`: `powerhandwerk-website/components/werkplan/`,
`powerhandwerk-website/app/globals.css`, `powerhandwerk-website/public/`.

**Regel bei Widerspruch:** Die Kundenseite gewinnt (sie ist mobil getestet und mit
Kunden live). Abweichungen der Website stehen unten als Liste für Phase 2.

## 1. Globale Tokens

| Token | Portal | Website | Entscheidung |
|---|---|---|---|
| `--ink-950` bis `--ink-050` (13 Stufen) | oklch, siehe `src/tokens.ts` | gleich | zehn Stufen übernommen, 700, 150 und 000 ersetzt (Abschnitt 3) |
| `--ink-450` | fehlt | `oklch(0.62 0.010 81)` | nicht übernommen; Website-Stellen in Phase 2 auf 400 oder 500 |
| `--lime`, `--lime-deep`, `--lime-soft`, `--lime-glow` | gleich | gleich | übernommen |
| Olivgrün als Schrift (Portal-Token, `#4c701a`) | vorhanden | fehlt | gestrichen (ADR-261 Nr. 6), Abschnitt 6 |
| `--lime-text` | fehlt | `oklch(0.48 0.12 130)` | gestrichen: dieselbe Farbe wie das Olivgrün, die Sperre gilt auch hier |
| `--danger`, `--danger-ink` | `#ce2324`, `oklch(0.5 0.13 30)` | fehlen | übernommen (Rot nur für Fehler und Löschen) |
| `--focus-ring`, `--focus-ring-on-dark` | `var(--ink-950)`, `var(--lime)` | gleich | übernommen |
| `--font-display`, `--font-body` | gleich | gleich | übernommen |
| `--font-mono` (Spline Sans Mono) | vorhanden | vorhanden | nicht übernommen; bleibt im Portal, bis der letzte Verbraucher umzieht |
| `--font-werkplan` | `.seite` setzt `"Barlow Semi Condensed"` | `next/font` | global in `tokens.css`, gleicher Wert wie im Portal |
| `--grad-*`, `--rund-*` | fehlen | fehlen | neu (Abschnitte 4 und 5) |

Die Flächenrollen `--wp-*` stehen nur in den Flächenklassen (`src/werkplan.module.css`),
nie auf `:root`. Neu auf Papier ist `--wp-blatt: var(--ink-050)`: Die Website setzt es
schon, im Portal fehlte es nur, weil kein Baustein es auf Papier las (kein Widerspruch).

## 2. Werkplan-Klassen: Portal gegen Website

Grundlage ist die Portal-Fassung. Die Website weicht so ab:

| Stelle | Portal | Website | Entscheidung |
|---|---|---|---|
| `.seite` | setzt `--font-werkplan` | biegt `--font-mono` auf Barlow um, `--header-h: 24px` | Portal; der Rest ist Seitenbau der Innungsseite |
| `.innungSeite`, `.sektion`, `.inner`, `.stapel`, `.raster` | fehlen | Layout der Innungsseite | Phase 2 (Seitenlayout, nicht Fundament) |
| `.h1`, `.h2` Größe | setzt die Seite | `clamp(2.4rem, 1.2rem + 3.2vw, 4.1rem)`, `clamp(36px, 5.5vw, 64px)` | Portal; Größe bleibt Sache der Seite |
| `.h3` | vorhanden | fehlt | Portal |
| `.lead` | `clamp(17px, 2vw, 20px)` | `clamp(18px, 2vw, 20px)` | `--grad-18` fest (Tabelle Abschnitt 4) |
| `.messwert` Größe | setzt die Seite | `clamp(64px, 11vw, 128px)` | Portal; `.messwertEinheit` der Website in Phase 2 |
| `.quelle` | 12 px | 12 px, ab 768 px 13 px | Portal: `--grad-12` |
| `.quelle strong` | `font-weight: 600` | ohne | Portal |
| `.textlink` | `border: 0`, `background-color`, `cursor`, `:disabled` | ohne | Portal (Knopf-tauglich) |
| `.linkImText` | fehlt | Link im Fließtext | Phase 2 |
| `.plankopf` | 2 Spalten, 1-px-Fugen per `gap`, Feldfläche `--ink-050`, `.plankopfBreit` | 4 Spalten ab 640 px, Linien per Rand | Portal (Entwurf „Plan-Blatt“) |
| `.plankopfWert` | 15 px, Sperrung .02em, normale Schreibung | 13 px, .06em, Versalien | Portal: `--grad-16`, .02em, normale Schreibung |
| `.massbalkenFuellung` | Übergang 180 ms | einmalige Zeichen-Animation 900 ms | Portal |
| `.teilung` | vorhanden (Maßkette) | fehlt | Portal |
| `lichtkante.module.css` `.lk:focus-visible` | `var(--focus-ring-on-dark)` | `var(--lime)` | Portal (gleicher Wert über die Rolle) |
| `LichtkanteButton` | `extern`, `onClick`, Icons aus dem Paket | eigener Pfeil | Portal |
| `Plankopf` | `untergrund` mit Standard, `className`, `anhang`, Feld `breit` | nur `felder`, `untergrund` | Portal |
| `BlattZeile` | `nr` optional (Zahl), nur Papier | `nr` Pflicht (Text), Papier und Nacht | Portal; Nacht-Variante in Phase 2 |

## 3. Ink-Stufen 700, 150 und 000

Die Rampe hat zehn Stufen (950, 900, 800, 600, 500, 400, 300, 200, 100, 050). Die
drei übrigen Stufen ersetzt eine Mischung aus zwei Nachbarstufen, ohne sichtbare
Änderung (gemessen mit der oklch-Rechnung aus `src/tokens.ts`, sRGB 0 bis 255):

| Stufe | Stellen im Paket | Ersatz | Abweichung |
|---|---|---|---|
| `--ink-700` `#3e3a34` | `lichtkante.module.css` `--lk-sub`; `arbeitsflaeche.module.css` `.infoGross`, `.zeileUnterHaken`, `.kastenUnter` | `color-mix(in oklch, var(--ink-800) 55%, var(--ink-600))` | höchstens 1 je Kanal |
| `--ink-150` `#eae8e3` | `bausteine.module.css` `.ruhig:hover`; `arbeitsflaeche.module.css` `.iconKnopf:hover` | `color-mix(in oklch, var(--ink-100), var(--ink-200))` | höchstens 2 je Kanal |
| `--ink-000` | keine | entfällt | |

`test/tokens.test.ts` hält beide Abweichungen fest. Im Portal bleiben die drei Stufen
in `app/globals.css`, bis kein Bereich sie mehr nutzt (Kundenseite: Ink-150 an 16
Stellen, Ink-700 an einer; Phase 1b und 2).

## 4. Schriftgrade

Acht Grade von 12 bis 64 plus die Messwert-Stufe 80: `--grad-12`, `-14`, `-16`, `-18`,
`-24`, `-32`, `-48`, `-64`, `-80`. Fließende Überschriften behalten ihre vw-Mitte, nur
die Endpunkte liegen auf Graden.

### Kundenseite (121 Angaben, für den Admin-Plan Step 3)

| Wert heute | Stellen | Neu | Änderung |
|---|---:|---|---|
| `11px` | 2 | `var(--grad-12)` | +1 px |
| `11.5px` | 2 | `var(--grad-12)` | +0,5 px |
| `12px` | 2 | `var(--grad-12)` | gleich |
| `13px` | 8 | `var(--grad-14)` | +1 px |
| `14px` | 22 | `var(--grad-14)` | gleich |
| `14.5px` | 2 | `var(--grad-14)` | -0,5 px |
| `15px` | 38 | `var(--grad-16)` | +1 px |
| `16px` | 10 | `var(--grad-16)` | gleich |
| `17px` | 5 | `var(--grad-18)` | +1 px |
| `18px` | 2 | `var(--grad-18)` | gleich |
| `19px` | 2 | `var(--grad-18)` | -1 px |
| `20px` | 1 | `var(--grad-18)` | -2 px |
| `24px` | 1 | `var(--grad-24)` | gleich |
| `26px` | 2 | `var(--grad-24)` | -2 px |
| `30px` | 3 | `var(--grad-32)` | +2 px |
| `32px` | 2 | `var(--grad-32)` | gleich |
| `34px` | 3 | `var(--grad-32)` | -2 px |
| `36px` | 2 | `var(--grad-32)` | -4 px |
| `42px` | 1 | `var(--grad-48)` | +6 px |
| `44px` | 2 | `var(--grad-48)` | +4 px |
| `54px` | 2 | `var(--grad-48)` | -6 px |
| `76px` | 1 | `var(--grad-80)` | +4 px |
| `84px` | 2 | `var(--grad-80)` | -4 px |
| `clamp(32px, 3.4vw, 42px)` | 1 | `clamp(var(--grad-32), 3.4vw, var(--grad-48))` | Endpunkte auf Grade, vw-Mitte bleibt |
| `clamp(38px, 11.8vw, 52px)` | 1 | `clamp(var(--grad-32), 11.8vw, var(--grad-48))` | Endpunkte auf Grade, vw-Mitte bleibt |
| `clamp(38px, 11vw, 56px)` | 1 | `clamp(var(--grad-32), 11vw, var(--grad-48))` | Endpunkte auf Grade, vw-Mitte bleibt |
| `clamp(42px, 4.6vw, 64px)` | 1 | `clamp(var(--grad-48), 4.6vw, var(--grad-64))` | Endpunkte auf Grade, vw-Mitte bleibt |

Drei bewusste Abweichungen der fließenden Überschriften, in der Sichtprüfung gezielt
ansehen: `.rundgangTitel` bei 1440 px 48 statt 42 px; `.titel` und `.titelKopf` am
Handy mindestens 32 statt 38 px und höchstens 48 statt 56 bzw. 52 px; `.titelKopf` ab
1024 px mindestens 48 statt 42 px.

### Paket-CSS (35 Angaben, umgesetzt in Step 4)

| Wert heute | Stellen | Neu | Änderung |
|---|---:|---|---|
| `10px` | 1 | `var(--grad-12)` | +2 px |
| `11px` | 5 | `var(--grad-12)` | +1 px |
| `12px` | 2 | `var(--grad-12)` | gleich |
| `13px` | 6 | `var(--grad-14)` | +1 px |
| `14px` | 11 | `var(--grad-14)` | gleich |
| `15px` | 4 | `var(--grad-16)` | +1 px |
| `16px` | 5 | `var(--grad-16)` | gleich |
| `clamp(17px, 2vw, 20px)` | 1 | `var(--grad-18)` | fester Grad statt fließend |

## 5. Rundungen

Vier Rollen: **eckig** (`--rund-eckig`, 0) für Kästen, Karten, Bilder, Listen;
**fein** (`--rund-fein`, 2 px) für Etikett, Eingabefeld, Fokusrahmen; **Kreis**
(`--rund-kreis`) für Punkte, Avatare und Pillen ohne feste Höhe; **Pille** für Knöpfe
und Chips mit fester Höhe: `calc(<Höhe>px * var(--rund-pille-faktor))`, die Form der
Pille im Logo (Faktor 0,433).

`--rund-kreis` ist `999px`, nicht `50 %`: Prozent bezieht sich auf Breite und Höhe
getrennt und macht aus einem breiten Chip eine Ellipse (dieselbe Falle wie beim Marker,
keteso-Wegweiser). An einem Quadrat ergibt `999px` denselben Kreis wie `50 %`.

### Kundenseite (46 Angaben, für den Admin-Plan Step 4)

| Stelle | Selektor | heute | Rolle | neu |
|---|---|---|---|---|
| `erscheinungsbild:62` | `.inhaltListe a` | `18px` | Pille ohne feste Höhe | `var(--rund-kreis)` |
| `erscheinungsbild:132` | `@media (min-width: 1024px) › .inhaltListe a` | `0` | Liste (ab 1024 px) | `var(--rund-eckig)` |
| `erscheinungsbild:454` | `.dontX` | `50%` | Punkt | `var(--rund-kreis)` |
| `erscheinungsbild:571` | `.richtwert, .chip` | `10px` | Chip ohne feste Höhe | `var(--rund-kreis)` |
| `erscheinungsbild:580` | `.chip` | `14px` | Chip ohne feste Höhe | `var(--rund-kreis)` |
| `feldraster:140` | `.ring` | `50%` | Punkt | `var(--rund-kreis)` |
| `feldraster:151` | `.lampe` | `50%` | Punkt | `var(--rund-kreis)` |
| `google-aktionen:63` | `.foto` | `6px` | Bild | `var(--rund-eckig)` |
| `google-aktionen:72` | `.entwurf` | `6px` | Kasten | `var(--rund-eckig)` |
| `google-aktionen:114` | `.knopf` | `999px` | Knopf, Höhe 44 px | `calc(44px * var(--rund-pille-faktor))` |
| `google-aktionen:194` | `.feld` | `6px` | Eingabefeld | `var(--rund-fein)` |
| `google-aktionen:223` | `.wortlaut` | `6px` | Kasten | `var(--rund-eckig)` |
| `google-aktionen:254` | `.zustimmung` | `6px` | Kasten | `var(--rund-eckig)` |
| `google-aktionen:316` | `.ablage` | `4px` | Kasten (Ablagefläche) | `var(--rund-eckig)` |
| `google-aktionen:419` | `.auswahlBild` | `6px` | Bild | `var(--rund-eckig)` |
| `google-aktionen:459` | `.fotosMeldung` | `6px` | Kasten | `var(--rund-eckig)` |
| `google-aktionen:495` | `.rueckmeldung` | `6px` | Kasten | `var(--rund-eckig)` |
| `google-aktionen:512` | `.auszugFoto` | `4px` | Bild | `var(--rund-eckig)` |
| `google-suche:25` | `.gemessen::before` | `50%` | Punkt | `var(--rund-kreis)` |
| `ki-sichtbarkeit:162` | `.zeichen` | `5px` | Etikett (Zeichen 18 px) | `var(--rund-fein)` |
| `kundenseite:208` | `.ziffer` | `8px` | Eingabefeld (Ziffer) | `var(--rund-fein)` |
| `kundenseite:304` | `.plakette` | `4px` | Kasten (Plakette) | `var(--rund-eckig)` |
| `kundenseite:376` | `.bestaetigt` | `6px` | Kasten | `var(--rund-eckig)` |
| `kundenseite:423` | `.chip` | `11px` | Chip ohne feste Höhe | `var(--rund-kreis)` |
| `kundenseite:438` | `.kleinKnopf` | `22px` | Knopf, Höhe 44 px | `calc(44px * var(--rund-pille-faktor))` |
| `kundenseite:489` | `.hinweis` | `6px` | Kasten | `var(--rund-eckig)` |
| `kundenseite:625` | `@media (min-width: 768px) › .pille` | `22px` | Knopf, Höhe 44 px | `calc(44px * var(--rund-pille-faktor))` |
| `kundenseite:980` | `.auszug` | `6px` | Kasten | `var(--rund-eckig)` |
| `kundenseite:1091` | `.offenZeile` | `0` | Listenzeile | `var(--rund-eckig)` |
| `kundenseite:1237` | `.haken` | `9.5px` | Kästchen, Höhe 22 px (heute schon 0,433 × 22) | `calc(22px * var(--rund-pille-faktor))` |
| `kundenseite:1316` | `.kaestchenVoll, .kaestchenLeer` | `2px` | Etikett (Kästchen 14 px) | `var(--rund-fein)` |
| `kundenseite:1392` | `.sicherFuss` | `6px` | Kasten | `var(--rund-eckig)` |
| `kundenseite:1494` | `.bandMarke` | `5px` | Etikett | `var(--rund-fein)` |
| `kundenseite:1519` | `.bandChip` | `999px` | Chip ohne feste Höhe | `var(--rund-kreis)` |
| `kundenseite:1561` | `.platzhalter` | `4px` | Ladebalken | `var(--rund-fein)` |
| `kundenseite:1636` | `.menueKnopf` | `22px` | Knopf, Höhe 44 px | `calc(44px * var(--rund-pille-faktor))` |
| `kundenseite:1649` | `.menueZahl` | `11px` | Zähler, Höhe 22 px | `calc(22px * var(--rund-pille-faktor))` |
| `kundenseite:1926` | `.bereichHinweis` | `6px` | Kasten | `var(--rund-eckig)` |
| `kundenseite:2022` | `.kachelBild` | `6px` | Bild | `var(--rund-eckig)` |
| `kundenseite:2166` | `.fehlerFeld` | `6px` | Eingabefeld | `var(--rund-fein)` |
| `kundenseite:2461` | `.rundgangGriff` | `2px` | Griff | `var(--rund-fein)` |
| `kundenseite:2625` | `.neuigkeitMarke` | `50%` | Punkt | `var(--rund-kreis)` |
| `kundenseite:2736` | `.neuigkeitenPop::after` | `50%` | Punkt | `var(--rund-kreis)` |
| `zugaenge:75` | `.knopf` | `22px` | Knopf, Höhe 44 px | `calc(44px * var(--rund-pille-faktor))` |
| `zugaenge:158` | `.fehlt::before` | `50%` | Punkt | `var(--rund-kreis)` |
| `zugaenge:189` | `.knopfKompakt` | `16px` | Knopf, Höhe 32 px | `calc(32px * var(--rund-pille-faktor))` |

### Paket-CSS (18 Angaben, umgesetzt in Step 4)

| Stelle | Selektor | heute | Rolle | neu |
|---|---|---|---|---|
| `werkplan:190` | `.textlink` | `2px` | Textlink, Fokusrahmen | `var(--rund-fein)` |
| `bausteine:31` | `.lkKlein.lkKlein > span:last-child` | `calc(28px * 0.433)` | Chip der kleinen Lichtkante, 28 px | `calc(28px * var(--rund-pille-faktor))` |
| `bausteine:72` | `.ruhig, .fest.fest` | `calc(var(--kn-h) * 0.433)` | Knopf, Höhe --kn-h | `calc(var(--kn-h) * var(--rund-pille-faktor))` |
| `bausteine:146` | `.etikett` | `3px` | Etikett | `var(--rund-fein)` |
| `bausteine:200` | `.band` | `4px` | Hinweisband (Kasten) | `var(--rund-eckig)` |
| `bausteine:243` | `.kappe` | `3px` | Tastenkappe (Etikett) | `var(--rund-fein)` |
| `bausteine:268` | `.toast` | `6px` | Toast (Kasten) | `var(--rund-eckig)` |
| `bausteine:278` | `.toastHaken` | `50%` | Punkt | `var(--rund-kreis)` |
| `lichtkante:71` | `.lk` | `calc(var(--lk-h) * 0.433)` | Lichtkante, Höhe --lk-h | `calc(var(--lk-h) * var(--rund-pille-faktor))` |
| `lichtkante:110` | `.lk::before` | `inherit` | Licht innen, erbt | `inherit` |
| `lichtkante:140` | `.chip` | `calc(38px * 0.433)` | Chip, 38 px | `calc(38px * var(--rund-pille-faktor))` |
| `arbeitsflaeche:94` | `.filter` | `4px` | Filterleiste, Höhe 44 px (Knopf 36 + 2 × 3 Polster + 2 × 1 Rand) | `calc(44px * var(--rund-pille-faktor))` |
| `arbeitsflaeche:107` | `.filterKnopf` | `3px` | Filterknopf, Höhe 36 px | `calc(36px * var(--rund-pille-faktor))` |
| `arbeitsflaeche:271` | `.detail` | `4px` | Detail-Rahmen (Kasten) | `var(--rund-eckig)` |
| `arbeitsflaeche:289` | `.iconKnopf` | `4px` | Icon-Knopf, 32 px | `calc(32px * var(--rund-pille-faktor))` |
| `arbeitsflaeche:364` | `.kasten` | `4px` | Kasten | `var(--rund-eckig)` |
| `arbeitsflaeche:373` | `.kastenIcon` | `15px` | Icon im Kasten, 36 px (heute schon 0,42 × 36) | `calc(36px * var(--rund-pille-faktor))` |
| `arbeitsflaeche:420` | `.schrittNr` | `50%` | Schrittnummer (Punkt) | `var(--rund-kreis)` |

## 6. Olivgrün

Gestrichen (ADR-261 Nr. 6). Lime gibt es nur als Fläche mit dunkler Schrift darauf
(Etikett `lead`, Punkt, Unterstrich); Lime als Schrift auf Nacht bleibt erlaubt.

**Im Paket:** keine Stelle. `test/olivgruen.test.ts` sperrt Hex-Wert, den alten
Token-Namen und `--lime-text` der Website in `src/`, `fonts/`, `assets/`,
`artifact/project/` und `test/`.

**Kundenseite (17 Stellen, für den Admin-Plan Step 5):**

| Stelle | Selektor | heute | Ersatzrolle |
|---|---|---|---|
| `google-aktionen:126` | `.knopf:focus-visible` | Fokusrahmen | `var(--wp-fokus)` |
| `google-aktionen:172` | `.aufklapp > summary:focus-visible` | Fokusrahmen | `var(--wp-fokus)` |
| `google-aktionen:201` | `.feld:focus-visible` | Fokusrahmen | `var(--wp-fokus)` |
| `google-aktionen:331` | `.ablage:focus-visible` | Fokusrahmen | `var(--wp-fokus)` |
| `google-aktionen:451` | `.auswahlEntfernen:focus-visible` | Fokusrahmen | `var(--wp-fokus)` |
| `google-aktionen:144` | `.ohneFunktion` | gestrichelter Rahmen | `var(--wp-gedaempft)` |
| `google-aktionen:300` | `.standErledigt` | Schrift | `var(--wp-stark)` mit Lime-Punkt davor |
| `kundenseite:1765` | `.blickListe .standHervor` | Schrift | `var(--wp-stark)` mit Lime-Punkt davor |
| `kundenseite:1915` | `.positionErledigt` | Schrift | `var(--wp-stark)` mit Lime-Punkt davor |
| `zugaenge:132` | `.meldung` | Rand links 3 px | Lime-Fläche: `border-left` in `var(--lime)` |
| `zugaenge:133` | `.meldung` | Hintergrund 8 % | helle Lime-Wäsche, etwa `color-mix(in oklch, var(--lime) 18%, transparent)`; Feinwert in der Sichtprüfung, Schrift bleibt `var(--wp-stark)` |
| `zugaenge:151` | `.fehlt` | Schrift | `var(--wp-stark)`; der Punkt `.fehlt::before` (heute `currentColor`) wird `var(--lime)` |
| `feldraster:73` | `.wartet` | Schrift | `var(--wp-stark)` |
| `feldraster:103` | `.leuchtet .zahl` | Schrift | `var(--wp-stark)`, Leuchten über Lime-Fläche |
| `feldraster:129` | `.leuchtet .unterzeile` | Schrift | `var(--wp-stark)` |
| `feldraster:158` | `@keyframes puls 0 %, 100 %` | Schatten | `var(--lime-glow)` mit 0 px Ausdehnung |
| `feldraster:161` | `@keyframes puls 50 %` | Schatten | `0 0 0 4px var(--lime-glow)` |

Übriger Portal-Bestand (Stand 27.10.2026 laut Admin-Plan: 42 Dateien mit 84 Zeilen außerhalb
der Kundenseite, darunter PDFs und die Token-Seiten) friert der Admin-Plan per
Sperr-Test ein; er darf nur schrumpfen.

## 7. Schriften und Marken

- **Schriften:** die vier Dateien aus `powerhandwerk-admin/public/fonts/`, byte-gleich
  (der Admin-Plan prüft das per Test). Spline Sans Mono kommt nicht ins Paket.
- **Lizenztexte:** `fonts/OFL-barlow-semi-condensed.txt` aus `keteso/powerhandwerk-fonts/`;
  für Big Shoulders Display und Hanken Grotesk derselbe OFL-1.1-Text mit der
  Copyright-Zeile aus dem name-Table der jeweiligen Schriftdatei (gleich wie in
  `powerhandwerk-website/public/fonts/LICENSES.txt`).
- **Marken:** `logo-powerhandwerk.svg` und `pin.svg` aus `.ds-staging-3c4926/assets/`
  (gleich in Portal und Website). `logo-powerhandwerk-dark.svg` ist die freigestellte
  Fassung ohne schwarzen Block, wie Portal (`public/`, PR #32) und Website sie zeigen;
  unter diesem Namen liegt in `.ds-staging-3c4926/assets/` noch die alte Fassung mit
  Block, die freigestellte heißt dort `logo-powerhandwerk-dark-freigestellt.svg`
  (inhaltsgleich bis auf Leerzeilen).

## 8. Website-Abweichungen für Phase 2

1. `--ink-450` an den Website-Stellen auf 400 oder 500 ziehen.
2. `--lime-text` (Olivgrün) streichen, Hervorhebung über Lime-Fläche.
3. `.h1`, `.h2`, `.messwert` mit eigener Größe: als Seitengrößen auf Grade legen.
4. `.lead` 18 bis 20 px fließend auf `--grad-18`.
5. `.quelle` ab 768 px 13 px: auf `--grad-12` oder `--grad-14` entscheiden.
6. `.plankopf` mit vier Spalten und Versalien gegen den Entwurf „Plan-Blatt“ abwägen.
7. `.massbalkenFuellung` mit Zeichen-Animation: als Variante ins Paket oder Übergang.
8. `.linkImText`, `.messwertEinheit`, Layout-Klassen (`.sektion`, `.inner`, `.stapel`,
   `.raster`) als Verkaufs- und Seitenbausteine ins Paket heben, wenn eine Seite sie braucht.
9. `BlattZeile` auf Nacht und mit Text-Nummer.
10. Website importiert das Paket statt ihrer Kopie unter `components/werkplan/`.

## 9. Offen für Phase 1b

Beim Aufräumen des Pakets bewusst nicht gelöst (Paket soll in Phase 1 nur heben):

1. Feste Farbwerte der gehobenen Bausteine als Tokens: Weiß der Eingabefelder und
   Karten (`#fff`), Warnfläche (`oklch(0.96 0.025 55)`), Fehler auf Nacht (`#ff9b8f`),
   Schatten der Lichtkante, des Toasts und des Menüs. Bis dahin friert
   `test/css-regeln.test.ts` den Bestand je Datei ein.
2. `@keyframes marker-wisch` ins Paket; heute liefert sie das Portal (`app/globals.css`),
   ohne sie wischt der Marker mit `animate` nicht ein.
3. Kapitelleiste: Seitenluft (`-20px`, `-32px`, `top: 24px`) als Variable statt fest
   aus der Kundenseite; Scroll-Messung pro Bild bündeln.
4. Reiter: Die Menütafel braucht eine positionierte Zeile der App; als Hülle ins Paket
   ziehen, wenn die Website den Reiter nutzt.
5. Flächen- und Typo-Klassen aus `src/tokens.ts` erzeugen statt per Test abgleichen.

