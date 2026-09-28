import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'electronic-digital-wet-signatures',
    title: 'Elektronische, digitale und handschriftliche Unterschriften',
    summary: 'Drei Dinge, die man „Unterschrift“ nennt, und welches davon diese App erstellt.',
    group: 'Grundlagen',
    body: `Mit dem Wort „Unterschrift“ sind ganz unterschiedliche Dinge gemeint. Es hilft, sie auseinanderzuhalten.

## Die handschriftliche Unterschrift

Das ist die klassische Unterschrift: Sie schreiben Ihren Namen mit Tinte auf Papier. Im Englischen spricht man von einer „nassen“ Unterschrift, weil die Tinte auf dem Blatt noch feucht ist.

## Die elektronische Signatur

Eine elektronische Signatur ist jede elektronische Möglichkeit, Ihr Einverständnis mit einem Dokument zu zeigen. Das kann ganz einfach ein Bild Ihrer handschriftlichen Unterschrift auf einem PDF sein, ein getippter Name oder ein Häkchen auf einer Website. Viele Länder erkennen elektronische Signaturen für eine breite Palette alltäglicher Vereinbarungen an. Für manche Dokumente, etwa im Immobilien-, Familien- oder Gerichtsbereich, können jedoch zusätzliche Regeln gelten.

## Die digitale Signatur

Eine digitale Signatur ist eine bestimmte technische Art der elektronischen Signatur. Sie versiegelt das Dokument mithilfe von Kryptografie und einem Zertifikat, das meist von einer vertrauenswürdigen Stelle ausgestellt wird. Ändert später jemand die Datei, kann Software wie ein PDF-Reader das erkennen und die Signatur als ungültig anzeigen.

## Was Universal Signatures erstellt

Universal Signatures erstellt **elektronische Signaturen**. Die App setzt ein Bild Ihrer gezeichneten oder getippten Unterschrift auf eine Seite eines PDFs. Eine zertifikatsbasierte digitale Signatur fügt sie der Datei nicht hinzu.

Wenn Sie ein Signaturzertifikat hinzufügen (siehe „Signaturzertifikate und überprüfbare Einträge“), erhalten Sie zusätzlich einen unabhängigen Eintrag mit dem Fingerabdruck des Dokuments. Damit lässt sich später leichter zeigen, dass eine Datei die ist, die Sie unterschrieben haben. Das ist ein nützlicher Nachweis, aber nicht dasselbe wie eine zertifikatsbasierte digitale Signatur.

## Ein Hinweis zur Rechtslage

Ob eine elektronische Signatur ausreicht, hängt davon ab, wo Sie sich befinden, um welches Dokument es geht und was die anderen Beteiligten akzeptieren. Dies sind allgemeine Informationen und keine Rechtsberatung. Wenn ein Dokument wirklich wichtig ist, klären Sie, was der Empfänger akzeptiert, oder fragen Sie eine fachkundige Beratung.`,
  },
  {
    id: 'signature-image-formats',
    title: 'Warum Ihre Unterschrift ein transparentes PNG ist',
    summary: 'Bildformate erklärt, und warum Transparenz bei einer Unterschrift wichtig ist.',
    group: 'Grundlagen',
    body: `Jede Unterschrift, die Sie in dieser App erstellen, ob gezeichnet, getippt oder auf dem Handy gezeichnet, wird in ein PNG-Bild mit transparentem Hintergrund umgewandelt. Hier ist der Grund.

## Pixel und Formate

Ein digitales Bild ist ein Raster aus winzigen farbigen Quadraten, den Pixeln. Ein Bildformat ist einfach eine vereinbarte Art, dieses Raster in einer Datei zu speichern. Die gängigsten sind:

- **JPEG** ist für Fotos gedacht. Es macht Dateien klein, indem es Details weglässt, die dem Auge kaum auffallen. Es kennt keine Transparenz, jedes Pixel hat also eine volle Farbe, rund um eine Unterschrift meist Weiß.
- **PNG** speichert jedes Pixel genau so, wie es war („verlustfrei“), und unterstützt Transparenz, sodass Pixel ganz oder teilweise durchsichtig sein können.
- **WebP** ist ein neueres Format, das beide Arten der Kompression beherrscht und ebenfalls Transparenz unterstützt, aber ältere Software kommt nicht immer damit zurecht.

## Warum Transparenz wichtig ist

Dokumente sind selten rein weiß. Genau dort, wo Sie unterschreiben möchten, kann eine Unterschriftslinie, ein schattiertes Feld, ein Formularfeld oder gedruckter Text sein. Eine JPEG-Unterschrift läge als weißes Rechteck darüber und würde alles darunter verdecken. Ein transparentes PNG lässt nur die Tinte übrig, und die Seite bleibt rund um die Striche sichtbar, genau wie bei einem Stift.

## Warum verlustfrei wichtig ist

Unterschriften bestehen aus dünnen Linien mit scharfen Kanten. Die JPEG-Kompression lässt solche Kanten gern verschwimmen und hinterlässt leichte Schlieren. PNG hält die Linien scharf.

## Auch getippte Unterschriften werden zu Bildern

Wenn Sie Ihren Namen tippen, schreibt die App ihn in der gewählten Schreibschrift und speichert das Ergebnis als PNG. So sieht eine getippte Unterschrift auf jedem Computer gleich aus, der das PDF öffnet, auch wenn die Schrift dort nicht installiert ist.`,
  },
  {
    id: 'how-signing-works',
    title: 'Was beim Unterschreiben eines PDFs passiert',
    summary: 'Alles geschieht in Ihrem Browser, und das Dokument wird nie hochgeladen.',
    group: 'So funktioniert es',
    body: `Das Unterschreiben eines PDFs mit Universal Signatures geschieht vollständig in Ihrem Webbrowser, auf Ihrem eigenen Gerät.

## Die Schritte

1. Sie erstellen eine Unterschrift, indem Sie sie mit Maus, Finger oder Stift zeichnen, Ihren Namen in einer Schreibschrift tippen oder sie auf Ihrem Handy zeichnen.
2. Sie wählen ein PDF. Ihr Browser liest die Datei und zeigt ihre Seiten an, ohne sie irgendwohin zu senden.
3. Sie wählen Seite, Position und Größe. Sie können die Unterschrift an einer Ecke, an einem Rand oder in der Mitte ausrichten oder eine genaue Stelle in einer Vorschau der Seite wählen.
4. Wenn Sie einen Namen, ein Datum oder eine Uhrzeit hinzugefügt haben, können Sie diese unter die Unterschrift setzen.
5. Die App setzt das Bild der Unterschrift auf die Seite und bietet Ihnen eine neue Datei zum Speichern an, deren Name um „-signed“ ergänzt ist.

Ihre Originaldatei bleibt unverändert. Die unterschriebene Kopie ist eine neue Datei.

## Es funktioniert offline

Da das Unterschreiben keinen Server braucht, können Sie ein PDF auch ohne Internetverbindung unterschreiben. Nur die optionalen Extras brauchen eine Verbindung: eine Unterschrift in der Cloud speichern, auf dem Handy unterschreiben und ein Signaturzertifikat hinzufügen.

## Was die App kann und was nicht

- Sie setzt ein Bild Ihrer Unterschrift auf eine Seite des Dokuments. Sie füllt keine Formularfelder aus und fügt keine Dokumente zusammen.
- Sie sperrt das PDF nicht. Wer die passende Software hat, könnte die unterschriebene Kopie weiterhin bearbeiten. Ein Signaturzertifikat speichert einen Fingerabdruck des nicht unterschriebenen Originals. Damit lässt sich später zeigen, welches Dokument Sie unterschrieben haben, Änderungen an der unterschriebenen Kopie erkennt es aber nicht.
- Getippte Unterschriften verwenden eine der eingebauten Schreibschriften oder eine Schriftdatei, die Sie selbst importieren. Eine importierte Schrift wird nur auf Ihrem Gerät und nur in dieser Sitzung verwendet.

## Tipps

- Unterschreiben Sie mit einem ruhigen Strich. Sie können jederzeit auf „Clear“ tippen und es erneut versuchen.
- Verwenden Sie den Größenregler statt der Seitenvergrößerung, damit die Unterschrift im Verhältnis zum Dokument bleibt.
- Bewahren Sie das nicht unterschriebene Original auf, wenn Sie ein Signaturzertifikat hinzufügen möchten. Der Fingerabdruck im Zertifikat beschreibt genau dieses Original.`,
  },
  {
    id: 'sign-on-your-phone',
    title: 'Auf dem Handy unterschreiben',
    summary: 'Wie QR-Code und PIN eine Unterschrift vom Handy auf den Computer bringen.',
    group: 'So funktioniert es',
    body: `Mit der Maus zu unterschreiben ist umständlich. Beim Unterschreiben auf dem Handy nutzen Sie Ihren Finger auf dem Touchscreen, während das Dokument auf Ihrem Computer bleibt.

## So funktioniert es

1. Wählen Sie auf Ihrem Computer die Handy-Option. Die App zeigt einen QR-Code und eine 6-stellige PIN.
2. Scannen Sie den QR-Code mit der Kamera Ihres Handys. Im Browser des Handys öffnet sich eine Unterschriftsseite.
3. Geben Sie die PIN auf dem Handy ein und zeichnen Sie Ihre Unterschrift.
4. Die Unterschrift erscheint auf Ihrem Computer und ist sofort einsatzbereit.

## Wie die Unterschrift übertragen wird

Ihr Handy und Ihr Computer können nicht direkt miteinander sprechen. Deshalb gelangt das Bild der Unterschrift über das Internet durch ein Live-Relay auf den Computer. Das Relay leitet die Nachricht weiter, sobald sie ankommt. Sie wird nicht in einer Datenbank gespeichert, und es funktioniert gleich, ob Sie angemeldet sind oder nicht.

Nur das Bild der Unterschrift nimmt diesen Weg. Das PDF bleibt die ganze Zeit auf Ihrem Computer.

## Was die Übertragung schützt

- Der QR-Code enthält einen zufälligen Einmalcode, der schwer zu erraten ist. Nur wer Ihren Bildschirm sieht, kann die richtige Seite öffnen.
- Ihr Computer nimmt nur eine Unterschrift an, die die PIN von seinem eigenen Bildschirm trägt. Alles andere wird ignoriert.
- Wenn Sie neu beginnen möchten, können Sie einen neuen QR-Code und eine neue PIN anfordern.

Behandeln Sie QR-Code und PIN wie jeden kurzlebigen Code: Teilen Sie kein Foto Ihres Bildschirms, solange sie angezeigt werden.`,
  },
  {
    id: 'signing-certificates',
    title: 'Signaturzertifikate und überprüfbare Einträge',
    summary: 'Was die optionale Zertifikatsseite und der QR-Code festhalten, und was sie belegen.',
    group: 'So funktioniert es',
    body: `Wenn Sie mit einer Universal ID angemeldet sind, können Sie vor dem Unterschreiben **Add a signing certificate** (Signaturzertifikat hinzufügen) ankreuzen. Das ist optional und kostenlos.

## Was Sie erhalten

- Eine **Zertifikatsseite** am Ende des unterschriebenen PDFs.
- Einen kleinen **QR-Code** neben Ihrer Unterschrift mit der Beschriftung „Scan to verify“.
- Einen **Eintrag** auf unseren Servern, den jeder mit dem Link abrufen kann.

## Was der Eintrag enthält

- Die E-Mail-Adresse Ihrer Universal ID.
- Den ursprünglichen Dateinamen.
- Einen SHA-256-Fingerabdruck (einen „Hash“) des Dokuments, wie es vor Ihrer Unterschrift war.
- Den Zeitpunkt, zu dem der Eintrag angelegt wurde, nach der Uhr unseres Servers.

Das Dokument selbst wird nie hochgeladen. Ein Hash ist eine kurze Folge aus Buchstaben und Ziffern, die aus dem Inhalt der Datei berechnet wird. Dieselbe Datei ergibt immer denselben Hash, eine Datei, die sich um nur ein Zeichen unterscheidet, einen völlig anderen, und aus dem Hash lässt sich die Datei nicht wiederherstellen.

## Die Zertifikatsseite

Die Seite trennt Angaben, die unser Server festgehalten hat (Ihre bestätigte E-Mail-Adresse, der Zeitpunkt, die Zertifikats-ID), von Angaben, die Ihr eigenes Gerät gemeldet hat (seine Uhrzeit und seine Zeitzone). Die zweite Gruppe ist als Selbstauskunft gekennzeichnet, weil sich die Uhr eines Computers beliebig einstellen lässt. Es wird kein Standort erfasst.

## Ein Dokument prüfen

Wer den QR-Code scannt oder den auf der Zertifikatsseite gedruckten Link öffnet, sieht den Eintrag: wer unterschrieben hat, den Dateinamen, wann der Eintrag angelegt wurde und den Fingerabdruck. Um zu bestätigen, dass eine Kopie die unterschriebene ist, berechnen Sie den SHA-256-Hash des nicht unterschriebenen Originals und vergleichen ihn mit dem angezeigten. Stimmen sie überein, bezieht sich der Eintrag genau auf diese Datei.

## Was er nicht belegt

Der Eintrag zeigt, dass eine bestimmte Universal ID den Fingerabdruck dieses Dokuments zu diesem Zeitpunkt festgehalten hat. Er bestätigt die Identität der unterschreibenden Person nicht über ihre E-Mail-Adresse hinaus und hält nichts darüber fest, wo sie sich befand.

## Denken Sie an den Dateinamen

Der Dateiname ist eine echte Information. Ein Name wie „Kündigungsschreiben.pdf“ sagt etwas aus, auch wenn der Inhalt Ihr Gerät nie verlässt. Wenn das wichtig ist, benennen Sie die Datei vorher um oder lassen Sie das Kästchen leer. Das Unterschreiben funktioniert ohne es genauso.`,
  },
  {
    id: 'privacy-and-storage',
    title: 'Wo Ihre Unterschrift gespeichert wird',
    summary: 'Auf diesem Gerät speichern, in der Cloud speichern, und was Ihr Gerät verlässt.',
    group: 'Datenschutz und Sicherheit',
    body: `Sie können Universal Signatures ohne Konto nutzen, und ohne dass etwas, das Sie unterschreiben, Ihr Gerät verlässt. Hier steht genau, was wo gespeichert wird.

## Auf diesem Gerät gespeichert

Sie können bis zu sechs Unterschriften in diesem Browser aufbewahren, um sie später wiederzuverwenden. Sie liegen im Speicher Ihres Browsers auf diesem Gerät, ohne Konto. Wenn Sie die Browserdaten für diese Website löschen, werden sie gelöscht, und sie stehen auf anderen Geräten oder in anderen Browsern nicht zur Verfügung.

## In der Cloud gespeichert

Wenn Sie mit einer Universal ID angemeldet sind, können Sie eine Unterschrift auch in der Cloud speichern, damit sie auf Ihren anderen Geräten verfügbar ist.

- Was gespeichert wird: das Bild der Unterschrift, der eingegebene Name, ob sie gezeichnet oder getippt wurde und in welcher Schrift, ein SHA-256-Fingerabdruck des Bildes und das Datum.
- Wer sie sehen kann: Ihr Konto und andere Mitglieder Ihrer Universal-ID-Organisation, falls Sie eine teilen.
- Eine gespeicherte Unterschrift erhält einen Zertifikatslink. Wer diesen Link hat, sieht den Namen der unterschreibenden Person, den Namen der Organisation, das Datum und den Fingerabdruck. Das Bild der Unterschrift zeigt der Link nicht.
- Sie können eine gespeicherte Unterschrift jederzeit entfernen. Bei einem kostenlosen Konto belegt eine gespeicherte Unterschrift Ihren kostenlosen Signatures-Token, den Sie beim Entfernen zurückerhalten.

Die Cloud-Speicherung ist **nicht Ende-zu-Ende-verschlüsselt**. Die Daten werden über eine verschlüsselte Verbindung übertragen und durch Zugriffsregeln geschützt, aber unsere Systeme können sie technisch lesen. Wenn Sie diesen Kompromiss nicht eingehen möchten, speichern Sie stattdessen auf diesem Gerät.

## Was Ihr Gerät verlässt, und wann

- **Nie:** das PDF, das Sie unterschreiben, bei keiner Funktion dieser App.
- **Beim Unterschreiben auf dem Handy:** das Bild der gezeichneten Unterschrift, weitergeleitet über ein Live-Relay und nicht gespeichert.
- **Beim Hinzufügen eines Signaturzertifikats:** Ihre E-Mail-Adresse, der Dateiname und der Fingerabdruck des Dokuments.
- **Beim Speichern in der Cloud:** das Bild der Unterschrift und die oben genannten Angaben.
- **Wenn Sie angemeldet sind:** ein Hinweis, dass die App geöffnet wurde, damit die Aktivitätsseite Ihres Kontos stimmt. Er sagt nichts über Ihre Dokumente aus.
- **Solange die App geöffnet ist:** ein regelmäßiges Signal, dass die App genutzt wird, mit dem Namen der App und einer zufälligen, auf diesem Gerät erzeugten ID, dazu Ihr Konto, falls Sie angemeldet sind.

Die App enthält keine Werbe- oder Tracking-Skripte von Drittanbietern.

## Ihre Universal ID

Ihre Universal ID ist das eine Konto, das alle UNI·SIM-Apps gemeinsam nutzen. Sie brauchen sie nur für die optionalen Cloud-Funktionen. Zum Unterschreiben eines PDFs ist sie nie nötig.`,
  },
]

export default articles
