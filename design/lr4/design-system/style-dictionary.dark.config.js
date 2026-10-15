// Тёмная тема: базовые токены подключаются через include (нужны для ссылок {...}),
// а в файл попадают только переопределения из tokens-dark/ (фильтр is-source).
export default {
  include: ['tokens/**/*.json'],
  source: ['tokens-dark/**/*.json'],
  hooks: {
    filters: {
      'is-source': (token) => token.isSource,
    },
  },
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tokens-dark.css',
          format: 'css/variables',
          filter: 'is-source',
          options: {
            // :root[...] сильнее :root из tokens.css, который импортирует каждый компонент
            selector: ':root[data-theme="dark"]',
            outputReferences: true,
          },
        },
      ],
    },
  },
};
