import { StrictMode, useCallback, useState } from 'react';

import {
  addToast,
  Button,
  ButtonGroup,
  Card,
  Form,
  HeroUIProvider,
  input,
  Textarea,
  ToastProvider,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { Example } from './ConvexityForm/Example';
import { examples } from './ConvexityForm/examples';
import { HighlightedCode } from './ConvexityForm/HighlightedCode';
import { set } from 'astro:schema';

export default function App() {
  const [problem, setProblem] = useState('Sample problem');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'optimizer.py';
    link.click();
  }, [code]);

  const getGeneratedCode = useCallback(async (problem: string) => {
    setLoading(true);
    setError(null);
    setCode('');
    fetch('/api/', {
      method: 'POST',
      body: JSON.stringify({ input: problem }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(result => {
        if (result.success && result.code) {
          setCode(result.code);
        } else if (result.message) {
          setCode('');
          setError(result.message);
        } else {
          setCode('');
        }
      })
      .catch(err => {
        setError('An error occurred while generating the code.');
        setCode('');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateExample = useCallback(
    (exampleCode: string) => {
      setProblem(exampleCode);
      getGeneratedCode(exampleCode);
    },
    [getGeneratedCode, setProblem],
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      addToast({ description: 'Code copied to clipboard', color: 'success' });
    });
  }, [code]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    getGeneratedCode(problem);
  };
  return (
    <StrictMode>
      <HeroUIProvider disableRipple>
        <ToastProvider />
        <div className="max-w-4xl mx-auto p-4 mt-8 space-y-8 text-center">
          <h2 id="problem-heading" className="text-3xl font-bold mb-4 ">
            Generate optimization code
          </h2>
          <span>
            Check out our{' '}
            <Button as="a" href="/language">
              Input Language
            </Button>{' '}
          </span>
        </div>
        <Form onSubmit={onSubmit} className="items-center">
          <Textarea
            label="Problem description"
            className="max-w-4xl mx-auto p-4 space-y-4"
            variant="bordered"
            value={problem}
            onChange={e => setProblem(e.target.value)}
          />
          <div className="flex justify-center">
            <Button className="mb-8" type="submit" color="primary">
              Generate Code
            </Button>
          </div>
        </Form>
        {loading && (
          <div className="max-w-4xl mx-auto p-4 mb-8 text-center font-semibold">Generating...</div>
        )}
        {error && (
          <div className="max-w-4xl mx-auto p-4 mb-8 text-red-600 font-semibold">{error}</div>
        )}
        {code !== '' && (
          <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* <h2 className="text-2xl font-bold text-center mb-4">Generated Code</h2> */}

            <Card shadow="sm" radius="sm" className="p-4">
              <div className="absolute top-4 right-10">
                <Button
                  onPress={handleDownload}
                  className="z-100 rounded-r-none"
                  startContent={<Icon icon="lucide:download" />}
                  isIconOnly
                  size="sm"
                  color="default"
                ></Button>
                <Button
                  onPress={handleCopy}
                  className="z-100 rounded-l-none"
                  startContent={<Icon icon="lucide:copy" />}
                  isIconOnly
                  size="sm"
                  color="default"
                ></Button>
              </div>
              <HighlightedCode expression={code} />
            </Card>
          </div>
        )}
        <div className="place-content-center text-center">
          <h2 className="mt-2 mb-3 text-lg">Examples</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3 p-4 text-left">
          {examples.map(example => (
            <Example
              setProblem={updateExample}
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
