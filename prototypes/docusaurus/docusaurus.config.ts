import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {GlobExcludeDefault} from '@docusaurus/utils';

const config: Config = {
  title: 'Shakapacker',
  tagline: 'Modern JavaScript and CSS bundling for Rails applications.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://shakapacker.com',
  baseUrl: '/',

  organizationName: 'shakacode',
  projectName: 'shakapacker.com',

  onBrokenLinks: 'warn',
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          exclude: [...GlobExcludeDefault, '**/planning/**'],
          editUrl: ({docPath}) => {
            const root = 'https://github.com/shakacode/shakapacker/tree/main/docs/';
            return `${root}${docPath}`;
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Shakapacker',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/examples', label: 'Resources', position: 'left'},
        {to: '/pro', label: 'Support', position: 'left'},
        {
          href: 'https://github.com/shakacode/shakapacker',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://github.com/sponsors/shakacode',
          label: 'Sponsor',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Overview', to: '/docs'},
            {label: 'Configuration', to: '/docs/configuration'},
            {label: 'Deployment', to: '/docs/deployment'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Repository',
              href: 'https://github.com/shakacode/shakapacker',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/shakacode/shakapacker/discussions',
            },
            {
              label: 'ShakaCode',
              href: 'https://www.shakacode.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Support',
              to: '/pro',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/shakacode/shakapacker',
            },
            {
              label: 'Sponsor',
              href: 'https://github.com/sponsors/shakacode',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ShakaCode. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
