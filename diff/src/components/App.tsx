import { StrictMode, useCallback, useState } from 'react';

import {
  addToast,
  Button,
  ButtonGroup,
  Card,
  Form,
  HeroUIProvider,
  input,
  Select,
  SelectItem,
  Textarea,
  ToastProvider,
} from '@heroui/react';

import { Icon } from '@iconify/react';
import { Example } from './Example';
import { examples } from './examples';
import { CodeEditor } from './CodeEditor';
import { set } from 'astro:schema';

export default function App() {
  const [problem, setProblem] = useState(examples[0].value);
  const [error, setError] = useState<string | null>(null);
  const [derivative, setDerivative] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [wrtOptions, setWrtOptions] = useState<string[]>(['_auto']);
  const [wrt, setWrt] = useState<string>('_auto');

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'diff.py';
    link.click();
  }, [code]);

  const getGeneratedCode = useCallback(async (problem: string, wrt: string) => {
    setLoading(true);
    setError(null);
    setCode('');
    fetch('/api/derivative', {
      method: 'POST',
      body: JSON.stringify({ input: problem, wrt }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(result => {
        if (result.success && result.code) {
          setCode(result.code);
          setDerivative(result.derivative);
          setWrtOptions(['_auto', ...result.wrt_options]);
          if (result.wrt && result.wrt_options.includes(result.wrt) && result.wrt !== '_auto') {
            setWrt(result.wrt);
          } else {
            setWrt('_auto');
          }
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
    (exampleCode: string, wrt: string) => {
      setProblem(exampleCode);
      getGeneratedCode(exampleCode, wrt);
    },
    [getGeneratedCode, setProblem],
  );

  // Create useCallback
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      addToast({ description: 'Code copied to clipboard', color: 'success' });
    });
  }, [code]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    getGeneratedCode(problem, wrt);
  };

  return (
    <StrictMode>
      <HeroUIProvider disableRipple>
        <ToastProvider />
        {/* <div className="max-w-4xl mx-auto mt-2 text-center">
          <h2 id="problem-heading" className="text-xl font-bold  ">
            Generate optimization code
          </h2>
        </div> */}
        <div className="max-w-4xl mt-4 mx-auto p-4 space-y-4 flex-wrap">
          <label id="problem-heading" className="block text-sm font-medium mb-2">
            Problem description
          </label>
          <CodeEditor value={problem} onChange={setProblem} maxHeight="300px" />
        </div>
        <Form onSubmit={onSubmit} className="items-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 max-w-4xl mx-auto gap-4 items-center">
            <div>with regard to </div>
            <Select
              aria-label="with regard to"
              className="max-w-48"
              selectedKeys={[wrt]}
              onChange={e => {
                console.log(e);
                setWrt(e.target.value);
              }}
            >
              {wrtOptions.map(option => (
                <SelectItem key={option}>{option === '_auto' ? 'Automatic' : option}</SelectItem>
              ))}
            </Select>
            <Button className="col-span-2 sm:col-span-1" type="submit" color="primary">
              Differentiate
            </Button>
          </div>
        </Form>
        {loading && (
          <div className="max-w-4xl mx-auto p-4 mb-8 text-center font-semibold">Diff...</div>
        )}
        {error && (
          <div className="max-w-4xl mx-auto p-4 mb-8 text-red-600 font-semibold">{error}</div>
        )}
        {derivative !== '' && (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-2">Derivative</h2>
            <CodeEditor value={derivative} lineNumbers={false} readOnly={true} maxHeight="100px" />
          </div>
        )}
        {code !== '' && (
          <div className="max-w-4xl mx-auto space-y-4 relative p-4">
            {/* <h2 className="text-2xl font-bold text-center mb-4">Generated Code</h2> */}

            {/* <Card shadow="none" radius="sm" className="p-4"> */}

            <div className="absolute top-13 right-6">
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
            <label className="block text-sm font-medium mb-2">Generated Code</label>
            <CodeEditor value={code} readOnly={true} language="python" maxHeight="300px" />
            {/* </Card> */}
          </div>
        )}
        <div className="place-content-center text-center">
          <h2 className="mt-6 mb-1 text-2xl">Examples</h2>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 p-4 text-left">
          {examples.map(example => (
            <Example
              setProblem={updateExample}
              title={example.title}
              value={example.value}
              wrt={example.wrt}
              key={example.title}
            />
          ))}
        </div>
      </HeroUIProvider>
    </StrictMode>
  );
}
