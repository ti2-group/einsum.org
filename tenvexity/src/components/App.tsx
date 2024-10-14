import { StrictMode } from "react";
// import "@mantine/core/styles.css";
// import { theme } from './theme';

import { ConvexityForm } from "./ConvexityForm/ConvexityForm";
import { NextUIProvider } from "@nextui-org/react";

export default function App() {
  return (
    <StrictMode>
      <NextUIProvider disableRipple>
        <ConvexityForm />
      </NextUIProvider>
    </StrictMode>
  );
}
