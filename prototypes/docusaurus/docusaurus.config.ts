import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {GlobExcludeDefault} from '@docusaurus/utils';
import {accessibleGithubLight, accessibleVsDark} from './src/prismThemes';
import {resolveDocsEditUrl} from '../../scripts/docs-edit-url.mjs';

const siteUrl = 'https://shakapacker.com';
const siteDescription =
  'Modern JavaScript and CSS bundling for Rails applications, powered by webpack or Rspack.';

// Prefer hosted DocSearch when CI provides the complete public search
// configuration. Local builds and fork previews keep the bundled local index.
const algoliaConfig = {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
  indexName: process.env.ALGOLIA_INDEX_NAME,
};
const algoliaConfigValues = Object.values(algoliaConfig);
const useAlgolia = algoliaConfigValues.every(Boolean);

if (algoliaConfigValues.some(Boolean) && !useAlgolia) {
  throw new Error(
    'Algolia search configuration is incomplete. Set ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, and ALGOLIA_INDEX_NAME together.'
  );
}

const localSearchTheme: NonNullable<Config['themes']>[number] = [
  '@easyops-cn/docusaurus-search-local',
  {
    hashed: true,
    indexBlog: false,
    docsRouteBasePath: '/docs',
    highlightSearchTermsOnTargetPage: true,
    searchResultLimits: 8,
    searchBarShortcutHint: true,
  },
];

// Schema.org structured data so search engines understand the project, its
// publisher, and the site. Emitted once into <head> via headTags below.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.shakacode.com/#organization',
      name: 'ShakaCode',
      url: 'https://www.shakacode.com',
      logo: `${siteUrl}/img/brand/icon-512.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Shakapacker',
      description: siteDescription,
      publisher: {'@id': 'https://www.shakacode.com/#organization'},
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Shakapacker',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      description: siteDescription,
      url: siteUrl,
      softwareHelp: `${siteUrl}/docs`,
      codeRepository: 'https://github.com/shakacode/shakapacker',
      license: 'https://github.com/shakacode/shakapacker/blob/main/LICENSE.md',
      author: {'@id': 'https://www.shakacode.com/#organization'},
      offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
    },
  ],
};

const config: Config = {
  title: 'Shakapacker',
  tagline: 'Modern JavaScript and CSS bundling for Rails applications.',
  favicon: 'img/brand/mark-transparent.svg',

  future: {
    v4: true,
  },

  url: siteUrl,
  baseUrl: '/',

  organizationName: 'shakacode',
  projectName: 'shakapacker.com',

  onBrokenLinks: 'warn',
  clientModules: ['./src/client/packageVersions.ts'],
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/img/brand/mark-transparent.svg',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/brand/icon-32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/img/brand/icon-16.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '256x256',
        href: '/img/brand/icon-256.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'mask-icon',
        href: '/img/brand/mark-transparent.svg',
        color: '#E43D39',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify(structuredData),
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: useAlgolia ? [] : [localSearchTheme],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          exclude: [...GlobExcludeDefault, '**/planning/**'],
          editUrl: ({docPath}) => resolveDocsEditUrl(docPath),
        },
        blog: false,
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Purpose-built 1200x630 Open Graph / Twitter card (see img/brand/og-card.svg).
    image: 'img/brand/og-card.png',
    metadata: [
      {name: 'description', content: siteDescription},
      {
        name: 'algolia-site-verification',
        content: 'BEAF397BBAC53B25',
      },
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'Shakapacker'},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {
        property: 'og:image:alt',
        content:
          'Shakapacker — modern JavaScript and CSS bundling for Rails, powered by webpack or Rspack',
      },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'consultation_cta',
      content:
        'Want expert advice on your Shakapacker setup? <a href="https://meetings.hubspot.com/justingordon/30-minute-consultation">Book a complimentary 30-minute assessment</a> with the ShakaCode team.',
      isCloseable: true,
    },
    navbar: {
      title: 'Shakapacker',
      logo: {
        alt: 'Shakapacker Logo',
        src: 'img/brand/mark-transparent.svg',
        width: 40,
        height: 40,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/docs/changelog', label: 'Changelog', position: 'left'},
        {to: '/examples', label: 'Resources', position: 'left'},
        {to: '/pro', label: 'Support', position: 'left'},
        {
          href: 'https://www.shakacode.com/contact/',
          label: 'Get Expert Help',
          position: 'right',
          className: 'navbar-cta',
        },
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
            {label: 'Documentation Guide', to: '/docs'},
            {label: 'Configuration', to: '/docs/configuration'},
            {label: 'Deployment', to: '/docs/deployment'},
            {label: 'Rspack Migration', to: '/docs/rspack_migration_guide'},
            {label: 'Troubleshooting', to: '/docs/troubleshooting'},
            {label: 'Changelog', to: '/docs/changelog'},
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
            {
              label: 'Book a Complimentary Assessment',
              href: 'https://meetings.hubspot.com/justingordon/30-minute-consultation',
            },
          ],
        },
        {
          title: 'Packages',
          items: [
            {
              label: 'shakapacker',
              href: 'https://www.npmjs.com/package/shakapacker',
              className: 'package-version-link',
              'data-package-version-registry': 'npm',
              'data-package-version-name': 'shakapacker',
            },
            {
              label: 'shakapacker-rspack',
              href: 'https://www.npmjs.com/package/shakapacker-rspack',
              className: 'package-version-link',
              'data-package-version-registry': 'npm',
              'data-package-version-name': 'shakapacker-rspack',
            },
            {
              label: 'shakapacker-webpack',
              href: 'https://www.npmjs.com/package/shakapacker-webpack',
              className: 'package-version-link',
              'data-package-version-registry': 'npm',
              'data-package-version-name': 'shakapacker-webpack',
            },
            {
              label: 'RubyGems shakapacker',
              href: 'https://rubygems.org/gems/shakapacker',
              className: 'package-version-link',
              'data-package-version-registry': 'rubygems',
              'data-package-version-name': 'shakapacker',
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
      theme: accessibleGithubLight,
      darkTheme: accessibleVsDark,
      additionalLanguages: ['ruby', 'markup-templating', 'erb', 'diff', 'haml', 'bash', 'regex', 'ignore'],
    },
    ...(useAlgolia && {
      algolia: {
        appId: algoliaConfig.appId!,
        apiKey: algoliaConfig.apiKey!,
        indexName: algoliaConfig.indexName!,
        contextualSearch: true,
      },
    }),
  } satisfies Preset.ThemeConfig,
};

export default config;
