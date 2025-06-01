# My website

## Features

- Powered by [Astro](https://astro.build/)
- Responsive design
- Dark mode
- Social links
- RSS feed
- Simple blog

## Installation

1. Clone this repository. `git clone git@github.com:baezor/website.git website`.
2. Navigate to the project directory using `cd website`.
3. Install dependencies and start the server `npm i && npm run start`.

## Usage

- **Development**: Run `npm run dev` or `npm start` to start the development server.
- **Build**: Use `npm run build` to generate a production build.
- **Preview**: Run `npm run preview` to preview the production build.
- **Astro CLI**: Explore additional Astro CLI commands using `npm run astro`.

## Updating your links

Feel free to use my repository as a template for your own website. To customize the links displayed in your website, follow these steps:

1. Open the `src/data/index.ts` file in your project.
2. You'll see an array of objects with the information of the links. Add, remove, or update the links as needed.

```javascript
const links = [
  {
    label: "Add me to your network on LinkedIn",
    url: "https://www.linkedin.com/in/angelromerobaez/",
  },
  {
    label: "Check out my GitHub",
    url: "https://github.com/baezor/",
  },
];
```
