import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'electronic-digital-wet-signatures',
    title: 'Electronic, digital and wet signatures',
    summary: 'Three things people mean by "signature", and which one this app makes.',
    group: 'The basics',
    body: `People use the word "signature" for several quite different things. It helps to know which is which.

## Wet signatures

A wet signature is the traditional kind: you write your name in ink on paper. The name comes from the ink still being wet on the page.

## Electronic signatures

An electronic signature is any electronic way of showing that you agree to a document. It can be as simple as a picture of your handwritten signature placed on a PDF, a typed name, or a tick box on a website. Many countries recognise electronic signatures for a wide range of everyday agreements, although some documents, such as certain property, family or court papers, may have extra rules.

## Digital signatures

A digital signature is a specific technical kind of electronic signature. It uses cryptography and a certificate, usually issued by a trusted organisation, to lock the document. If anyone changes the file afterwards, software such as a PDF reader can detect it and show the signature as broken.

## Which one Universal Signatures makes

Universal Signatures makes **electronic signatures**. It places an image of your drawn or typed signature onto the page of a PDF. It does not add a certificate-based digital signature to the file.

If you choose to add a signing certificate (see "Signing certificates and verifiable records"), you also get an independent record of the document's fingerprint, which helps show later that a file is the one you signed. That is useful evidence, but it is not the same thing as a certificate-based digital signature.

## A note on the law

Whether an electronic signature is acceptable depends on where you are, what the document is, and what the other people involved agree to. This is general information, not legal advice. If a document really matters, check what the recipient accepts, or ask a qualified adviser.`,
  },
  {
    id: 'signature-image-formats',
    title: 'Why your signature is a transparent PNG',
    summary: 'Image formats explained, and why transparency matters for a signature.',
    group: 'The basics',
    body: `Every signature you make in this app, whether drawn, typed or drawn on your phone, is turned into a PNG image with a transparent background. Here is why.

## Pixels and formats

A digital image is a grid of tiny coloured squares called pixels. An image format is simply an agreed way of storing that grid in a file. The common ones are:

- **JPEG** is designed for photographs. It makes files small by throwing away detail the eye is unlikely to notice. It has no transparency, so every pixel has a solid colour, usually white around a signature.
- **PNG** keeps every pixel exactly as it was (it is "lossless") and supports transparency, so pixels can be fully or partly see-through.
- **WebP** is a newer format that can do either kind of compression and also supports transparency, but older software does not always handle it.

## Why transparency matters

Documents are rarely pure white. There may be a signature line, a shaded box, a form field or printed text right where you want to sign. A JPEG signature would sit on top of all that as a white rectangle, hiding whatever is underneath. A transparent PNG leaves only the ink, so the page shows through around the strokes, just as it would with a pen.

## Why lossless matters

Signatures are thin lines with sharp edges. The compression used by JPEG tends to blur sharp edges and leave faint smudges around them. PNG keeps the lines crisp.

## Typed signatures become images too

When you type your name, the app draws it in the cursive font you chose and then saves the result as a PNG. That means a typed signature looks the same on every computer that opens the PDF, even one that does not have the font installed.`,
  },
  {
    id: 'how-signing-works',
    title: 'What happens when you sign a PDF',
    summary: 'Every step happens in your browser, and the document is never uploaded.',
    group: 'How it works',
    body: `Signing a PDF in Universal Signatures happens entirely inside your web browser, on your own device.

## The steps

1. You create a signature by drawing it with a mouse, finger or stylus, by typing your name in a cursive font, or by drawing it on your phone.
2. You choose a PDF. Your browser reads the file and shows its pages. The file is not sent anywhere to do this.
3. You pick the page, the position and the size. You can snap the signature to a corner, edge or the centre, or choose an exact spot on a preview of the page.
4. If you added a name, a date or a time, you can stamp them beneath the signature.
5. The app places the signature image onto the page and gives you a new file to save, with "-signed" added to the original name.

Your original file is left untouched. The signed copy is a new file.

## It works offline

Because nothing about signing needs a server, you can sign a PDF with your internet connection switched off. Only the optional extras need a connection: saving a signature to the cloud, signing on your phone, and adding a signing certificate.

## What it does and does not do

- It places a picture of your signature on one page of the document. It does not fill in form fields or merge several documents.
- It does not lock the PDF. Anyone with suitable software could still edit the signed copy. A signing certificate records a fingerprint of the unsigned original, so it can show later which document you signed, but it cannot detect changes made to the signed copy.
- Typed signatures use one of the built-in cursive fonts, or a font file you import yourself. An imported font is only used on your device for that session.

## Tips

- Sign on a light background with a steady stroke. You can always press Clear and try again.
- Use the size slider rather than zooming the page, so the signature stays in proportion to the document.
- Keep the unsigned original if you plan to add a signing certificate, because it is the original that the certificate's fingerprint describes.`,
  },
  {
    id: 'sign-on-your-phone',
    title: 'Signing on your phone',
    summary: 'How the QR code and PIN get a signature from your phone to your computer.',
    group: 'How it works',
    body: `Drawing a signature with a mouse is awkward. Signing on your phone lets you use your finger on a touchscreen instead, while the document stays on your computer.

## How it works

1. On your computer, choose the phone option. The app shows a QR code and a 6-digit PIN.
2. Scan the QR code with your phone's camera. It opens a signing page in your phone's browser.
3. Enter the PIN on your phone, then draw your signature.
4. The signature appears on your computer, ready to use.

## How the signature travels

Your phone and your computer cannot talk to each other directly, so the signature image travels over the internet through a live relay. The relay passes the message on the moment it arrives. It is not saved in a database, and it works the same whether or not you are signed in.

Only the signature image makes this journey. The PDF stays on your computer the whole time.

## What keeps it private

- The QR code contains a random, one-time code that is hard to guess, so only someone who can see your screen can open the right page.
- Your computer only accepts a signature that carries the PIN shown on its own screen. Anything else is ignored.
- If you want to start again, you can ask for a fresh QR code and PIN.

Treat the QR code and PIN like any short-lived code: do not share a photo of your screen while they are showing.`,
  },
  {
    id: 'signing-certificates',
    title: 'Signing certificates and verifiable records',
    summary: 'What the optional certificate page and QR code record, and what they prove.',
    group: 'How it works',
    body: `When you are signed in with a Universal ID, you can tick **Add a signing certificate** before you sign. This is optional and free.

## What you get

- A **certificate page** added to the end of the signed PDF.
- A small **QR code** beside your signature, with the caption "Scan to verify".
- A **record** on our servers that anyone with the link can look up.

## What the record contains

- The email address on your Universal ID.
- The original file name.
- A SHA-256 fingerprint (a "hash") of the document as it was before you signed it.
- The time the record was created, taken from our server's clock.

The document itself is never uploaded. A hash is a short string of letters and numbers calculated from the file's contents. The same file always gives the same hash, a file that differs by even one character gives a completely different one, and the file cannot be rebuilt from its hash.

## The certificate page

The page separates facts our server recorded (your verified email address, the time, the certificate ID) from details your own device reported (its clock and its time zone). The page labels the second group as self-reported, because a computer's clock can be set to anything. No location is recorded.

## Checking a document

Scanning the QR code, or opening the link printed on the certificate page, shows the record: who signed, the file name, when it was recorded, and the fingerprint. To confirm a copy is the one that was signed, calculate the SHA-256 hash of the unsigned original and compare it with the one shown. If they match, the record is about that exact file.

## What it does not prove

The record shows that a particular Universal ID recorded that document's fingerprint at that time. It does not confirm the signer's identity beyond their email address, and it records nothing about where they were.

## Think about the file name

The file name is real information. A name like "Resignation letter.pdf" says something even though the contents never leave your device. If that matters, rename the file first or leave the box unticked. Signing works exactly the same without it.`,
  },
  {
    id: 'privacy-and-storage',
    title: 'Where your signature is kept',
    summary: 'Saving on this device, saving to the cloud, and what ever leaves your device.',
    group: 'Privacy and security',
    body: `You can use Universal Signatures without an account, and without anything you sign leaving your device. Here is exactly what is kept, and where.

## Saved on this device

You can keep up to six signatures in this browser so you can reuse them later. They are stored in your browser's own storage on this device, with no account involved. Clearing your browser's data for this site deletes them, and they do not follow you to other devices or browsers.

## Saved to the cloud

If you are signed in with a Universal ID, you can also save a signature to the cloud so it is available on your other devices.

- What is stored: the signature image, the name you entered, whether it was drawn or typed and in which font, a SHA-256 fingerprint of the image, and the date.
- Who can see it: your account, and other members of your Universal ID organisation if you share one.
- A saved signature gets a certificate link. Anyone with that link can see the signer name, the organisation name, the date and the fingerprint. The link does not show the signature image.
- You can remove a stored signature at any time. When you are signed in, the online save panel lists every signature stored for your account, newest first, so you can remove one even if you saved it on another day or device. Storing signatures online is free with a Universal ID. Free accounts have a generous limit — if you ever reach it, remove a signature you no longer need. If you need more, tell us at unisim.co.uk/support.

Cloud storage is **not end-to-end encrypted**. Data travels over an encrypted connection and is protected by access rules, but our systems can technically read it. If you would rather not make that trade, save on this device instead.

## What leaves your device, and when

- **Never:** the PDF you are signing, in any of the flows in this app.
- **When you sign on your phone:** the signature image you drew, passed through a live relay and not stored.
- **When you add a signing certificate:** your email address, the file name and the document's fingerprint.
- **When you save to the cloud:** the signature image and the details listed above.
- **When you are signed in:** a note that the app was opened, so your account's activity page is accurate. It says nothing about your documents.
- **While the app is open:** a periodic signal that the app is in use, holding the app's name and a random ID made on this device, plus your account if you are signed in.

There are no advertising or third-party tracking scripts in the app.

## Your Universal ID

Your Universal ID is the single account shared across UNI·SIM apps. You only need it for the optional cloud features. Signing a PDF never requires one.`,
  },
]

export default articles
