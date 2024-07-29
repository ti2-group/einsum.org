import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span>Tenvexity</span>,
  project: {
    link: 'https://github.com/ti2-group/einsum.org/tenvexity/',
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
