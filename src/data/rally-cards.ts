export interface RallyCard {
  id: string;
  title: string;
  decoration: string;
  content: string;
  signature: string;
  nextCode?: string;
  isIntro?: boolean;
  isFinal?: boolean;
}

export const rallyCards: RallyCard[] = [
  {
    id: "intro",
    title: "¡Hola, María!",
    decoration: "\u{1F384}\u2728\u{1F384}",
    content: `
      <p>Mi nombre es <span class="highlight">Kin</span> y soy un aluxe. Llevo siglos cuidando casas aquí en la selva maya. (Antes esto era selva, no existía Jardines del Sur 6, ni semáforos, ni tráfico. Se extrañan esos días, mano.)</p>
      <p>He visto a muchos humanos hacer algo extraño cada diciembre: se dan cosas envueltas en papel bonito y sonríen mucho. Nunca lo entendí. ¿Por qué no solo se dan las cosas? ¿Por qué el papel? ¿Por qué los moños? Ustedes son raros.</p>
      <p>Este año decidí investigar, y te elegí a ti como mi maestra.</p>
      <p>Escondí <span class="highlight">12 regalos</span> por tu casa. Cada uno me ayudará a entender algo nuevo sobre ustedes, los humanos.</p>
      <p><strong>¿Me enseñas?</strong></p>
      <p>Tu primera lección comienza aquí en la sala. Me dijeron que a los humanos les gusta reír con sus amigos...</p>
      <div class="hint">Busca detrás de donde descansas la cabeza cuando ves TikToks. \u{1F6CB}\u{FE0F}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "TACO",
    isIntro: true,
  },
  {
    id: "card1",
    title: "Lección 1: Los humanos disfrutan reír juntos",
    decoration: "\u{1F3AE}",
    content: `
      <p>¡Lo encontraste!</p>
      <p>Me contaron que este juego lo jugaste con amigos y te gustó mucho. Qué curioso... ¿por qué gritar "TACO GATO CABRA QUESO PIZZA" los hace tan felices? Son palabras sin sentido. (Aunque debo admitir que lo grité solo en tu sala y sí se escucha divertido)</p>
      <p>No lo entiendo del todo, pero me gusta cómo se te ilumina la cara cuando te diviertes.</p>
      <div class="lesson">Primera lección aprendida: los humanos son más felices cuando ríen acompañados.</div>
      <p>Ahora vamos por la segunda lección. Me dijeron que los humanos se cuidan entre ellos...</p>
      <div class="hint">Ve a donde te lavas las manos cuando llegas a casa. Busca abajo. \u{1F6BF}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "PIEL",
  },
  {
    id: "card2",
    title: "Lección 2: Los humanos se cuidan entre ellos",
    decoration: "\u{1F9F4}",
    content: `
      <p>¡Muy bien, María!</p>
      <p>Este regalo es para tu piel. Me dijeron que a veces se te reseca y que alguien quiere que estés siempre cómoda.</p>
      <p>Qué raro... ¿por qué a un humano le importa la piel de otro humano? Los aluxes no tenemos ese problema. (Bueno, sí tenemos piel de duende de 800 años, pero nadie nos regala cremas)</p>
      <div class="lesson">Segunda lección aprendida: los humanos demuestran amor cuidando el cuerpo del otro. Qué tiernos son ustedes.</div>
      <p>La tercera lección tiene que ver con algo que no entiendo: probar cosas sin saber si funcionan...</p>
      <div class="hint">Ve donde se lava la ropa a mano. Busca encima. \u{1FAE7}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "PIES",
  },
  {
    id: "card3",
    title: "Lección 3: A los humanos les gusta experimentar",
    decoration: "\u{1F9B6}",
    content: `
      <p>¡Ahí está!</p>
      <p>Me contaron que no sabes si esto realmente funciona... ¿y aún así lo quieres probar? Los aluxes no hacemos eso. Si algo no es seguro, no lo tocamos. Por eso seguimos vivos después de siglos. (Bueno, "vivos" es un término complicado para un aluxe, pero me entiendes.)</p>
      <p>Pero ustedes los humanos son curiosos. Les emociona lo desconocido.</p>
      <div class="lesson">Tercera lección aprendida: los humanos disfrutan experimentar cosas nuevas, aunque no sepan el resultado.</div>
      <p>Ahora subimos. La siguiente lección tiene que ver con las historias...</p>
      <div class="hint">Ve a las escaleras y busca donde haces una pausa antes de seguir subiendo. \u{1FA9C}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "LIBRO",
  },
  {
    id: "card4",
    title: "Lección 4: Las historias hacen sentir a los humanos",
    decoration: "\u{1F4DA}",
    content: `
      <p>¡Lo encontraste!</p>
      <p>Sé que tu libro favorito es "La Ganadora" de este autor, pero no lo encontré en ninguna librería. (Kin hizo su mejor esfuerzo, ¿eh? No es fácil buscar libros cuando mides 30 centímetros y los vendedores te ven raro.)</p>
      <p>Pero este es del mismo escritor, y dicen que las historias conectan. Que los humanos leen para sentir cosas que no viven.</p>
      <div class="lesson">Cuarta lección aprendida: los humanos usan las historias para sentir, soñar y escapar.</div>
      <p>La siguiente lección me confunde mucho... tiene que ver con las inseguridades.</p>
      <div class="hint">Sigue subiendo y ve donde están los libros del estudio. \u{1F4DA}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "MANOS",
  },
  {
    id: "card5",
    title: "Lección 5: Los humanos a veces son inseguros, y está bien",
    decoration: "\u{1F932}",
    content: `
      <p>¡Aquí está!</p>
      <p>Me contaron que a veces te da pena saludar con las manos resecas. ¿Pena? ¿Por unas manos?</p>
      <p>Los aluxes no entendemos eso. Yo tengo manos de duende milenario y saludo a todos con mucha confianza. (Bueno, no saludo a nadie porque técnicamente soy invisible, pero si pudiera, lo haría)</p>
      <p>Pero alguien quiere que nunca más sientas esa incomodidad.</p>
      <div class="lesson">Quinta lección aprendida: los humanos tienen pequeñas inseguridades, y los que los aman las ven y las cuidan.</div>
      <p>La siguiente lección habla de empezar cosas nuevas...</p>
      <div class="hint">Ve al cuarto de visitas. Busca donde dormirías si fueras invitada. \u{1F6CF}\u{FE0F}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "PILATES",
  },
  {
    id: "card6",
    title: "Lección 6: A los humanos les emociona comenzar cosas nuevas",
    decoration: "\u{1F9D8}\u200D\u2640\u{FE0F}",
    content: `
      <p>¡Muy bien!</p>
      <p>Me dijeron que te acabas de meter a clases de pilates. Qué valiente. Los aluxes llevamos siglos haciendo lo mismo: cuidar casas, espantar intrusos, esconder llaves de vez en cuando para divertirnos. (¿A poco creías que las perdías tú solita?)</p>
      <p>Pero tú decidiste probar algo nuevo. Eso me inspira.</p>
      <div class="lesson">Sexta lección aprendida: los humanos crecen cuando se atreven a empezar de cero.</div>
      <p>Las siguientes lecciones tienen que ver con algo que ustedes llaman "skincare"... (¿Por qué tantos productos? Yo me lavo la cara con rocío de la selva y ya. Bueno, no tengo cara exactamente, pero si la tuviera.)</p>
      <div class="hint">Ve al baño que tiene tu nombre. Busca donde cae el agua. \u{1F6BF}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "OJOS",
  },
  {
    id: "card7",
    title: "Lección 7: A los humanos les gusta consentirse",
    decoration: "\u{1F441}\u{FE0F}",
    content: `
      <p>¡Lo hallaste!</p>
      <p>Esto es para tus ojos. Me dicen que te gusta el skincare, así que esto es para que te consientas.</p>
      <p>Al principio pensé que era vanidad, pero ya entendí: cuidarse es una forma de respetarse. (Además, si yo tuviera ojeras de trabajar tanto como tú, también querría unos parches. Ser adulto humano se ve agotador.)</p>
      <div class="lesson">Séptima lección aprendida: los humanos se consienten porque saben que lo merecen.</div>
      <p>Hay más skincare... (En serio, ¿cuántos productos necesitan? Tengo 800 años y nunca he necesitado tantos pasos.)</p>
      <div class="hint">Ve al closet. Busca donde guardan los zapatos. \u{1F45F}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "LABIOS",
  },
  {
    id: "card8",
    title: "Lección 8: El cuidado personal es un ritual",
    decoration: "\u{1F48B}",
    content: `
      <p>¡Excelente!</p>
      <p>Más skincare. Esto es para tus labios. (Ya van tres productos para la cara. ¿Cuántas caras tienen ustedes?)</p>
      <p>Ya entendí que para los humanos, cuidarse no es un evento, es un ritual. Algo que hacen todos los días con amor y paciencia.</p>
      <div class="lesson">Octava lección aprendida: los humanos convierten el autocuidado en un momento sagrado. Casi como los rituales de mis ancestros mayas, pero con más ácido hialurónico.</div>
      <p>La siguiente lección es mi favorita hasta ahora...</p>
      <div class="hint">Ve al cuarto principal. Busca debajo de donde sueñas. \u{1F6CF}\u{FE0F}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "JUGAR",
  },
  {
    id: "card9",
    title: "Lección 9: Los humanos nunca pierden a su niño interior",
    decoration: "\u{1F3A8}",
    content: `
      <p>¡Este me emociona!</p>
      <p>Este regalo es para el niño interior que llevas dentro.</p>
      <p>Me contaron que alguien está muy orgulloso de ti. Y que tus papás también lo están.</p>
      <p>A veces los adultos olvidan jugar. Pagan impuestos, van al SAT (he visto cosas horribles, María). Pero tú no olvidas jugar. Y eso te hace especial.</p>
      <div class="lesson">Novena lección aprendida: los mejores humanos son los que nunca dejan de jugar.</div>
      <p>Ahora vamos por algo dulce... baja las escaleras.</p>
      <div class="hint">Ve donde guardan la comida que no se echa a perder. Busca hasta abajo, por las cervezas. \u{1F37A}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "DULCE",
  },
  {
    id: "card10",
    title: "Lección 10: Lo dulce hace felices a los humanos",
    decoration: "\u{1F353}",
    content: `
      <p>¡Mmmm!</p>
      <p>Me dijeron que te gusta lo dulce, y que esto es un gran snack.</p>
      <p>Los aluxes comemos pozole que nos dejan de ofrenda. (Cuando se acuerdan de nosotros. Que no es muy seguido. No estoy resentido. Bueno, sí un poco.) Pero ustedes tienen dulces de fresa con forma de osito. Qué gran época para estar vivo.</p>
      <div class="lesson">Décima lección aprendida: a veces la felicidad viene en forma de snack.</div>
      <p>Ya casi terminamos... la siguiente lección habla de los gustos favoritos.</p>
      <div class="hint">Ve donde guardan los sartenes. \u{1F373}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "PISTACHE",
  },
  {
    id: "card11",
    title: "Lección 11: Los humanos tienen gustos muy específicos",
    decoration: "\u{1F95C}",
    content: `
      <p>¡Tus favoritos!</p>
      <p>Me contaron que esta es tu marca favorita de pistaches. No cualquier pistache. ESTOS pistaches. De la bolsa morada. (¿O era verde? Ya no me acuerdo. Espero que sean los correctos o esto va a ser muy incómodo.)</p>
      <p>Los aluxes no entendemos eso. Comida es comida. Pero para ustedes, las preferencias importan.</p>
      <div class="lesson">Décimo primera lección aprendida: los humanos que te aman ponen atención a tus gustos específicos.</div>
      <p>María, ya aprendí 11 lecciones gracias a ti. Pero falta la más importante...</p>
      <div class="hint">Ve al comedor. Alguien te espera con la última lección. \u2764\u{FE0F}</div>
    `,
    signature: "—Kin \u{1F33F}",
    nextCode: "AMOR",
  },
  {
    id: "card12",
    title: "Lección 12: El amor es el mejor regalo",
    decoration: "\u{1F49D}",
    content: `
      <p>María, lo entendí todo.</p>
      <p>Los humanos no se regalan cosas por las cosas. Se regalan atención, cuidado, risas, dulces y recuerdos.</p>
      <p>Este último regalo lo escogió alguien que te ama mucho. Es una ilustración de ustedes dos, de una boda que vivieron juntos. Él compró el marco y lo ajustó. (Y yo lo ayudé a esconder todo esto. Bueno, más o menos. Él hizo todo, yo solo observé.)</p>
      <p><span class="highlight">5 años de amor.</span></p>
      <div class="lesson">Última lección aprendida: el espíritu navideño no está en el papel bonito ni en las cajas. Está en el amor que alguien pone al elegir cada detalle.</div>
      <p>Gracias por enseñarme, María.</p>
      <p style="font-size: 1.3rem; text-align: center; margin-top: 25px;"><strong>Feliz Navidad, chiquiflaquis. \u{1F384}\u2764\u{FE0F}</strong></p>
    `,
    signature:
      '—Kin \u{1F33F}<br><br><em style="font-size: 0.9rem; opacity: 0.8;">(Y gracias a ti también, Angel. Cuídala bien. Estaré vigilando.)</em>',
    isFinal: true,
  },
];
