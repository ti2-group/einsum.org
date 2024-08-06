import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span>Tenvexity</span>,
  project: {
    link: null,
  },
  footer: {
    content: 'Theoretical Computer Science II at the University of Jena',
  },
  themeSwitch: {
    component: null,
  },
  darkMode: false,
  nextThemes: {
    forcedTheme: 'light',
  },
  // ... other theme options
};
export default config;
