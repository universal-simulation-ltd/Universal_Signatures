import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'electronic-digital-wet-signatures',
    title: 'Assinaturas eletrónicas, digitais e manuscritas',
    summary: 'Três coisas a que se chama "assinatura", e qual delas esta aplicação cria.',
    group: 'O essencial',
    body: `A palavra "assinatura" é usada para coisas bastante diferentes. Vale a pena saber distingui-las.

## A assinatura manuscrita

É a assinatura tradicional: escreve o seu nome a tinta em papel. Em inglês chama-se assinatura "molhada", porque a tinta ainda está fresca na página.

## A assinatura eletrónica

Uma assinatura eletrónica é qualquer forma eletrónica de mostrar que concorda com um documento. Pode ser tão simples como uma imagem da sua assinatura manuscrita colocada num PDF, um nome escrito no teclado ou uma caixa assinalada num site. Muitos países reconhecem a assinatura eletrónica para uma grande variedade de acordos do dia a dia, embora alguns documentos, como certos atos imobiliários, de família ou judiciais, possam ter regras adicionais.

## A assinatura digital

Uma assinatura digital é um tipo técnico específico de assinatura eletrónica. Usa criptografia e um certificado, normalmente emitido por uma entidade de confiança, para selar o documento. Se alguém alterar o ficheiro depois, um programa como um leitor de PDF consegue detetá-lo e mostrar a assinatura como inválida.

## O que o Universal Signatures cria

O Universal Signatures cria **assinaturas eletrónicas**. Coloca uma imagem da sua assinatura desenhada ou escrita numa página de um PDF. Não acrescenta ao ficheiro uma assinatura digital baseada em certificado.

Se optar por adicionar um certificado de assinatura (consulte "Certificados de assinatura e registos verificáveis"), recebe também um registo independente da impressão digital do documento, que ajuda a mostrar mais tarde que um ficheiro é aquele que assinou. É uma prova útil, mas não é o mesmo que uma assinatura digital baseada em certificado.

## Uma nota sobre a lei

A aceitação de uma assinatura eletrónica depende de onde se encontra, do tipo de documento e do que as outras partes aceitam. Estas são informações gerais e não constituem aconselhamento jurídico. Se um documento for mesmo importante, confirme o que o destinatário aceita ou consulte um profissional qualificado.`,
  },
  {
    id: 'signature-image-formats',
    title: 'Porque é que a sua assinatura é um PNG transparente',
    summary: 'Os formatos de imagem explicados, e porque é que a transparência importa numa assinatura.',
    group: 'O essencial',
    body: `Todas as assinaturas criadas nesta aplicação, sejam desenhadas, escritas ou desenhadas no telemóvel, são transformadas numa imagem PNG com fundo transparente. Eis porquê.

## Píxeis e formatos

Uma imagem digital é uma grelha de pequenos quadrados coloridos chamados píxeis. Um formato de imagem é simplesmente uma forma combinada de guardar essa grelha num ficheiro. Os mais comuns são:

- **JPEG** foi pensado para fotografias. Torna os ficheiros mais pequenos ao descartar pormenores que o olho quase não nota. Não tem transparência, pelo que cada píxel tem uma cor sólida, normalmente branco à volta de uma assinatura.
- **PNG** guarda cada píxel exatamente como era (é "sem perdas") e suporta transparência, pelo que os píxeis podem ser total ou parcialmente transparentes.
- **WebP** é um formato mais recente que pode usar os dois tipos de compressão e também suporta transparência, mas os programas mais antigos nem sempre o reconhecem.

## Porque é que a transparência importa

Os documentos raramente são totalmente brancos. Pode haver uma linha de assinatura, uma caixa sombreada, um campo de formulário ou texto impresso precisamente onde quer assinar. Uma assinatura em JPEG ficaria por cima como um retângulo branco, a tapar o que está por baixo. Um PNG transparente deixa apenas a tinta, e a página vê-se à volta dos traços, tal como com uma caneta.

## Porque é que não ter perdas importa

As assinaturas são linhas finas com contornos nítidos. A compressão do JPEG tende a esbater esses contornos e a deixar pequenas manchas à volta. O PNG mantém as linhas nítidas.

## As assinaturas escritas também passam a imagens

Quando escreve o seu nome, a aplicação desenha-o no tipo de letra cursivo escolhido e guarda o resultado em PNG. Assim, uma assinatura escrita aparece igual em qualquer computador que abra o PDF, mesmo que esse tipo de letra não esteja instalado.`,
  },
  {
    id: 'how-signing-works',
    title: 'O que acontece quando assina um PDF',
    summary: 'Tudo acontece no seu navegador e o documento nunca é enviado.',
    group: 'Como funciona',
    body: `Assinar um PDF no Universal Signatures acontece inteiramente dentro do seu navegador, no seu próprio dispositivo.

## Os passos

1. Cria uma assinatura desenhando-a com o rato, o dedo ou uma caneta digital, escrevendo o seu nome num tipo de letra cursivo ou desenhando-a no telemóvel.
2. Escolhe um PDF. O navegador lê o ficheiro e mostra as páginas, sem o enviar para lado nenhum.
3. Escolhe a página, a posição e o tamanho. Pode encostar a assinatura a um canto, a uma margem ou ao centro, ou escolher um ponto exato numa pré-visualização da página.
4. Se adicionou um nome, uma data ou uma hora, pode carimbá-los por baixo da assinatura.
5. A aplicação coloca a imagem da assinatura na página e propõe-lhe um novo ficheiro para guardar, com "-signed" acrescentado ao nome original.

O seu ficheiro original não é alterado. A cópia assinada é um ficheiro novo.

## Funciona sem ligação

Como assinar não precisa de nenhum servidor, pode assinar um PDF com a ligação à internet desligada. Só as funcionalidades opcionais precisam de ligação: assinar no telemóvel, adicionar um certificado de assinatura e enviar um documento para ser assinado.

## O que faz e o que não faz

- Coloca uma imagem da sua assinatura numa página do documento. Não preenche campos de formulários nem junta vários documentos.
- Não bloqueia o PDF. Qualquer pessoa com o programa adequado poderia continuar a editar a cópia assinada. Um certificado de assinatura regista uma impressão digital do original sem assinatura. Permite mostrar mais tarde que documento assinou, mas não deteta alterações feitas à cópia assinada.
- As assinaturas escritas usam um dos tipos de letra cursivos incluídos ou um ficheiro de tipo de letra que importe. Um tipo de letra importado só é usado no seu dispositivo, durante essa sessão.

## Sugestões

- Assine com um traço firme. Pode sempre tocar em "Clear" e tentar de novo.
- Use o controlo de tamanho em vez do zoom da página, para que a assinatura fique proporcional ao documento.
- Guarde o original sem assinatura se tenciona adicionar um certificado de assinatura, porque é esse original que a impressão digital do certificado descreve.`,
  },
  {
    id: 'sign-on-your-phone',
    title: 'Assinar no telemóvel',
    summary: 'Como o código QR e o PIN levam uma assinatura do telemóvel para o computador.',
    group: 'Como funciona',
    body: `Desenhar uma assinatura com o rato é pouco prático. Assinar no telemóvel permite-lhe usar o dedo no ecrã tátil, enquanto o documento fica no computador.

## Como funciona

1. No computador, escolha a opção de telemóvel. A aplicação mostra um código QR e um PIN de 6 dígitos.
2. Leia o código QR com a câmara do telemóvel. Abre-se uma página de assinatura no navegador do telemóvel.
3. Introduza o PIN no telemóvel e desenhe a sua assinatura.
4. A assinatura aparece no computador, pronta a usar.

## Como a assinatura viaja

O telemóvel e o computador não conseguem comunicar diretamente, por isso a imagem da assinatura viaja pela internet através de um retransmissor em direto. O retransmissor reencaminha a mensagem assim que chega. Não é guardada em nenhuma base de dados, e funciona da mesma forma quer tenha sessão iniciada quer não.

Só a imagem da assinatura faz este percurso. O PDF fica sempre no computador.

## O que protege a transferência

- O código QR contém um código aleatório de utilização única, difícil de adivinhar, pelo que só quem vê o seu ecrã consegue abrir a página certa.
- O computador só aceita uma assinatura que traga o PIN mostrado no seu próprio ecrã. Tudo o resto é ignorado.
- Se quiser recomeçar, pode pedir um novo código QR e um novo PIN.

Trate o código QR e o PIN como qualquer código temporário: não partilhe fotografias do seu ecrã enquanto estiverem visíveis.`,
  },
  {
    id: 'signing-certificates',
    title: 'Certificados de assinatura e registos verificáveis',
    summary: 'O que a página de certificado e o código QR opcionais registam, e o que provam.',
    group: 'Como funciona',
    body: `Quando tem sessão iniciada com um Universal ID, pode assinalar **Add a signing certificate** (adicionar um certificado de assinatura) antes de assinar. É opcional e gratuito.

## O que recebe

- Uma **página de certificado** acrescentada ao fim do PDF assinado.
- Um pequeno **código QR** ao lado da sua assinatura, com a legenda "Scan to verify".
- Um **registo** nos nossos servidores que qualquer pessoa com a ligação pode consultar.

## O que o registo contém

- O endereço de e-mail do seu Universal ID.
- O nome do ficheiro original.
- Uma impressão digital SHA-256 (um "hash") do documento tal como era antes de o assinar.
- A hora em que o registo foi criado, segundo o relógio do nosso servidor.

O documento em si nunca é enviado. Um hash é uma sequência curta de letras e números calculada a partir do conteúdo do ficheiro. O mesmo ficheiro dá sempre o mesmo hash, um ficheiro que difira num único carácter dá um completamente diferente, e não é possível reconstruir o ficheiro a partir do hash.

## A página de certificado

A página separa os dados registados pelo nosso servidor (o seu e-mail verificado, a hora e o ID do certificado) dos dados indicados pelo seu próprio dispositivo (o relógio e o fuso horário). Este segundo grupo está identificado como autodeclarado, porque o relógio de um computador pode ser acertado para qualquer valor. Não é registada nenhuma localização.

## Verificar um documento

Ao ler o código QR, ou abrir a ligação impressa na página de certificado, aparece o registo: quem assinou, o nome do ficheiro, quando foi registado e a impressão digital. Para confirmar que uma cópia é a que foi assinada, calcule o hash SHA-256 do original sem assinatura e compare-o com o apresentado. Se coincidirem, o registo refere-se exatamente a esse ficheiro.

## O que não prova

O registo mostra que um determinado Universal ID registou a impressão digital desse documento nesse momento. Não confirma a identidade de quem assinou para além do endereço de e-mail, e não regista nada sobre onde a pessoa estava.

## Pense no nome do ficheiro

O nome do ficheiro é informação real. Um nome como "Carta de demissão.pdf" diz alguma coisa, mesmo que o conteúdo nunca saia do seu dispositivo. Se isso importar, mude o nome do ficheiro antes ou deixe a caixa por assinalar. A assinatura funciona exatamente da mesma forma sem ela.`,
  },
  {
    id: 'privacy-and-storage',
    title: 'Onde a sua assinatura é guardada',
    summary: 'Guardar neste dispositivo, guardar num ficheiro e o que sai do seu dispositivo.',
    group: 'Privacidade e segurança',
    body: `Pode usar o Universal Signatures sem conta, e sem que nada do que assina saia do seu dispositivo. Eis exatamente o que é guardado, e onde.

## Guardadas neste dispositivo

Pode guardar até seis assinaturas neste navegador para as reutilizar mais tarde. Ficam no armazenamento do próprio navegador neste dispositivo, sem qualquer conta. Limpar os dados do navegador para este site apaga-as, e não o acompanham noutros dispositivos ou navegadores.

## Guardadas num ficheiro

Para usar as suas assinaturas guardadas noutro navegador ou noutro dispositivo, escolha **Guardar num ficheiro**. Obtém um pequeno ficheiro .json com a imagem de cada assinatura guardada, o respetivo nome e etiqueta, se foi desenhada ou escrita, e a data. Abra-o com **Abrir um ficheiro** no outro dispositivo, e as assinaturas são adicionadas às que já lá estão guardadas. Nada é enviado: o ficheiro vai para onde o colocar.

- Pode proteger o ficheiro com uma palavra-passe. Fica então encriptado (AES-256) e só abre com essa palavra-passe. Uma palavra-passe esquecida não pode ser recuperada.
- Sem palavra-passe, qualquer pessoa que obtenha o ficheiro pode ver as suas assinaturas, por isso guarde-o num local privado.
- Abrir um ficheiro nunca substitui o que já está guardado. Uma assinatura que já lá está não é adicionada duas vezes.

Não existe nenhuma cópia online das suas assinaturas guardadas. Se tiver sessão iniciada com um Universal ID e tiver nele uma assinatura principal (guardada na página «Me» do UNI·SIM Hub), a aplicação mostra-a para que possa assinar com ela.

## O que sai do seu dispositivo, e quando

- **Nunca:** um PDF que assina o próprio, em nenhuma funcionalidade desta aplicação.
- **Quando assina no telemóvel:** a imagem da assinatura que desenhou, reencaminhada por um retransmissor em direto e não guardada.
- **Quando adiciona um certificado de assinatura:** o seu endereço de e-mail, o nome do ficheiro e a impressão digital do documento. O registo é guardado enquanto o seu Universal ID existir.
- **Quando envia um PDF para outra pessoa assinar:** o PDF, o seu endereço de e-mail e o dela. Quando a pessoa o abre e assina, o servidor regista também as horas, o endereço IP, o país correspondente e o navegador (a página pública do certificado mostra apenas o país). Um pedido concluído — o PDF, a cópia assinada, estes dados e a página do certificado — é guardado durante 7 anos após a assinatura e depois eliminado; transfira uma cópia para a guardar mais tempo. Retirar um pedido ainda não assinado elimina-o de imediato.
- **Quando tem sessão iniciada:** uma indicação de que a aplicação foi aberta, para que a página de atividade da sua conta esteja correta. Não diz nada sobre os seus documentos.
- **Uma vez por dia, na primeira vez que abre a aplicação:** depois do seu primeiro clique ou da primeira tecla premida, soma-se um à contagem anónima de aberturas diárias. Contém apenas o nome da aplicação e o tipo de plataforma (web): nenhum identificador, nenhuma conta e nada sobre os seus documentos. Uma marca de «já contado hoje» fica neste dispositivo e nunca é enviada.

A aplicação não contém scripts de publicidade nem de rastreio de terceiros.

## O seu Universal ID

O seu Universal ID é a conta única partilhada pelas aplicações UNI·SIM. Só precisa dele para duas coisas que envolvem outra pessoa: um certificado de assinatura que outros podem verificar e o envio de um documento para ser assinado. Assinar um PDF, e guardar ou transferir as suas assinaturas, nunca o exige.`,
  },
]

export default articles
