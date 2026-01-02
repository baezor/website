export const languages = {
  en: 'English',
  es: 'Español',
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = 'en';

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
} as const;

export type UiKey = keyof typeof ui;
