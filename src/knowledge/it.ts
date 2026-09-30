import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'electronic-digital-wet-signatures',
    title: 'Firme elettroniche, digitali e autografe',
    summary: 'Tre cose che chiamiamo «firma», e quale crea questa app.',
    group: 'Le basi',
    body: `La parola «firma» indica cose piuttosto diverse. Conviene sapere come distinguerle.

## La firma autografa

È la firma tradizionale: scrivi il tuo nome a penna su carta. In inglese si parla di firma «bagnata», perché l’inchiostro è ancora fresco sulla pagina.

## La firma elettronica

Una firma elettronica è qualsiasi modo elettronico per mostrare che accetti un documento. Può essere semplice come un’immagine della tua firma autografa inserita in un PDF, un nome digitato o una casella spuntata su un sito web. Molti paesi riconoscono la firma elettronica per un’ampia gamma di accordi quotidiani, anche se alcuni documenti, per esempio in ambito immobiliare, familiare o giudiziario, possono avere regole aggiuntive.

## La firma digitale

Una firma digitale è un tipo tecnico specifico di firma elettronica. Usa la crittografia e un certificato, di solito rilasciato da un ente fidato, per sigillare il documento. Se qualcuno modifica il file in seguito, un programma come un lettore PDF può accorgersene e segnalare la firma come non più valida.

## Cosa crea Universal Signatures

Universal Signatures crea **firme elettroniche**. Inserisce un’immagine della tua firma, disegnata o digitata, su una pagina di un PDF. Non aggiunge al file una firma digitale basata su certificato.

Se scegli di aggiungere un certificato di firma (vedi «Certificati di firma e registrazioni verificabili»), ottieni anche una registrazione indipendente dell’impronta del documento, che aiuta a dimostrare in seguito che un file è proprio quello che hai firmato. È una prova utile, ma non equivale a una firma digitale basata su certificato.

## Una nota sulla legge

Se una firma elettronica sia accettabile dipende da dove ti trovi, dal tipo di documento e da cosa accettano le altre parti. Queste sono informazioni generali, non una consulenza legale. Se un documento è importante, verifica cosa accetta il destinatario o rivolgiti a un professionista qualificato.`,
  },
  {
    id: 'signature-image-formats',
    title: 'Perché la tua firma è un PNG trasparente',
    summary: 'I formati immagine spiegati, e perché la trasparenza conta per una firma.',
    group: 'Le basi',
    body: `Ogni firma che crei in questa app, disegnata, digitata o disegnata sul telefono, viene trasformata in un’immagine PNG con sfondo trasparente. Ecco perché.

## Pixel e formati

Un’immagine digitale è una griglia di minuscoli quadrati colorati chiamati pixel. Un formato immagine è semplicemente un modo concordato per salvare quella griglia in un file. I più comuni sono:

- **JPEG** è pensato per le fotografie. Riduce le dimensioni dei file eliminando dettagli che l’occhio difficilmente nota. Non supporta la trasparenza, quindi ogni pixel ha un colore pieno, di solito bianco attorno a una firma.
- **PNG** conserva ogni pixel esattamente com’era (è «senza perdita») e supporta la trasparenza, quindi i pixel possono essere del tutto o in parte trasparenti.
- **WebP** è un formato più recente che può usare entrambi i tipi di compressione e supporta anche la trasparenza, ma i programmi meno recenti non sempre lo gestiscono.

## Perché la trasparenza conta

I documenti raramente sono bianchi puri. Proprio dove vuoi firmare ci può essere una riga per la firma, un riquadro colorato, un campo di un modulo o del testo stampato. Una firma in JPEG ci starebbe sopra come un rettangolo bianco, coprendo ciò che c’è sotto. Un PNG trasparente lascia solo l’inchiostro: la pagina resta visibile attorno ai tratti, come con una penna.

## Perché conta l’assenza di perdita

Le firme sono linee sottili con bordi netti. La compressione del JPEG tende a sfumare i bordi e a lasciare piccole sbavature attorno. Il PNG mantiene le linee nitide.

## Anche le firme digitate diventano immagini

Quando digiti il tuo nome, l’app lo scrive nel carattere corsivo che hai scelto e salva il risultato come PNG. Così una firma digitata appare uguale su qualsiasi computer apra il PDF, anche se quel carattere non è installato.`,
  },
  {
    id: 'how-signing-works',
    title: 'Cosa succede quando firmi un PDF',
    summary: 'Tutto avviene nel tuo browser e il documento non viene mai caricato.',
    group: 'Come funziona',
    body: `Firmare un PDF con Universal Signatures avviene interamente nel tuo browser, sul tuo dispositivo.

## I passaggi

1. Crei una firma disegnandola con mouse, dito o pennino, digitando il tuo nome in un carattere corsivo oppure disegnandola sul telefono.
2. Scegli un PDF. Il browser legge il file e ne mostra le pagine, senza inviarlo da nessuna parte.
3. Scegli la pagina, la posizione e la dimensione. Puoi agganciare la firma a un angolo, a un bordo o al centro, oppure scegliere un punto preciso su un’anteprima della pagina.
4. Se hai aggiunto un nome, una data o un’ora, puoi stamparli sotto la firma.
5. L’app inserisce l’immagine della firma nella pagina e ti propone un nuovo file da salvare, con «-signed» aggiunto al nome originale.

Il file originale non viene toccato. La copia firmata è un file nuovo.

## Funziona offline

Poiché la firma non ha bisogno di alcun server, puoi firmare un PDF con la connessione a internet disattivata. Solo le funzioni facoltative richiedono una connessione: salvare una firma nel cloud, firmare sul telefono e aggiungere un certificato di firma.

## Cosa fa e cosa non fa

- Inserisce un’immagine della tua firma su una pagina del documento. Non compila campi di moduli e non unisce più documenti.
- Non blocca il PDF. Chiunque abbia il programma adatto potrebbe ancora modificare la copia firmata. Un certificato di firma registra un’impronta dell’originale non firmato. Serve a dimostrare in seguito quale documento hai firmato, ma non rileva le modifiche fatte alla copia firmata.
- Le firme digitate usano uno dei caratteri corsivi integrati oppure un file di carattere che importi tu. Un carattere importato viene usato solo sul tuo dispositivo, per quella sessione.

## Consigli

- Firma con un tratto deciso. Puoi sempre premere «Clear» e riprovare.
- Usa il cursore delle dimensioni invece dello zoom della pagina, così la firma resta proporzionata al documento.
- Conserva l’originale non firmato se pensi di aggiungere un certificato di firma: l’impronta del certificato descrive proprio quell’originale.`,
  },
  {
    id: 'sign-on-your-phone',
    title: 'Firmare sul telefono',
    summary: 'Come il codice QR e il PIN portano una firma dal telefono al computer.',
    group: 'Come funziona',
    body: `Disegnare una firma con il mouse è scomodo. Firmare sul telefono ti permette di usare il dito sul touchscreen, mentre il documento resta sul computer.

## Come funziona

1. Sul computer, scegli l’opzione telefono. L’app mostra un codice QR e un PIN di 6 cifre.
2. Inquadra il codice QR con la fotocamera del telefono. Si apre una pagina di firma nel browser del telefono.
3. Inserisci il PIN sul telefono, poi disegna la tua firma.
4. La firma compare sul computer, pronta da usare.

## Come viaggia la firma

Il telefono e il computer non possono comunicare direttamente, quindi l’immagine della firma viaggia su internet attraverso un inoltro in tempo reale. L’inoltro passa il messaggio appena arriva. Non viene salvato in un database, e funziona allo stesso modo che tu abbia effettuato l’accesso o no.

Solo l’immagine della firma fa questo percorso. Il PDF resta sempre sul computer.

## Cosa lo rende riservato

- Il codice QR contiene un codice casuale monouso, difficile da indovinare, quindi solo chi vede il tuo schermo può aprire la pagina giusta.
- Il computer accetta solo una firma che riporti il PIN mostrato sul suo schermo. Tutto il resto viene ignorato.
- Se vuoi ricominciare, puoi chiedere un nuovo codice QR e un nuovo PIN.

Tratta il codice QR e il PIN come qualsiasi codice temporaneo: non condividere foto dello schermo mentre sono visibili.`,
  },
  {
    id: 'signing-certificates',
    title: 'Certificati di firma e registrazioni verificabili',
    summary: 'Cosa registrano la pagina di certificato e il codice QR facoltativi, e cosa dimostrano.',
    group: 'Come funziona',
    body: `Se hai effettuato l’accesso con un Universal ID, prima di firmare puoi spuntare **Add a signing certificate** (aggiungi un certificato di firma). È facoltativo e gratuito.

## Cosa ottieni

- Una **pagina di certificato** aggiunta alla fine del PDF firmato.
- Un piccolo **codice QR** accanto alla firma, con la scritta «Scan to verify».
- Una **registrazione** sui nostri server, consultabile da chiunque abbia il link.

## Cosa contiene la registrazione

- L’indirizzo email del tuo Universal ID.
- Il nome del file originale.
- Un’impronta SHA-256 (un «hash») del documento com’era prima della firma.
- L’ora in cui è stata creata la registrazione, secondo l’orologio del nostro server.

Il documento vero e proprio non viene mai caricato. Un hash è una breve sequenza di lettere e numeri calcolata dal contenuto del file. Lo stesso file dà sempre lo stesso hash, un file diverso anche di un solo carattere ne dà uno completamente diverso, e dall’hash non è possibile ricostruire il file.

## La pagina di certificato

La pagina separa i dati registrati dal nostro server (il tuo indirizzo email verificato, l’ora, l’ID del certificato) da quelli forniti dal tuo dispositivo (il suo orologio e il suo fuso orario). Questo secondo gruppo è indicato come autodichiarato, perché l’orologio di un computer può essere impostato su qualsiasi valore. Non viene registrata alcuna posizione.

## Verificare un documento

Inquadrando il codice QR, o aprendo il link stampato sulla pagina di certificato, si vede la registrazione: chi ha firmato, il nome del file, quando è stata registrata e l’impronta. Per confermare che una copia è quella firmata, calcola l’hash SHA-256 dell’originale non firmato e confrontalo con quello mostrato. Se coincidono, la registrazione riguarda esattamente quel file.

## Cosa non dimostra

La registrazione mostra che un certo Universal ID ha registrato l’impronta di quel documento in quel momento. Non conferma l’identità di chi firma oltre al suo indirizzo email, e non registra nulla su dove si trovasse.

## Pensa al nome del file

Il nome del file è un’informazione reale. Un nome come «Lettera di dimissioni.pdf» dice qualcosa anche se il contenuto non lascia mai il tuo dispositivo. Se ti importa, rinomina prima il file o lascia la casella vuota. La firma funziona esattamente allo stesso modo anche senza.`,
  },
  {
    id: 'privacy-and-storage',
    title: 'Dove viene conservata la tua firma',
    summary: 'Salvare su questo dispositivo, salvare nel cloud e cosa lascia il tuo dispositivo.',
    group: 'Privacy e sicurezza',
    body: `Puoi usare Universal Signatures senza un account e senza che nulla di ciò che firmi lasci il tuo dispositivo. Ecco esattamente cosa viene conservato, e dove.

## Salvate su questo dispositivo

Puoi conservare fino a sei firme in questo browser per riutilizzarle in seguito. Sono salvate nello spazio di archiviazione del browser su questo dispositivo, senza alcun account. Cancellando i dati del browser per questo sito vengono eliminate, e non ti seguono su altri dispositivi o browser.

## Salvate nel cloud

Se hai effettuato l’accesso con un Universal ID, puoi anche salvare una firma nel cloud per averla sugli altri tuoi dispositivi.

- Cosa viene salvato: l’immagine della firma, il nome inserito, se è stata disegnata o digitata e con quale carattere, un’impronta SHA-256 dell’immagine e la data.
- Chi può vederla: il tuo account e gli altri membri della tua organizzazione Universal ID, se ne condividi una.
- Una firma salvata riceve un link di certificato. Chiunque abbia quel link può vedere il nome del firmatario, il nome dell’organizzazione, la data e l’impronta. Il link non mostra l’immagine della firma.
- Puoi rimuovere una firma salvata in qualsiasi momento. Quando hai effettuato l’accesso, il pannello di salvataggio online elenca tutte le firme salvate nel tuo account, dalla più recente, così puoi rimuoverne una anche se l’hai salvata in un altro giorno o su un altro dispositivo. Salvare le firme online è gratuito con un Universal ID. Gli account gratuiti hanno un limite generoso: se mai lo raggiungi, rimuovi una firma che non ti serve più, oppure ottieni più spazio.

L’archiviazione nel cloud **non è crittografata end-to-end**. I dati viaggiano su una connessione crittografata e sono protetti da regole di accesso, ma i nostri sistemi possono tecnicamente leggerli. Se preferisci evitare questo compromesso, salva su questo dispositivo.

## Cosa lascia il tuo dispositivo, e quando

- **Mai:** il PDF che firmi, in nessuna funzione di questa app.
- **Quando firmi sul telefono:** l’immagine della firma che hai disegnato, trasmessa da un inoltro in tempo reale e non salvata.
- **Quando aggiungi un certificato di firma:** il tuo indirizzo email, il nome del file e l’impronta del documento.
- **Quando salvi nel cloud:** l’immagine della firma e i dati elencati sopra.
- **Quando hai effettuato l’accesso:** una notifica che l’app è stata aperta, perché la pagina delle attività del tuo account sia corretta. Non dice nulla dei tuoi documenti.
- **Mentre l’app è aperta:** un segnale periodico che l’app è in uso, con il nome dell’app e un ID casuale creato su questo dispositivo, più il tuo account se hai effettuato l’accesso.

L’app non contiene script pubblicitari né di tracciamento di terze parti.

## Il tuo Universal ID

Il tuo Universal ID è l’unico account condiviso tra le app UNI·SIM. Ti serve solo per le funzioni cloud facoltative. Firmare un PDF non lo richiede mai.`,
  },
]

export default articles
