import { StrictMode, useState } from 'react';
// import "@mantine/core/styles.css";
// import { theme } from './theme';

import { ConvexityForm } from './ConvexityForm/ConvexityForm';
import { Button, Card, HeroUIProvider, Textarea, ToastProvider } from '@heroui/react';
import { HighlightedCode } from './ConvexityForm/HighlightedCode';
import { Example } from './ConvexityForm/Example';
import { examples } from './ConvexityForm/examples';

export default function App() {
  const [problem, setProblem] = useState('Sample problem');
  const error = null;
  return (
    <StrictMode>
      <HeroUIProvider disableRipple>
        <ToastProvider />
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          <h2 className="text-3xl font-bold text-center">Generate optimization code</h2>
        </div>
        <Textarea
          label="Problem description"
          className="max-w-4xl mx-auto p-4 space-y-8"
          variant="bordered"
          value={problem}
          onChange={e => setProblem(e.target.value)}
        />
        <div className="flex justify-center">
          <Button className="mb-8" onPress={() => alert('Generate code')} color="primary">
            Generate Code
          </Button>
        </div>
        {error && (
          <div className="max-w-4xl mx-auto p-4 mb-8 text-red-600 font-semibold">{error}</div>
        )}
        <div className="max-w-4xl mx-auto  space-y-8">
          <h2 className="text-2xl font-bold text-center mb-4">Generated Code</h2>

          <Card shadow="sm" radius="sm" className="p-4">
            <HighlightedCode expression={`# Generated code for problem:\n${problem}`} buttons />
          </Card>
        </div>
        <div className="place-content-center text-center">
          <h2 className="mt-2 mb-3">Examples</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {examples.map(example => (
            <Example
              setProblem={setProblem}
              title={example.title}
              value={example.value}
              key={example.title}
            />
          ))}
        </div>
      </HeroUIProvider>
    </StrictMode>
  );
}
