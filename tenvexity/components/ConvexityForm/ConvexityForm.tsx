import {
  Badge,
  Center,
  Container,
  Group,
  LoadingOverlay,
  MantineColor,
  Paper,
  Select,
  SimpleGrid,
  Skeleton,
  Table,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Fragment, useState } from 'react';
import { z } from 'zod';

import isDeepEqual from 'fast-deep-equal/react';
import { Example } from './Example';
import { VariableConfig } from './VariableConfig';
import { examples } from './examples';
import { HighlightedCode } from './HighlightedCode';

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

const resultToColorMap: { [key in Solution['result']]: MantineColor } = {
  AFFINE: 'blue',
  UKNOWN: 'gray',
  CONVEX: 'teal',
  CONCAVE: 'orange',
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
    <Center>
      <Title order={2} c="red">
        {message}
      </Title>
    </Center>
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
            errorMap: () => ({ message: 'The lower bound must be a number or empty (-Inf)' }),
          })
          .optional(),
        upper: z
          .union([z.coerce.number(), z.literal('inf'), z.literal('-inf'), z.literal('Inf')], {
            errorMap: () => ({ message: 'The upper bound must be a number or empty (Inf)' }),
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
            console.log('err', err);
            if (!(err instanceof DOMException)) {
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

  return (
    <Container size="80rem" pb="xl">
      <div
        style={{
          position: 'relative',
          textAlign: 'left',
          boxSizing: 'border-box',
          padding: '5px',
          overflow: 'hidden',
          fontSize: '18px',
          fontVariantLigatures: 'common-ligatures',
          backgroundColor: 'var(--mantine-color-body)',
          border: `3px solid ${form.errors.expression ? 'red' : '#868e96'}`,
          borderRadius: '5px',
          fontFamily: 'Fira code,Fira Mono,Consolas,Menlo,Courier,monospace',
        }}
      >
        <Textarea
          size="lg"
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
          autosize
          styles={{
            input: {
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
            },
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
          }}
          expression={form.values.expression}
        />
      </div>

      <Skeleton visible={loadingState === 'all'} mt="lg">
        <LoadingOverlay
          visible={loadingState === 'all'}
          zIndex={1001}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Skeleton visible={loadingState === 'solution'} p="sm" animate={false}>
          <LoadingOverlay
            visible={
              loadingState === 'solution' ||
              (Array.isArray(loadingState) && loadingState.length > 0)
            }
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2, backgroundOpacity: 0 }}
          />
          {errorComponent || (
            <>
              <Group align="center" justify="center">
                <Title order={2}>Is </Title>
                <Badge
                  size="xl"
                  ml={5}
                  mr={5}
                  mt={4}
                  color={
                    form.values.result in resultToColorMap && !form.values.weak
                      ? resultToColorMap[form.values.result]
                      : 'gray'
                  }
                >
                  {form.values.strict ? 'strictly ' : ''}
                  {form.values.weak ? 'UNKNOWN' : form.values.result}
                </Badge>
                <Title order={2}>with regard to </Title>
                <Select
                  aria-label="with regard to"
                  data={variables}
                  value={form.values.wrt}
                  onChange={val => {
                    if (loadingState === null && val !== null) {
                      // setLoadingState('solution');
                      // form.setFieldValue('wrt', val);
                      updateForm({ ...form.values, wrt: val });
                    }
                  }}
                  allowDeselect={false}
                  //   disabled={loadingState !== null}
                />
              </Group>
              {form.values.weak && (
                <Group align="center" justify="center" mt="md" gap={0}>
                  <Text size="lg">It would be &nbsp;</Text>
                  <Badge
                    color={
                      form.values.result in resultToColorMap
                        ? resultToColorMap[form.values.result]
                        : 'gray'
                    }
                    size="lg"
                  >
                    {form.values.result}
                  </Badge>
                  <Text size="lg">
                    &nbsp;if <strong>{form.values.wrt}</strong> were&nbsp;
                  </Text>
                  <Group gap={2}>
                    {form.values?.weakConditions?.slice(0, -1).map((condition, index) => (
                      <Fragment key={condition}>
                        <Badge size="lg">{condition}</Badge>
                        {index < form.values.weakConditions.length - 2 && (
                          <Text size="xl">,&nbsp;</Text>
                        )}
                      </Fragment>
                    ))}
                    {form.values.weakConditions?.length > 1 && (
                      <Text size="lg">&nbsp;and&nbsp;</Text>
                    )}
                    {form.values?.weakConditions?.slice(-1).map(condition => (
                      <>
                        <Badge key={condition} size="lg">
                          {condition}
                        </Badge>
                      </>
                    ))}
                    <Text size="lg">.</Text>
                  </Group>
                </Group>
              )}
            </>
          )}
        </Skeleton>

        <Skeleton animate visible={false}>
          <Paper p="md" shadow="xs" mt="lg">
            <Table.ScrollContainer minWidth={850}>
              <Table highlightOnHover={false} withRowBorders verticalSpacing="sm">
                <Table.Thead style={{ textAlign: 'center' }}>
                  <Table.Tr>
                    <Table.Td>
                      <Title order={6}>Variable</Title>
                    </Table.Td>
                    <Table.Td>
                      <Title order={6}>Order</Title>
                    </Table.Td>
                    <Table.Td style={{ minWidth: '320px' }}>
                      <Title order={6}>Interval</Title>
                    </Table.Td>
                    <Table.Td>
                      <Title order={6}>Properties</Title>
                    </Table.Td>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody style={{ textAlign: 'center' }}>
                  {form.values.variables.map((varConf, variable) => (
                    <VariableConfig
                      key={variable}
                      variableKey={variable}
                      varConf={varConf}
                      form={form}
                      loadingState={loadingState}
                      updateVariable={updateVariable}
                    />
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>
        </Skeleton>
      </Skeleton>

      <Center>
        <Title order={2} mb="xs" mt="xl">
          {' '}
          Examples
        </Title>
      </Center>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
        {examples.map(example => (
          <Example
            updateForm={updateForm}
            title={example.title}
            values={example.values}
            key={example.title}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}
