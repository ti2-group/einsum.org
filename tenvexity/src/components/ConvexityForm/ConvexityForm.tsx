import { useForm } from '@mantine/form';
import { Fragment, useState } from 'react';
import { z } from 'zod';

import { Chip, CircularProgress, Select, SelectItem, Skeleton } from '@heroui/react';
import isDeepEqual from 'fast-deep-equal/react';
import { Example } from './Example';
import { examples } from './examples';
import { HighlightedCode } from './HighlightedCode';
import TransposedVariableTable from './TransposedVariableTable';
import VariableTable from './VariableTable';
import { WithRegardTo } from './WithRegardTo';
import TenvexityResultDisplay from './TenvexityResultDisplay';
import CalculusResultsDisplay from './CalculusResultDisplay';

let controller: AbortController;
let signal: AbortSignal;

export type VarConf = {
  name: string;
  order: number;
  orderInferred: boolean;
  interval: {
    lowerIncluded: boolean;
    lower: string;
    upper: string;
    upperIncluded: boolean;
  };
  tags: string[];
  inferredTags: string[];
};

type Solution = {
  result: 'AFFINE' | 'CONVEX' | 'CONCAVE' | 'UKNOWN';
  weak: boolean;
  strict: boolean;
  weakConditions: string[];
};

type Colors = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export type FormState = {
  expression: string;
  wrt: string;
  variables: VarConf[];
} & Solution;

/*  TODO:
- Weak goes into its own line
- Add result display
- Show strict or not
*/

export type LoadingState = null | 'all' | 'solution' | 'error' | string[];

function FormError({ message }: { message: string }) {
  return (
    <div className="place-content-center flex my-6">
      <span className="text-2xl text-red-500 font-bold">{message}</span>
    </div>
  );
}

const formValuesSchema = z.object({
  expression: z.string(),
  wrt: z.string(),
  variables: z.array(
    z.object({
      interval: z.object({
        lower: z
          .union([z.coerce.number(), z.literal('inf'), z.literal('-inf')], {
            errorMap: () => ({
              message: 'The lower bound must be a number or empty (-Inf)',
            }),
          })
          .optional(),
        upper: z
          .union([z.coerce.number(), z.literal('inf'), z.literal('-inf'), z.literal('Inf')], {
            errorMap: () => ({
              message: 'The upper bound must be a number or empty (Inf)',
            }),
          })
          .optional(),
      }),
    }),
  ),
});

