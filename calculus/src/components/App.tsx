import { StrictMode } from 'react';
// import "@mantine/core/styles.css";
// import { theme } from './theme';

import { ConvexityForm } from './ConvexityForm/ConvexityForm';
import { HeroUIProvider } from '@heroui/react';

export default function App() {
  return (
    <StrictMode>
      <HeroUIProvider disableRipple>
        <ConvexityForm calculus={true} />
      </HeroUIProvider>
    </StrictMode>
  );
}
