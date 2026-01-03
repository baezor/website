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
    en: 'Home',
    es: 'Inicio',
  },
  'nav.aria.toggle': {
    en: 'Toggle menu',
    es: 'Alternar menú',
  },
  'home.bio': {
    en: 'Hi human (or AI bot). I\'m an Angel, a web developer and entrepreneur. Welcome to my website!',
    es: '¡Hola humano (o bot de IA)! Soy Angel, un desarrollador web y emprendedor. ¡Bienvenido a mi sitio web!',
  },
  'home.aria.about': {
    en: 'About {name}',
    es: 'Acerca de {name}',
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
  'blog.backToAll': {
    en: '← Back to all posts',
    es: '← Volver a todos los artículos',
  },
  'blog.updated': {
    en: 'Updated:',
    es: 'Actualizado:',
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
  'contact.email': {
    en: 'Email',
    es: 'Correo',
  },
  'contact.emailDesc': {
    en: 'For direct inquiries:',
    es: 'Para consultas directas:',
  },
  'contact.linkedin': {
    en: 'LinkedIn',
    es: 'LinkedIn',
  },
  'contact.linkedinDesc': {
    en: 'Connect professionally:',
    es: 'Conecta profesionalmente:',
  },
  'contact.x': {
    en: 'X',
    es: 'X',
  },
  'contact.xDesc': {
    en: 'Follow for updates:',
    es: 'Sígueme para actualizaciones:',
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
    en: 'Switch to Spanish',
    es: 'Cambiar a español',
  },
  'lang.switch.toEnglish': {
    en: 'Switch to English',
    es: 'Cambiar a inglés',
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
} as const;

export type UiKey = keyof typeof ui;
