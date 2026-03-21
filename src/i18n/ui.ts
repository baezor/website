export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = 'en';

// Locale codes for date formatting and other locale-specific operations
export const locales = {
  en: 'en-US',
  es: 'es-MX',
} as const;

export const ui = {
  'nav.home': {
    en: 'Home',
    es: 'Inicio',
  },
  'nav.blog': {
    en: 'Blog',
    es: 'Blog',
  },
  'nav.contact': {
    en: 'Contact',
    es: 'Contacto',
  },
  'nav.run': {
    en: 'Run',
    es: 'Carrera',
  },
  'nav.menu': {
    en: 'Menu',
    es: 'Menú',
  },
  'nav.aria.home': {
    en: 'Angel Baez - Home',
    es: 'Angel Baez - Inicio',
  },
  'nav.aria.toggle': {
    en: 'Toggle menu',
    es: 'Alternar menú',
  },
  'home.bio': {
    en: 'I build AI agents and autonomous systems that get things done. From agentic workflows to full-stack applications, I create software that works on your behalf.',
    es: 'Construyo agentes de IA y sistemas autónomos que hacen el trabajo. Desde flujos de trabajo agénticos hasta aplicaciones full-stack, creo software que trabaja por ti.',
  },
  'home.aria.about': {
    en: 'About {name}',
    es: 'Acerca de {name}',
  },
  'home.hero.subtitle': {
    en: 'Agentic Developer & Entrepreneur',
    es: 'Desarrollador Agéntico & Emprendedor',
  },
  'home.about.heading': {
    en: 'About Me',
    es: 'Sobre Mí',
  },
  'home.about.text': {
    en: 'I\'ve been building software for over a decade, working with startups and established companies. Currently focused on AI agents, agentic workflows, and intelligent automation — creating systems that think, decide, and act.',
    es: 'He estado desarrollando software por más de una década, trabajando con startups y empresas establecidas. Actualmente enfocado en agentes de IA, flujos de trabajo agénticos y automatización inteligente — creando sistemas que piensan, deciden y actúan.',
  },
  'home.about.cta': {
    en: 'Learn more about me',
    es: 'Conocer más sobre mí',
  },
  'home.posts.heading': {
    en: 'Latest Posts',
    es: 'Últimos Artículos',
  },
  'home.posts.viewAll': {
    en: 'View all posts →',
    es: 'Ver todos los artículos →',
  },
  'home.contact.heading': {
    en: 'Let\'s Work Together',
    es: 'Trabajemos Juntos',
  },
  'home.contact.text': {
    en: 'Have a project in mind or want to collaborate on something interesting? I\'m always open to new opportunities and conversations.',
    es: '¿Tienes un proyecto en mente o quieres colaborar en algo interesante? Siempre estoy abierto a nuevas oportunidades y conversaciones.',
  },
  'home.contact.cta': {
    en: 'Get in Touch',
    es: 'Contáctame',
  },
  'blog.title': {
    en: 'Blog',
    es: 'Blog',
  },
  'blog.description': {
    en: 'Latest articles and updates',
    es: 'Últimos artículos y actualizaciones',
  },
  'blog.readMore': {
    en: 'Read more →',
    es: 'Leer más →',
  },
  'blog.readMore.aria': {
    en: 'Read more about {title}',
    es: 'Leer más sobre {title}',
  },
  'blog.backToAll': {
    en: '← Back to all posts',
    es: '← Volver a todos los artículos',
  },
  'blog.updated': {
    en: 'Updated:',
    es: 'Actualizado:',
  },
  'blog.readingTime': {
    en: 'min read',
    es: 'min de lectura',
  },
  'blog.readingTime.aria': {
    en: 'Estimated reading time: {time} minutes',
    es: 'Tiempo estimado de lectura: {time} minutos',
  },
  'blog.post': {
    en: 'post',
    es: 'artículo',
  },
  'blog.posts': {
    en: 'posts',
    es: 'artículos',
  },
  'contact.title': {
    en: 'Contact Me',
    es: 'Contáctame',
  },
  'contact.intro': {
    en: 'Feel free to reach out with questions, project inquiries, or just to say hello. I\'m always open to new opportunities and connections.',
    es: 'No dudes en contactarme con preguntas, consultas de proyectos, o simplemente para saludar. Siempre estoy abierto a nuevas oportunidades y conexiones.',
  },
  'contact.form.name': {
    en: 'Name',
    es: 'Nombre',
  },
  'contact.form.email': {
    en: 'Email',
    es: 'Correo electrónico',
  },
  'contact.form.subject': {
    en: "What's this about?",
    es: '¿De qué se trata?',
  },
  'contact.form.message': {
    en: 'Message',
    es: 'Mensaje',
  },
  'contact.form.submit': {
    en: 'Send Message',
    es: 'Enviar Mensaje',
  },
  'contact.form.success': {
    en: 'Thank you! Your message has been sent successfully.',
    es: '¡Gracias! Tu mensaje ha sido enviado exitosamente.',
  },
  'contact.lookingForward': {
    en: 'Looking forward to hearing from you!',
    es: '¡Espero saber de ti pronto!',
  },
  'category.title': {
    en: 'Category: {category}',
    es: 'Categoría: {category}',
  },
  'tag.title': {
    en: 'Tag: {tag}',
    es: 'Etiqueta: {tag}',
  },
  'breadcrumb.blog': {
    en: 'Blog',
    es: 'Blog',
  },
  'breadcrumb.separator': {
    en: '/',
    es: '/',
  },
  'footer.socialLinks': {
    en: 'Social media links',
    es: 'Enlaces de redes sociales',
  },
  'links.aria.connect': {
    en: 'Connect with Angel Baez',
    es: 'Conecta con Angel Baez',
  },
  'links.aria.social': {
    en: 'Social media profiles',
    es: 'Perfiles de redes sociales',
  },
  'lang.switch.toSpanish': {
    en: 'ES - Switch to Spanish',
    es: 'ES - Cambiar a español',
  },
  'lang.switch.toEnglish': {
    en: 'EN - Switch to English',
    es: 'EN - Cambiar a inglés',
  },
  'lang.current': {
    en: 'EN',
    es: 'ES',
  },
  'theme.aria.toggle': {
    en: 'Toggle dark mode',
    es: 'Alternar modo oscuro',
  },
  'notFound.title': {
    en: 'Page Not Found',
    es: 'Página No Encontrada',
  },
  'notFound.message': {
    en: 'Sorry, the page you\'re looking for doesn\'t exist.',
    es: 'Lo siento, la página que buscas no existe.',
  },
  'notFound.back': {
    en: 'Go back home',
    es: 'Volver al inicio',
  },
  'links.prepain.label': {
    en: 'Prepa IN\'s Blog (Spanish)',
    es: 'Blog de Prepa IN (Español)',
  },
  'links.prepain.aria': {
    en: 'Visit Angel Baez on Prepa IN\'s Blog',
    es: 'Visita a Angel Baez en el Blog de Prepa IN',
  },
  'links.linkedin.label': {
    en: 'Add me to your network on LinkedIn',
    es: 'Agrégame a tu red en LinkedIn',
  },
  'links.linkedin.aria': {
    en: 'Visit Angel Baez on LinkedIn',
    es: 'Visita a Angel Baez en LinkedIn',
  },
  'links.github.label': {
    en: 'Check out my GitHub',
    es: 'Revisa mi GitHub',
  },
  'links.github.aria': {
    en: 'Visit Angel Baez on GitHub',
    es: 'Visita a Angel Baez en GitHub',
  },
  'links.run.label': {
    en: '2026 KM Running Challenge',
    es: 'corriendo 2026 km en 2026',
  },
  'links.run.aria': {
    en: 'Track my 2026 KM running challenge progress',
    es: 'Sigue mi progreso en el desafío de 2026 KM corriendo',
  },
  'run.title': {
    en: '2026 KM Running Challenge',
    es: 'Desafío de 2026 KM',
  },
  'run.description': {
    en: 'Tracking my journey to run 2026 kilometers in 2026. Real-time progress powered by Strava.',
    es: 'Siguiendo mi camino para correr 2026 kilómetros en 2026. Progreso en tiempo real con Strava.',
  },
  'run.intro': {
    en: 'Tracking my journey to run 2026 kilometers in 2026. Data synced from Strava and updated in real-time via webhooks.',
    es: 'Siguiendo mi camino para correr 2026 kilómetros en 2026. Datos sincronizados desde Strava y actualizados en tiempo real vía webhooks.',
  },
  'run.error': {
    en: 'Unable to load challenge data. Please try again later.',
    es: 'No se pueden cargar los datos del desafío. Por favor, intenta más tarde.',
  },
  'run.progress.label': {
    en: 'Progress',
    es: 'Progreso',
  },
  'run.progress.of': {
    en: 'of',
    es: 'de',
  },
  'run.progress.goal': {
    en: 'goal',
    es: 'meta',
  },
  'run.stats.totalDistance': {
    en: 'Total Distance',
    es: 'Distancia Total',
  },
  'run.stats.remaining': {
    en: 'Remaining',
    es: 'Restante',
  },
  'run.stats.daysLeft': {
    en: 'Days Left',
    es: 'Días Restantes',
  },
  'run.stats.paceNeeded': {
    en: 'Pace Needed',
    es: 'Ritmo Necesario',
  },
  'run.stats.currentAverage': {
    en: 'Current Average',
    es: 'Promedio Actual',
  },
  'run.stats.onTrack': {
    en: 'On Track! ✓',
    es: '¡En Camino! ✓',
  },
  'run.stats.behind': {
    en: 'Behind Schedule ⚠',
    es: 'Atrasado ⚠',
  },
  'run.stats.ahead': {
    en: '{km} km ahead!',
    es: '¡{km} km adelante!',
  },
  'run.stats.behindBy': {
    en: '{km} km behind',
    es: '{km} km atrás',
  },
  'run.activities.title': {
    en: 'Recent Activities',
    es: 'Actividades Recientes',
  },
  'run.activities.distance': {
    en: 'Distance',
    es: 'Distancia',
  },
  'run.activities.pace': {
    en: 'Pace',
    es: 'Ritmo',
  },
  'run.activities.noActivities': {
    en: 'No activities yet. Get out there and start running!',
    es: 'No hay actividades todavía. ¡Sal y empieza a correr!',
  },
  'run.calendar.title': {
    en: 'Activity Calendar',
    es: 'Calendario de Actividades',
  },
  'run.calendar.sun': {
    en: 'Sun',
    es: 'Dom',
  },
  'run.calendar.mon': {
    en: 'Mon',
    es: 'Lun',
  },
  'run.calendar.tue': {
    en: 'Tue',
    es: 'Mar',
  },
  'run.calendar.wed': {
    en: 'Wed',
    es: 'Mié',
  },
  'run.calendar.thu': {
    en: 'Thu',
    es: 'Jue',
  },
  'run.calendar.fri': {
    en: 'Fri',
    es: 'Vie',
  },
  'run.calendar.sat': {
    en: 'Sat',
    es: 'Sáb',
  },
  'run.footer.lastUpdated': {
    en: 'Last updated',
    es: 'Última actualización',
  },
  'run.footer.cached': {
    en: 'Cached',
    es: 'En caché',
  },
  'run.footer.poweredBy': {
    en: 'Powered by',
    es: 'Impulsado por',
  },
  // About page
  'about.title': {
    en: 'About Me',
    es: 'Sobre Mí',
  },
  'about.meta.description': {
    en: 'Learn about Angel Baez - Agentic Developer and entrepreneur based in Cancun, Mexico. Building AI agents, autonomous systems, and intelligent web applications.',
    es: 'Conoce a Angel Baez - Desarrollador Agéntico y emprendedor en Cancún, México. Creando agentes de IA, sistemas autónomos y aplicaciones web inteligentes.',
  },
  'about.intro': {
    en: 'Hi! I\'m Angel Baez, an Agentic Developer and entrepreneur based in Cancun, Mexico.',
    es: '¡Hola! Soy Angel Baez, un Desarrollador Agéntico y emprendedor en Cancún, México.',
  },
  'about.section.background': {
    en: 'Background',
    es: 'Trayectoria',
  },
  'about.background.p1': {
    en: 'I\'ve been building software for over a decade, working with startups and established companies to create web applications, APIs, and digital products. My focus is on building reliable, scalable solutions that solve real problems.',
    es: 'He estado desarrollando software por más de una década, trabajando con startups y empresas establecidas para crear aplicaciones web, APIs y productos digitales. Mi enfoque está en construir soluciones confiables y escalables que resuelvan problemas reales.',
  },
  'about.background.p2': {
    en: 'Currently, I\'m focused on AI agents, agentic workflows, and intelligent automation using TypeScript, Python, and Node.js. I\'m passionate about building systems that think, decide, and act autonomously.',
    es: 'Actualmente, me enfoco en agentes de IA, flujos de trabajo agénticos y automatización inteligente usando TypeScript, Python y Node.js. Me apasiona construir sistemas que piensan, deciden y actúan de forma autónoma.',
  },
  'about.section.expertise': {
    en: 'Areas of Expertise',
    es: 'Áreas de Experiencia',
  },
  'about.expertise.frontend': {
    en: 'Frontend Development',
    es: 'Desarrollo Frontend',
  },
  'about.expertise.frontend.desc': {
    en: 'React, TypeScript, Astro, Next.js, CSS/Tailwind',
    es: 'React, TypeScript, Astro, Next.js, CSS/Tailwind',
  },
  'about.expertise.backend': {
    en: 'Backend Development',
    es: 'Desarrollo Backend',
  },
  'about.expertise.backend.desc': {
    en: 'Node.js, Python, REST APIs, GraphQL, Databases',
    es: 'Node.js, Python, REST APIs, GraphQL, Bases de datos',
  },
  'about.expertise.devops': {
    en: 'DevOps & Cloud',
    es: 'DevOps & Cloud',
  },
  'about.expertise.devops.desc': {
    en: 'AWS, Cloudflare, Docker, CI/CD, Infrastructure',
    es: 'AWS, Cloudflare, Docker, CI/CD, Infraestructura',
  },
  'about.section.connect': {
    en: 'Let\'s Connect',
    es: 'Conectemos',
  },
  'about.connect.text': {
    en: 'I\'m always open to discussing new projects, opportunities, or just having a conversation about technology. Feel free to reach out!',
    es: 'Siempre estoy abierto a discutir nuevos proyectos, oportunidades, o simplemente tener una conversación sobre tecnología. ¡No dudes en contactarme!',
  },
  'about.connect.cta': {
    en: 'Get in Touch',
    es: 'Contáctame',
  },
  'nav.about': {
    en: 'About',
    es: 'Sobre Mí',
  },
} as const;

export type UiKey = keyof typeof ui;
