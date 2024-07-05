import { StrictMode } from 'react';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
// import { theme } from './theme';

import { Hero } from './Hero/Hero';
import { ConvexityForm } from './ConvexityForm/ConvexityForm';

export default function App() {
  return (
    <StrictMode>
      <MantineProvider
        // theme={theme}
        cssVariablesResolver={theme => ({
          variables: {},
          light: {
            '--page-background': theme.colors.gray[1],
          },
          dark: {
            '--page-background': theme.black,
          },
        })}
      >
        <Hero />
        <ConvexityForm />
      </MantineProvider>
    </StrictMode>
  );
}
