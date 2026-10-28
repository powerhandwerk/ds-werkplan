Der Kopieren-Knopf zeigt einen Wert sichtbar an und kopiert ihn auf Knopfdruck in die Zwischenablage.

## Wann

- Für Werte, die ein Betrieb einfügen oder abschreiben muss, etwa die Adresse eines Dienstkontos auf der Seite Zugänge.
- Der Wert steht neben dem Knopf und bleibt ohne Zwischenablage abtippbar.
- Nach dem Kopieren zeigt der Knopf 2,5 s lang „Kopiert“; die Ansage läuft über eine Live-Region.
- Scheitert das Kopieren, steht der Wert zusätzlich in einem Feld zum Markieren.
- `kompakt` setzt Wert und Knopf in eine Zeile, den Wert ohne Rahmen und den Knopf als kleine Pille.
- Die Standardtexte sind in Sie-Form (`KOPIEREN_TEXTE`). Client-Komponente.

## Was der Verbraucher liefert

| Prop | Typ | Standard | Bedeutung |
|---|---|---|---|
| `wert` | `string` | Pflicht | Der Text, der kopiert wird. |
| `label` | `string` | ohne | Name des Werts; benennt Wert und Knopf („Anschrift: Kopieren“). |
| `zusatz` | `string` | ohne | Hängt versteckt an den Knopftext an („Kopieren Satz 2“) und ersetzt den Namen aus `label` am Knopf. |
| `ohneFunktion` | `boolean` | `false` | Sperrt den Knopf, Hinweis „In der Kundenansicht ohne Funktion“. |
| `kompakt` | `boolean` | `false` | Wert und Knopf in einer Zeile. |
| `texte` | `KopierenTexte` | `KOPIEREN_TEXTE` | Alle Texte des Knopfs. |

Import aus `@powerhandwerk/ds-werkplan/KopierenKnopf`, im Bündel `DsWerkplan.KopierenKnopf`.

## Was man lässt

- Den Wert verstecken: Er bleibt neben dem Knopf sichtbar.
- Mehrere Kopieren-Knöpfe mit gleichem Namen auf einer Seite; `zusatz` unterscheidet sie.
