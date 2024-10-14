import { useForm } from '@mantine/form';
import { Fragment, useState } from 'react';
import { z } from 'zod';

import isDeepEqual from 'fast-deep-equal/react';
import { Example } from './Example';
import { examples } from './examples';
import { HighlightedCode } from './HighlightedCode';
import {
  Chip,
  CircularProgress,
  Skeleton,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Input,
  Card,
} from '@nextui-org/react';
import VarConfTags from './VarConfTags';

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

const resultToColorMap: { [key in Solution['result']]: Colors } = {
  AFFINE: 'primary',
  UKNOWN: 'default',
  CONVEX: 'success',
  CONCAVE: 'warning',
};

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

export function ConvexityForm() {
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
        fetch('/api/', {
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
              form.setFieldError('expression', <FormError message={result.errorMessage} />);
            }
            setLoadingState(null);
          })
          .catch(err => {
            if (!(err instanceof DOMException) && err.message !== undefined) {
              form.setFieldError('expression', <FormError message="Server Error" />);
              setLoadingState(null);
            }
          });
      } else {
        const errors: Record<string, string> = {};
        parsingResult.error.errors.forEach(error => {
          errors[error.path.join('.')] = error.message;
        });

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

  console.log(loadingState);

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
          onSelect={event => {
            console.log(event.currentTarget.selectionStart);
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
          {errorComponent || (
            <>
              <div className="flex place-content-center my-3 gap-2">
                <div className="text-xl font-semibold h-10 place-content-center">Is </div>
                <Chip
                  className="h-10 place-content-center mx-2 text-xl uppercase"
                  color={
                    form.values.result in resultToColorMap && !form.values.weak
                      ? resultToColorMap[form.values.result]
                      : 'default'
                  }
                >
                  {form.values.strict ? 'strictly ' : ''}
                  {form.values.weak ? 'UNKNOWN' : form.values.result.toLowerCase()}
                </Chip>
                <Select
                  label="with regard to"
                  labelPlacement="outside-left"
                  aria-label="with regard to"
                  variant="bordered"
                  selectedKeys={form.values.wrt}
                  className="max-w-xs text-nowrap "
                  classNames={{
                    label: 'text-xl w-55 h-10 place-content-center pr-4',
                    popoverContent: 'light:bg-white',
                    trigger: 'variable-select-trigger',
                  }}
                  disabledKeys={[form.values.wrt]}
                  onChange={e => {
                    const val = e.target.value;
                    if (loadingState === null && val !== null) {
                      // setLoadingState('solution');
                      // form.setFieldValue('wrt', val);
                      console.log(val.toString, val);
                      updateForm({ ...form.values, wrt: val });
                    }
                  }}
                  // allowDeselect={false}
                  //   disabled={loadingState !== null}
                >
                  {variables.map(variable => (
                    <SelectItem key={variable}>{variable}</SelectItem>
                  ))}
                </Select>
              </div>
              {form.values.weak && (
                <div className="flex place-content-center gap-1 my-3">
                  <span>It would be &nbsp;</span>
                  <Chip
                    color={
                      form.values.result in resultToColorMap
                        ? resultToColorMap[form.values.result]
                        : 'default'
                    }
                    className="uppercase"
                    size="md"
                  >
                    {form.values.result}
                  </Chip>
                  <span>
                    &nbsp;if <strong>{form.values.wrt}</strong> were&nbsp;
                  </span>
                  <div className="flex">
                    {form.values?.weakConditions?.slice(0, -1).map((condition, index) => (
                      <Fragment key={condition}>
                        <Chip size="md" color="primary" className="uppercase">
                          {condition}
                        </Chip>
                        {index < form.values.weakConditions.length - 2 && <span>,&nbsp;</span>}
                      </Fragment>
                    ))}
                    {form.values.weakConditions?.length > 1 && <span>&nbsp;and&nbsp;</span>}
                    {form.values?.weakConditions?.slice(-1).map(condition => (
                      <>
                        <Chip key={condition} size="md" color="primary" className="uppercase">
                          {condition}
                        </Chip>
                      </>
                    ))}
                  </div>
                  .
                </div>
              )}
            </>
          )}
        </div>

        <Card shadow="sm" className="mt-8" radius="sm">
          {/* <Table.ScrollContainer minWidth={850}> */}
          <Table disabledKeys={Array.isArray(loadingState) ? loadingState : []} radius="sm">
            <TableHeader style={{ textAlign: 'center' }}>
              <TableColumn className="w-1">Variable</TableColumn>
              <TableColumn style={{ width: '90px' }}>Order</TableColumn>
              <TableColumn style={{ minWidth: '250px' }} className="w-80">
                Interval
              </TableColumn>
              <TableColumn style={{ minWidth: '220px' }}>Properties</TableColumn>
            </TableHeader>
            <TableBody style={{ textAlign: 'center' }}>
              {form.values.variables.map((varConf, variable) => (
                <TableRow key={varConf.name}>
                  <TableCell className="text-center">
                    <h4>{varConf.name}</h4>
                  </TableCell>
                  <TableCell>
                    <Input
                      aria-label="Order"
                      type="number"
                      size="sm"
                      value={varConf.order.toString()}
                      required={true}
                      isDisabled={loadingState?.includes(varConf.name)}
                      onChange={event => {
                        let intValue = parseInt(event.target.value);
                        if (intValue < 0) {
                          intValue = 0;
                        }
                        form.setFieldValue(`variables.${variable}.order`, intValue);
                        updateVariable(variable, {
                          ...varConf,
                          order: intValue,
                        });
                      }}
                      errorMessage={!!form.errors[`variables.${variable}.interval.upper`]}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="faded"
                        size="sm"
                        color="default"
                        isDisabled={loadingState?.includes(varConf.name)}
                        className="pl-0 pr-0 min-w-8 rounded-md rounded-r-none"
                        onClick={() => {
                          updateVariable(variable, {
                            ...varConf,
                            interval: {
                              ...varConf.interval,
                              lowerIncluded: !varConf.interval.lowerIncluded,
                            },
                          });
                        }}
                        disabled={loadingState === 'all'}
                      >
                        {varConf.interval.lowerIncluded ? '[' : '('}
                      </Button>
                      <Input
                        aria-label="Lower bound"
                        value={varConf.interval.lower}
                        size="sm"
                        isDisabled={loadingState?.includes(varConf.name)}
                        placeholder="-Inf"
                        classNames={{
                          inputWrapper: 'rounded-none',
                        }}
                        onChange={event => {
                          updateVariable(variable, {
                            ...varConf,
                            interval: {
                              ...varConf.interval,
                              lower: event.target.value,
                            },
                          });
                        }}
                        errorMessage={!!form.errors[`variables.${variable}.interval.lower`]}
                        disabled={loadingState === 'all'}
                      />
                      <Input
                        aria-label="Upper bound"
                        size="sm"
                        placeholder="Inf"
                        value={varConf.interval.upper}
                        isDisabled={loadingState?.includes(varConf.name)}
                        classNames={{
                          inputWrapper: 'rounded-none',
                        }}
                        onChange={event => {
                          form.setFieldValue(
                            `variables.${variable}.interval.upper`,
                            event.target.value,
                          );
                          updateVariable(variable, {
                            ...varConf,
                            interval: {
                              ...varConf.interval,
                              upper: event.target.value,
                            },
                          });
                        }}
                        errorMessage={!!form.errors[`variables.${variable}.interval.upper`]}
                        disabled={loadingState === 'all'}
                      />

                      <Button
                        variant="faded"
                        color="default"
                        size="sm"
                        isDisabled={loadingState?.includes(varConf.name)}
                        className="pl-0 pr-0 min-w-8 rounded-md rounded-l-none "
                        onClick={() => {
                          updateVariable(variable, {
                            ...varConf,
                            interval: {
                              ...varConf.interval,
                              upperIncluded: !varConf.interval.upperIncluded,
                            },
                          });
                        }}
                        disabled={loadingState === 'all'}
                      >
                        {varConf.interval.upperIncluded ? ']' : ')'}
                      </Button>
                    </div>
                    {!!form.errors[`variables.${variable}.interval.lower`] && (
                      <span className="text-red-600">
                        {form.errors[`variables.${variable}.interval.lower`]}
                      </span>
                    )}
                    {!!form.errors[`variables.${variable}.interval.upper`] && (
                      <span className="text-red-600">
                        {form.errors[`variables.${variable}.interval.upper`]}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {varConf.order % 2 === 0 && (
                      <VarConfTags
                        isDisabled={loadingState?.includes(varConf.name) || false}
                        updateVariable={updateVariable}
                        variableKey={variable}
                        varConf={varConf}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* </Table.ScrollContainer> */}
        </Card>
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
