/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/html-vite",
  // Картинки для историй (аватар, обложки карточек)
  "staticDirs": ["../public"],
  "core": { "disableTelemetry": true }
};
export default config;