export function ConvexityForm({ calculus }: { calculus: boolean }) {
  const [loadingState, setLoadingState] = useState<LoadingState>(null);
  const form = useForm<FormState>({
    initialValues: examples[0].values,
  });

  const updateForm = (newValue: FormState) => {
    const currentValue = form.values;
    if (!isDeepEqual(currentValue, newValue)) {
      if (controller) {
        controller.abort('');
      }
      const parsingResult = formValuesSchema.safeParse(newValue);
      form.setValues(newValue);
      if (parsingResult.success) {
        if (currentValue.expression !== newValue.expression) {
          setLoadingState('all');
        } else {
          const changedVars: string[] = [];
          currentValue.variables.forEach(variable => {
            const newVarConf = newValue.variables.find(newVar => newVar.name === variable.name);
            if (!isDeepEqual(variable, newVarConf)) {
              changedVars.push(variable.name);
            }
          });
          if (changedVars.length > 0) {
            if (Array.isArray(loadingState)) {
              changedVars.concat(loadingState);
            }
            setLoadingState(currentLoadingState => {
              if (Array.isArray(currentLoadingState)) {
                return changedVars.concat(currentLoadingState);
              }
              return changedVars;
            });
          } else {
            setLoadingState('solution');
          }
        }
        controller = new AbortController();
        signal = controller.signal;
        const url = calculus ? '/api/calculus' : '/api/convexity';
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(newValue),
          signal,
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              console.log('result', result);
              form.setValues(val => {
                const newVariables = result.variables.map((variable: VarConf) => {
                  const oldVar = val?.variables?.find(ovar => ovar.name === variable.name);
                  if (oldVar) {
                    return { ...variable, interval: oldVar.interval };
                  }
                  return variable;
                });
                return { ...result, variables: newVariables };
              });
            } else {
              console.log('error', result);
              form.setFieldError('expression', <FormError message={result.errorMessage} />);
            }
            setLoadingState(null);
          })
          .catch(err => {
            if (!(err instanceof DOMException) && err.message !== undefined) {
              form.setFieldError('expression', <FormError message="Server Error" />);
            }
            setLoadingState(null);
          });
      } else {
        const errors: Record<string, string> = {};
        parsingResult.error.errors.forEach(error => {
          errors[error.path.join('.')] = error.message;
        });
        console.log('errors', errors);
        form.setErrors(errors);
        setLoadingState(null);
      }
    }
  };

  const updateVariable = (key: number, newVar: VarConf) => {
    const newValues = { ...form.values, variables: [...form.values.variables] };
    newValues.variables[key] = { ...newVar };
    updateForm(newValues);
  };

  const variables = form.values.variables.map(variable => variable.name);

  const hasError = Object.keys(form.errors).length > 0;
  let errorComponent: null | JSX.Element = null;
  if (hasError) {
    if (form.errors.expression) {
      errorComponent = form.errors.expression as JSX.Element;
    } else {
      errorComponent = <FormError message="Invalid form data see below" />;
    }
  }

  console.log('Loading state', loadingState);

  return (
    <div className="not-content">
      <div
        style={{
          position: 'relative',
          textAlign: 'left',
          boxSizing: 'border-box',
          overflow: 'hidden',
          fontSize: '18px',
          fontVariantLigatures: 'common-ligatures',
          border: `3px solid ${form.errors.expression ? 'red' : '#868e96'}`,
          borderRadius: '5px',
          fontFamily: 'Fira code,Fira Mono,Consolas,Menlo,Courier,monospace',
        }}
        className="main-input"
      >
        <textarea
          // size="lg"
          value={form.values.expression}
          onChange={event => {
            updateForm({
              ...form.values,
              expression: event.currentTarget.value,
            });
            // setLoadingState('all');
            // form.setFieldValue('expression');
          }}
          spellCheck={false}
          style={{
            margin: '0px',
            border: '0px',
            background: 'none',
            boxSizing: 'inherit',
            display: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontStyle: 'inherit',
            fontVariantLigatures: 'inherit',
            fontWeight: 'inherit',
            letterSpacing: 'inherit',
            lineHeight: 'inherit',
            tabSize: 'inherit',
            textIndent: 'inherit',
            textRendering: 'inherit',
            textTransform: 'inherit',
            whiteSpace: 'pre-wrap',
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
            position: 'absolute',
            top: '0px',
            left: '0px',
            height: '100%',
            width: '100%',
            resize: 'none',
            color: 'inherit',
            overflow: 'hidden',
            WebkitFontSmoothing: 'antialiased',
            WebkitTextFillColor: 'transparent',
            padding: '10px',
            outline: 0,
          }}
        />
        <HighlightedCode
          style={{
            margin: '0px',
            border: '0px',
            background: 'none',
            boxSizing: 'inherit',
            display: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontStyle: 'inherit',
            fontVariantLigatures: 'inherit',
            fontWeight: 'inherit',
            letterSpacing: 'inherit',
            lineHeight: 'inherit',
            tabSize: 'inherit',
            textIndent: 'inherit',
            textRendering: 'inherit',
            textTransform: 'inherit',
            whiteSpace: 'pre-wrap',
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
            position: 'relative',
            pointerEvents: 'none',
            padding: '10px',
            height: '100%',
            width: '100%',
          }}
          expression={form.values.expression}
        />
      </div>

      <Skeleton isLoaded={loadingState !== 'all'} className="my-8">
        <div className="relative">
          {loadingState !== null && loadingState !== 'error' && (
            <div
              className="absolute z-50 h-full w-full flex items-center p-8 justify-center"
              style={{ backgroundColor: 'var(--sl-color-bg)', opacity: 0.8 }}
            >
              <CircularProgress aria-label="loading" className="" size="md" />
            </div>
          )}
          {errorComponent ||
            (calculus ? (
              <CalculusResultsDisplay
                form={form}
                loadingState={loadingState}
                updateForm={updateForm}
                variables={variables}
              />
            ) : (
              <TenvexityResultDisplay
                form={form}
                loadingState={loadingState}
                updateForm={updateForm}
                variables={variables}
              />
            ))}
        </div>
        {calculus ? (
          <TransposedVariableTable
            form={form}
            loadingState={loadingState}
            updateVariable={updateVariable}
            variables={form.values.variables}
          />
        ) : (
          <VariableTable
            form={form}
            loadingState={loadingState}
            updateVariable={updateVariable}
            calculus={calculus}
            variables={form.values.variables}
          />
        )}
      </Skeleton>

      <div className="place-content-center text-center">
        <h2 className="mt-2 mb-3">Examples</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {examples.map(example => (
          <Example
            updateForm={updateForm}
            title={example.title}
            values={example.values}
            key={example.title}
          />
        ))}
      </div>
    </div>
  );
}
