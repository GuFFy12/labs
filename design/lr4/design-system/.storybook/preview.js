import '../src/styles/global.css';

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;

export const globalTypes = {
    theme: {
        name: 'Theme',
        defaultValue: 'light',
        toolbar: {
            items: ['light', 'dark'],
        },
    },
};

export const decorators = [
    (story, context) => {
        document.documentElement.setAttribute(
            'data-theme',
            context.globals.theme
        );
        return story();
    },
];
