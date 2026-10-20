import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'electronic-digital-wet-signatures',
    title: 'Firmas electrónicas, digitales y manuscritas',
    summary: 'Tres cosas a las que se llama «firma», y cuál crea esta aplicación.',
    group: 'Lo básico',
    body: `La palabra «firma» se usa para cosas bastante distintas. Conviene saber diferenciarlas.

## La firma manuscrita

Es la firma de siempre: usted escribe su nombre con tinta sobre papel. En inglés se la llama firma «húmeda», porque la tinta aún está fresca en la página.

## La firma electrónica

Una firma electrónica es cualquier forma electrónica de mostrar que usted acepta un documento. Puede ser tan sencilla como una imagen de su firma manuscrita colocada en un PDF, un nombre escrito con el teclado o una casilla marcada en un sitio web. Muchos países reconocen la firma electrónica para una amplia variedad de acuerdos cotidianos, aunque algunos documentos, como ciertos trámites inmobiliarios, familiares o judiciales, pueden tener normas adicionales.

## La firma digital

Una firma digital es un tipo técnico concreto de firma electrónica. Utiliza criptografía y un certificado, normalmente emitido por una entidad de confianza, para sellar el documento. Si alguien modifica el archivo después, un programa como un lector de PDF puede detectarlo e indicar que la firma ya no es válida.

## Qué crea Universal Signatures

Universal Signatures crea **firmas electrónicas**. Coloca una imagen de su firma dibujada o escrita en una página de un PDF. No añade al archivo una firma digital basada en certificados.

Si decide añadir un certificado de firma (consulte «Certificados de firma y registros verificables»), también obtiene un registro independiente de la huella del documento, que ayuda a demostrar más adelante que un archivo es el que usted firmó. Es una prueba útil, pero no equivale a una firma digital basada en certificados.

## Una nota sobre la ley

Que una firma electrónica sea aceptable depende de dónde se encuentre, del tipo de documento y de lo que acepten las demás partes. Esta es información general, no asesoramiento jurídico. Si un documento es importante, compruebe qué acepta el destinatario o consulte a un profesional cualificado.`,
  },
  {
    id: 'signature-image-formats',
    title: 'Por qué su firma es un PNG transparente',
    summary: 'Los formatos de imagen explicados, y por qué la transparencia importa en una firma.',
    group: 'Lo básico',
    body: `Toda firma que cree en esta aplicación, ya sea dibujada, escrita o dibujada en su teléfono, se convierte en una imagen PNG con fondo transparente. Le explicamos por qué.

## Píxeles y formatos

Una imagen digital es una cuadrícula de diminutos cuadrados de color llamados píxeles. Un formato de imagen es simplemente una forma acordada de guardar esa cuadrícula en un archivo. Los más habituales son:

- **JPEG** está pensado para fotografías. Reduce el tamaño de los archivos descartando detalles que el ojo apenas percibe. No admite transparencia, así que cada píxel tiene un color sólido, normalmente blanco alrededor de una firma.
- **PNG** conserva cada píxel exactamente como era (es un formato «sin pérdida») y admite transparencia, de modo que los píxeles pueden ser total o parcialmente transparentes.
- **WebP** es un formato más reciente que puede usar ambos tipos de compresión y también admite transparencia, aunque los programas más antiguos no siempre lo reconocen.

## Por qué importa la transparencia

Los documentos rara vez son de un blanco puro. Puede haber una línea para firmar, un recuadro sombreado, un campo de formulario o texto impreso justo donde usted quiere firmar. Una firma en JPEG quedaría encima como un rectángulo blanco que taparía lo que hay debajo. Un PNG transparente deja solo la tinta, y la página se ve alrededor de los trazos, igual que con un bolígrafo.

## Por qué importa que no haya pérdida

Las firmas son líneas finas con bordes nítidos. La compresión del JPEG suele desdibujar esos bordes y dejar pequeñas manchas alrededor. El PNG mantiene las líneas nítidas.

## Las firmas escritas también se convierten en imágenes

Cuando usted escribe su nombre, la aplicación lo dibuja con la fuente cursiva elegida y guarda el resultado como PNG. Así, una firma escrita se ve igual en cualquier ordenador que abra el PDF, aunque no tenga esa fuente instalada.`,
  },
  {
    id: 'how-signing-works',
    title: 'Qué ocurre cuando firma un PDF',
    summary: 'Todo ocurre en su navegador y el documento nunca se sube.',
    group: 'Cómo funciona',
    body: `Firmar un PDF con Universal Signatures ocurre por completo dentro de su navegador web, en su propio dispositivo.

## Los pasos

1. Usted crea una firma dibujándola con el ratón, el dedo o un lápiz óptico, escribiendo su nombre con una fuente cursiva o dibujándola en su teléfono.
2. Elige un PDF. Su navegador lee el archivo y muestra sus páginas, sin enviarlo a ningún sitio.
3. Elige la página, la posición y el tamaño. Puede colocar la firma en una esquina, en un borde o en el centro, o elegir un punto exacto en una vista previa de la página.
4. Si añadió un nombre, una fecha o una hora, puede estamparlos debajo de la firma.
5. La aplicación coloca la imagen de la firma en la página y le ofrece un archivo nuevo para guardar, con «-signed» añadido al nombre original.

Su archivo original no se modifica. La copia firmada es un archivo nuevo.

## Funciona sin conexión

Como firmar no necesita ningún servidor, puede firmar un PDF con la conexión a internet desactivada. Solo las funciones opcionales necesitan conexión: firmar en el teléfono, añadir un certificado de firma y enviar un documento para que lo firmen.

## Qué hace y qué no hace

- Coloca una imagen de su firma en una página del documento. No rellena campos de formulario ni une varios documentos.
- No bloquea el PDF. Cualquier persona con el programa adecuado podría seguir editando la copia firmada. Un certificado de firma guarda una huella del original sin firmar. Sirve para demostrar más adelante qué documento firmó, pero no detecta cambios hechos en la copia firmada.
- Las firmas escritas usan una de las fuentes cursivas incluidas o un archivo de fuente que usted importe. Una fuente importada solo se usa en su dispositivo durante esa sesión.

## Consejos

- Firme con un trazo firme. Siempre puede pulsar «Clear» y volver a intentarlo.
- Use el control de tamaño en lugar de ampliar la página, para que la firma guarde proporción con el documento.
- Conserve el original sin firmar si piensa añadir un certificado de firma, porque la huella del certificado describe ese original.`,
  },
  {
    id: 'sign-on-your-phone',
    title: 'Firmar en su teléfono',
    summary: 'Cómo el código QR y el PIN llevan una firma del teléfono al ordenador.',
    group: 'Cómo funciona',
    body: `Dibujar una firma con el ratón resulta incómodo. Firmar en su teléfono le permite usar el dedo sobre una pantalla táctil, mientras el documento permanece en su ordenador.

## Cómo funciona

1. En su ordenador, elija la opción del teléfono. La aplicación muestra un código QR y un PIN de 6 cifras.
2. Escanee el código QR con la cámara de su teléfono. Se abre una página de firma en el navegador del teléfono.
3. Introduzca el PIN en el teléfono y dibuje su firma.
4. La firma aparece en su ordenador, lista para usar.

## Cómo viaja la firma

Su teléfono y su ordenador no pueden comunicarse directamente, así que la imagen de la firma viaja por internet a través de un relé en directo. El relé reenvía el mensaje en cuanto llega. No se guarda en ninguna base de datos, y funciona igual tanto si ha iniciado sesión como si no.

Solo la imagen de la firma hace este recorrido. El PDF permanece en su ordenador en todo momento.

## Qué lo mantiene privado

- El código QR contiene un código aleatorio de un solo uso, difícil de adivinar, de modo que solo alguien que vea su pantalla puede abrir la página correcta.
- Su ordenador solo acepta una firma que lleve el PIN mostrado en su propia pantalla. Cualquier otra cosa se ignora.
- Si quiere empezar de nuevo, puede pedir un código QR y un PIN nuevos.

Trate el código QR y el PIN como cualquier código temporal: no comparta una foto de su pantalla mientras se muestran.`,
  },
  {
    id: 'signing-certificates',
    title: 'Certificados de firma y registros verificables',
    summary: 'Qué registran la página de certificado y el código QR opcionales, y qué demuestran.',
    group: 'Cómo funciona',
    body: `Si ha iniciado sesión con un Universal ID, puede marcar **Add a signing certificate** (añadir un certificado de firma) antes de firmar. Es opcional y gratuito.

## Qué obtiene

- Una **página de certificado** añadida al final del PDF firmado.
- Un pequeño **código QR** junto a su firma, con el texto «Scan to verify».
- Un **registro** en nuestros servidores que cualquiera con el enlace puede consultar.

## Qué contiene el registro

- La dirección de correo electrónico de su Universal ID.
- El nombre del archivo original.
- Una huella SHA-256 (un «hash») del documento tal como era antes de firmarlo.
- La hora en que se creó el registro, según el reloj de nuestro servidor.

El documento en sí nunca se sube. Un hash es una cadena corta de letras y números calculada a partir del contenido del archivo. El mismo archivo siempre da el mismo hash, un archivo que difiera en un solo carácter da uno completamente distinto, y no es posible reconstruir el archivo a partir de su hash.

## La página de certificado

La página separa los datos registrados por nuestro servidor (su correo verificado, la hora y el identificador del certificado) de los que informó su propio dispositivo (su reloj y su zona horaria). La página indica que este segundo grupo es autodeclarado, porque el reloj de un ordenador puede ajustarse a cualquier valor. No se registra ninguna ubicación.

## Comprobar un documento

Al escanear el código QR, o al abrir el enlace impreso en la página de certificado, se muestra el registro: quién firmó, el nombre del archivo, cuándo se registró y la huella. Para confirmar que una copia es la que se firmó, calcule el hash SHA-256 del original sin firmar y compárelo con el que aparece. Si coinciden, el registro se refiere a ese archivo exacto.

## Qué no demuestra

El registro muestra que un Universal ID concreto registró la huella de ese documento en ese momento. No confirma la identidad del firmante más allá de su dirección de correo, y no registra nada sobre dónde se encontraba.

## Piense en el nombre del archivo

El nombre del archivo es información real. Un nombre como «Carta de dimisión.pdf» dice algo aunque el contenido nunca salga de su dispositivo. Si eso le importa, cambie antes el nombre del archivo o deje la casilla sin marcar. La firma funciona exactamente igual sin ella.`,
  },
  {
    id: 'privacy-and-storage',
    title: 'Dónde se guarda su firma',
    summary: 'Guardar en este dispositivo, guardar en un archivo y qué sale de su dispositivo.',
    group: 'Privacidad y seguridad',
    body: `Puede usar Universal Signatures sin cuenta y sin que nada de lo que firme salga de su dispositivo. Esto es exactamente lo que se guarda, y dónde.

## Guardadas en este dispositivo

Puede conservar hasta seis firmas en este navegador para reutilizarlas más adelante. Se guardan en el almacenamiento propio de su navegador en este dispositivo, sin ninguna cuenta. Si borra los datos del navegador para este sitio, se eliminan, y no le acompañan a otros dispositivos ni navegadores.

## Guardadas en un archivo

Para usar sus firmas guardadas en otro navegador o en otro dispositivo, elija **Guardar en un archivo**. Obtendrá un pequeño archivo .json con la imagen de cada firma guardada, su nombre y su etiqueta, si se dibujó o se escribió, y la fecha. Ábralo con **Abrir un archivo** en el otro dispositivo y las firmas se añadirán a las que ya estén guardadas allí. No se sube nada: el archivo va donde usted lo ponga.

- Puede ponerle una contraseña al archivo. Entonces se cifra (AES-256) y solo se abre con esa contraseña. Una contraseña olvidada no se puede recuperar.
- Sin contraseña, cualquiera que obtenga el archivo puede ver sus firmas, así que guárdelo en un lugar privado.
- Abrir un archivo nunca sustituye lo que ya está guardado. Una firma que ya está ahí no se añade dos veces.

No existe ninguna copia en línea de sus firmas guardadas. Si ha iniciado sesión con un Universal ID y tiene en él una firma principal (guardada en la página «Me» del UNI·SIM Hub), la aplicación la muestra para que pueda firmar con ella.

## Qué sale de su dispositivo, y cuándo

- **Nunca:** un PDF que firma usted mismo, en ninguna de las funciones de esta aplicación.
- **Cuando firma en el teléfono:** la imagen de la firma que dibujó, que pasa por un relé en directo y no se guarda.
- **Cuando añade un certificado de firma:** su dirección de correo, el nombre del archivo y la huella del documento. El registro se conserva mientras exista su Universal ID.
- **Cuando envía un PDF para que otra persona lo firme:** el PDF, su dirección de correo y la de esa persona. Cuando lo abre y lo firma, el servidor registra además las horas, su dirección IP, el país correspondiente y su navegador (la página pública del certificado solo muestra el país). Una solicitud completada —el PDF, la copia firmada, estos datos y su página de certificado— se conserva 7 años después de la firma y luego se elimina; descargue una copia para conservarla más tiempo. Retirar una solicitud que no se ha firmado la elimina de inmediato.
- **Cuando ha iniciado sesión:** un aviso de que se abrió la aplicación, para que la página de actividad de su cuenta sea exacta. No dice nada de sus documentos.
- **Una vez al día, la primera vez que abre la aplicación:** tras su primer clic o pulsación de tecla, se suma uno al recuento anónimo de aperturas diarias. Solo contiene el nombre de la aplicación y el tipo de plataforma (web): ningún identificador, ninguna cuenta y nada sobre sus documentos. Una marca de «ya contado hoy» se queda en este dispositivo y nunca se envía.

La aplicación no contiene scripts de publicidad ni de seguimiento de terceros.

## Su Universal ID

Su Universal ID es la cuenta única que comparten las aplicaciones de UNI·SIM. Solo la necesita para dos cosas en las que interviene otra persona: un certificado de firma que otros pueden comprobar y el envío de un documento para que lo firmen. Firmar un PDF, y guardar o trasladar sus firmas, nunca la requiere.`,
  },
]

export default articles
