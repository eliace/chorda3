// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// @type {import('@docusaurus/types').Config}
const config = {
  title: 'Chorda',
  tagline: 'Dinosaurs are cool',
  url: 'https://chorda-docs.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'eliace', // Usually your GitHub org/user name.
  projectName: 'chorda', // Usually your repo name.
  i18n: {
    defaultLocale: 'Ru',
    locales: ['Ru', 'En'],
  },
  
//  themes: ['@docusaurus/theme-live-codeblock'],

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
//          editUrl: 'https://github.com/facebook/docusaurus/edit/main/website/',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Chorda',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'get-started',
            position: 'right',
            label: 'Docs',
          },
          {
            to: 'blog', 
            label: 'Blog', 
            position: 'right'
          },
          {
            label: 'Demo',
            position: 'right',
            items: [{
              href: 'https://chorda-demo.netlify.app/#/elements/box',
              label: 'Examples', 
            }, {
              href: 'https://chorda-todomvc.netlify.app',
              label: 'TodoMVC', 
            }]
          },
          {
            href: 'https://github.com/eliace/chorda3',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right'
          },
          {
            type: 'docsVersionDropdown',
            position: 'right'
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Chorda. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        disableSwitch: true
      }
    }),
};

module.exports = config;
