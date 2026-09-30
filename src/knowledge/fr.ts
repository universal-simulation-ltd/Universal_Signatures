import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'electronic-digital-wet-signatures',
    title: 'Signatures électroniques, numériques et manuscrites',
    summary: 'Trois choses que l’on appelle « signature », et celle que crée cette application.',
    group: 'Les bases',
    body: `Le mot « signature » désigne plusieurs choses assez différentes. Il est utile de savoir les distinguer.

## La signature manuscrite

C’est la signature traditionnelle : vous écrivez votre nom à l’encre sur du papier. En anglais, on parle de signature « humide », parce que l’encre est encore fraîche sur la page.

## La signature électronique

Une signature électronique est tout moyen électronique de montrer que vous acceptez un document. Cela peut être aussi simple qu’une image de votre signature manuscrite placée sur un PDF, un nom tapé au clavier ou une case cochée sur un site web. De nombreux pays reconnaissent la signature électronique pour un large éventail d’accords courants, même si certains documents, par exemple en matière immobilière, familiale ou judiciaire, peuvent être soumis à des règles supplémentaires.

## La signature numérique

Une signature numérique est un type technique précis de signature électronique. Elle utilise la cryptographie et un certificat, généralement délivré par un organisme de confiance, pour verrouiller le document. Si quelqu’un modifie ensuite le fichier, un logiciel comme un lecteur PDF peut le détecter et indiquer que la signature n’est plus valide.

## Ce que crée Universal Signatures

Universal Signatures crée des **signatures électroniques**. L’application place une image de votre signature dessinée ou tapée sur une page d’un PDF. Elle n’ajoute pas de signature numérique fondée sur un certificat.

Si vous choisissez d’ajouter un certificat de signature (voir « Certificats de signature et enregistrements vérifiables »), vous obtenez aussi un enregistrement indépendant de l’empreinte du document, qui aide à montrer plus tard qu’un fichier est bien celui que vous avez signé. C’est une preuve utile, mais ce n’est pas la même chose qu’une signature numérique fondée sur un certificat.

## Un mot sur le droit

La validité d’une signature électronique dépend de l’endroit où vous vous trouvez, de la nature du document et de ce qu’acceptent les autres parties. Ces informations sont générales et ne constituent pas un conseil juridique. Si un document est important, vérifiez ce que le destinataire accepte ou consultez un professionnel qualifié.`,
  },
  {
    id: 'signature-image-formats',
    title: 'Pourquoi votre signature est un PNG transparent',
    summary: 'Les formats d’image expliqués, et pourquoi la transparence compte pour une signature.',
    group: 'Les bases',
    body: `Toute signature créée dans cette application, qu’elle soit dessinée, tapée ou dessinée sur votre téléphone, est transformée en image PNG à fond transparent. Voici pourquoi.

## Pixels et formats

Une image numérique est une grille de minuscules carrés colorés appelés pixels. Un format d’image est simplement une manière convenue d’enregistrer cette grille dans un fichier. Les plus courants sont :

- **JPEG** est conçu pour les photos. Il réduit la taille des fichiers en supprimant des détails que l’œil remarque peu. Il ne gère pas la transparence : chaque pixel a une couleur pleine, généralement du blanc autour d’une signature.
- **PNG** conserve chaque pixel tel quel (il est « sans perte ») et gère la transparence : des pixels peuvent être totalement ou partiellement transparents.
- **WebP** est un format plus récent qui peut utiliser les deux types de compression et gère aussi la transparence, mais les logiciels plus anciens ne le prennent pas toujours en charge.

## Pourquoi la transparence compte

Les documents sont rarement d’un blanc pur. Il peut y avoir une ligne de signature, une case grisée, un champ de formulaire ou du texte imprimé à l’endroit même où vous voulez signer. Une signature en JPEG s’afficherait par-dessus comme un rectangle blanc, masquant ce qui se trouve dessous. Un PNG transparent ne laisse que l’encre : la page reste visible autour des traits, comme avec un stylo.

## Pourquoi l’absence de perte compte

Une signature est faite de traits fins aux bords nets. La compression du JPEG a tendance à flouter ces bords et à laisser de légères traces autour. Le PNG garde des traits nets.

## Les signatures tapées deviennent aussi des images

Quand vous tapez votre nom, l’application l’écrit dans la police cursive choisie, puis enregistre le résultat en PNG. Une signature tapée s’affiche donc de la même façon sur tout ordinateur qui ouvre le PDF, même si la police n’y est pas installée.`,
  },
  {
    id: 'how-signing-works',
    title: 'Ce qui se passe quand vous signez un PDF',
    summary: 'Tout se passe dans votre navigateur, et le document n’est jamais envoyé.',
    group: 'Comment ça marche',
    body: `Signer un PDF avec Universal Signatures se fait entièrement dans votre navigateur web, sur votre propre appareil.

## Les étapes

1. Vous créez une signature en la dessinant avec une souris, un doigt ou un stylet, en tapant votre nom dans une police cursive, ou en la dessinant sur votre téléphone.
2. Vous choisissez un PDF. Votre navigateur lit le fichier et affiche ses pages, sans l’envoyer nulle part.
3. Vous choisissez la page, l’emplacement et la taille. Vous pouvez placer la signature dans un coin, sur un bord ou au centre, ou choisir un point précis sur un aperçu de la page.
4. Si vous avez ajouté un nom, une date ou une heure, vous pouvez les apposer sous la signature.
5. L’application place l’image de la signature sur la page et vous propose un nouveau fichier à enregistrer, dont le nom reprend l’original suivi de « -signed ».

Votre fichier d’origine n’est pas modifié. La copie signée est un nouveau fichier.

## Cela fonctionne hors ligne

Comme la signature n’a besoin d’aucun serveur, vous pouvez signer un PDF avec votre connexion internet coupée. Seules les options facultatives nécessitent une connexion : l’enregistrement d’une signature dans le cloud, la signature sur téléphone et l’ajout d’un certificat de signature.

## Ce que l’application fait et ne fait pas

- Elle place une image de votre signature sur une page du document. Elle ne remplit pas de champs de formulaire et ne fusionne pas plusieurs documents.
- Elle ne verrouille pas le PDF. Toute personne disposant du logiciel adéquat pourrait encore modifier la copie signée. Un certificat de signature enregistre une empreinte de l’original non signé. Il permet de montrer plus tard quel document vous avez signé, mais il ne détecte pas les modifications apportées à la copie signée.
- Les signatures tapées utilisent l’une des polices cursives intégrées, ou un fichier de police que vous importez. Une police importée n’est utilisée que sur votre appareil, pendant la session.

## Conseils

- Signez d’un trait assuré. Vous pouvez toujours appuyer sur « Clear » et recommencer.
- Utilisez le curseur de taille plutôt que le zoom de la page, pour que la signature reste proportionnée au document.
- Conservez l’original non signé si vous comptez ajouter un certificat de signature : c’est l’original que décrit l’empreinte du certificat.`,
  },
  {
    id: 'sign-on-your-phone',
    title: 'Signer sur votre téléphone',
    summary: 'Comment le QR code et le code PIN transfèrent une signature du téléphone à l’ordinateur.',
    group: 'Comment ça marche',
    body: `Dessiner une signature à la souris n’est pas pratique. Signer sur votre téléphone vous permet d’utiliser votre doigt sur un écran tactile, tandis que le document reste sur votre ordinateur.

## Comment ça marche

1. Sur votre ordinateur, choisissez l’option téléphone. L’application affiche un QR code et un code PIN à 6 chiffres.
2. Scannez le QR code avec l’appareil photo de votre téléphone. Une page de signature s’ouvre dans le navigateur du téléphone.
3. Saisissez le code PIN sur votre téléphone, puis dessinez votre signature.
4. La signature apparaît sur votre ordinateur, prête à l’emploi.

## Comment la signature circule

Votre téléphone et votre ordinateur ne peuvent pas communiquer directement. L’image de la signature passe donc par internet, via un relais en direct. Le relais transmet le message dès son arrivée. Il n’est pas enregistré dans une base de données, et cela fonctionne de la même façon que vous soyez connecté ou non.

Seule l’image de la signature fait ce trajet. Le PDF reste sur votre ordinateur du début à la fin.

## Ce qui protège ce transfert

- Le QR code contient un code aléatoire à usage unique, difficile à deviner : seule une personne qui voit votre écran peut ouvrir la bonne page.
- Votre ordinateur n’accepte qu’une signature accompagnée du code PIN affiché sur son propre écran. Tout le reste est ignoré.
- Si vous voulez recommencer, vous pouvez demander un nouveau QR code et un nouveau code PIN.

Traitez le QR code et le code PIN comme n’importe quel code temporaire : ne partagez pas de photo de votre écran pendant qu’ils sont affichés.`,
  },
  {
    id: 'signing-certificates',
    title: 'Certificats de signature et enregistrements vérifiables',
    summary: 'Ce qu’enregistrent la page de certificat et le QR code facultatifs, et ce qu’ils prouvent.',
    group: 'Comment ça marche',
    body: `Lorsque vous êtes connecté avec un Universal ID, vous pouvez cocher **Add a signing certificate** (ajouter un certificat de signature) avant de signer. C’est facultatif et gratuit.

## Ce que vous obtenez

- Une **page de certificat** ajoutée à la fin du PDF signé.
- Un petit **QR code** à côté de votre signature, avec la mention « Scan to verify ».
- Un **enregistrement** sur nos serveurs, consultable par toute personne disposant du lien.

## Ce que contient l’enregistrement

- L’adresse e-mail de votre Universal ID.
- Le nom du fichier d’origine.
- Une empreinte SHA-256 (un « hash ») du document tel qu’il était avant votre signature.
- L’heure de création de l’enregistrement, selon l’horloge de notre serveur.

Le document lui-même n’est jamais envoyé. Un hash est une courte suite de lettres et de chiffres calculée à partir du contenu du fichier. Le même fichier donne toujours le même hash, un fichier qui diffère d’un seul caractère en donne un complètement différent, et il est impossible de reconstituer le fichier à partir de son hash.

## La page de certificat

La page sépare les informations enregistrées par notre serveur (votre adresse e-mail vérifiée, l’heure, l’identifiant du certificat) de celles fournies par votre propre appareil (son horloge et son fuseau horaire). La page indique que ce second groupe est déclaratif, car l’horloge d’un ordinateur peut être réglée sur n’importe quelle valeur. Aucune localisation n’est enregistrée.

## Vérifier un document

Scanner le QR code, ou ouvrir le lien imprimé sur la page de certificat, affiche l’enregistrement : qui a signé, le nom du fichier, la date d’enregistrement et l’empreinte. Pour confirmer qu’une copie est bien celle qui a été signée, calculez le hash SHA-256 de l’original non signé et comparez-le à celui affiché. S’ils correspondent, l’enregistrement porte sur ce fichier précis.

## Ce que cela ne prouve pas

L’enregistrement montre qu’un Universal ID donné a enregistré l’empreinte de ce document à ce moment-là. Il ne confirme pas l’identité du signataire au-delà de son adresse e-mail, et n’enregistre rien sur l’endroit où il se trouvait.

## Pensez au nom du fichier

Le nom du fichier est une vraie information. Un nom comme « Lettre de démission.pdf » en dit long, même si le contenu ne quitte jamais votre appareil. Si cela compte, renommez le fichier avant ou laissez la case décochée. La signature fonctionne exactement de la même façon sans elle.`,
  },
  {
    id: 'privacy-and-storage',
    title: 'Où votre signature est conservée',
    summary: 'Enregistrer sur cet appareil, enregistrer dans le cloud, et ce qui quitte votre appareil.',
    group: 'Confidentialité et sécurité',
    body: `Vous pouvez utiliser Universal Signatures sans compte, et sans que rien de ce que vous signez ne quitte votre appareil. Voici précisément ce qui est conservé, et où.

## Enregistrées sur cet appareil

Vous pouvez conserver jusqu’à six signatures dans ce navigateur pour les réutiliser plus tard. Elles sont stockées dans l’espace de stockage de votre navigateur sur cet appareil, sans aucun compte. Effacer les données de navigation de ce site les supprime, et elles ne vous suivent pas sur d’autres appareils ou navigateurs.

## Enregistrées dans le cloud

Si vous êtes connecté avec un Universal ID, vous pouvez aussi enregistrer une signature dans le cloud pour la retrouver sur vos autres appareils.

- Ce qui est stocké : l’image de la signature, le nom saisi, si elle a été dessinée ou tapée et dans quelle police, une empreinte SHA-256 de l’image, et la date.
- Qui peut la voir : votre compte, et les autres membres de votre organisation Universal ID si vous en partagez une.
- Une signature enregistrée reçoit un lien de certificat. Toute personne disposant de ce lien peut voir le nom du signataire, le nom de l’organisation, la date et l’empreinte. Le lien n’affiche pas l’image de la signature.
- Vous pouvez supprimer une signature enregistrée à tout moment. Conserver vos signatures en ligne est gratuit avec un Universal ID. Les comptes gratuits disposent d’une limite généreuse : si vous l’atteignez un jour, supprimez une signature dont vous n’avez plus besoin, ou obtenez plus d’espace.

Le stockage dans le cloud **n’est pas chiffré de bout en bout**. Les données circulent par une connexion chiffrée et sont protégées par des règles d’accès, mais nos systèmes peuvent techniquement les lire. Si vous préférez éviter ce compromis, enregistrez plutôt sur cet appareil.

## Ce qui quitte votre appareil, et quand

- **Jamais :** le PDF que vous signez, quelle que soit la fonction utilisée dans cette application.
- **Quand vous signez sur votre téléphone :** l’image de la signature dessinée, transmise par un relais en direct et non enregistrée.
- **Quand vous ajoutez un certificat de signature :** votre adresse e-mail, le nom du fichier et l’empreinte du document.
- **Quand vous enregistrez dans le cloud :** l’image de la signature et les informations listées ci-dessus.
- **Quand vous êtes connecté :** une indication que l’application a été ouverte, pour que la page d’activité de votre compte soit exacte. Elle ne dit rien de vos documents.
- **Tant que l’application est ouverte :** un signal périodique indiquant qu’elle est utilisée, avec le nom de l’application et un identifiant aléatoire créé sur cet appareil, ainsi que votre compte si vous êtes connecté.

L’application ne contient aucun script publicitaire ni de suivi tiers.

## Votre Universal ID

Votre Universal ID est le compte unique partagé par les applications UNI·SIM. Vous n’en avez besoin que pour les fonctions cloud facultatives. Signer un PDF n’en demande jamais.`,
  },
]

export default articles
