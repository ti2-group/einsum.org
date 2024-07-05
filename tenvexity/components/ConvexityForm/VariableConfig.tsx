import {
  Button,
  Chip,
  Grid,
  Group,
  LoadingOverlay,
  NumberInput,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import type { FormState, LoadingState, VarConf } from './ConvexityForm';

export function VariableConfig({
  form,
  variableKey,
  varConf,
  loadingState,
  updateVariable,
}: {
  form: UseFormReturnType<FormState>;
  variableKey: number;
  varConf: VarConf;
  loadingState: LoadingState;
  updateVariable: (key: number, newValue: VarConf) => void;
}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Title order={4}>{varConf.name}</Title>
      </Table.Td>
      <Table.Td>
        <Group justify="center" align="center">
          <NumberInput
            // variant="unstyled"
            disabled={varConf.orderInferred || loadingState === 'all'}
            aria-label="Order"
            min={0}
            startValue={1}
            value={varConf.order}
            onChange={val =>
              updateVariable(variableKey, {
                ...varConf,
                order: Number(val),
              })
            }
            allowNegative={false}
            style={{ width: 75 }}
            mr={10}
          />
        </Group>
      </Table.Td>
      <Table.Td>
        <Group justify="center" gap="xs">
          <Button
            variant="filled"
            color="teal"
            p={0}
            pl={8}
            pr={8}
            style={{ fontSize: '20px' }}
            onClick={() => {
              // setLoadingState('solution');
              // form.setFieldValue(
              //   `variables.${variableKey}.interval.lowerIncluded`,
              //   !varConf.interval.lowerIncluded
              // );
              updateVariable(variableKey, {
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
          <TextInput
            aria-label="Lower bound"
            value={varConf.interval.lower}
            placeholder="-Inf"
            style={{ width: 100 }}
            onChange={event => {
              // setLoadingState('solution');
              // form.setFieldValue(`variables.${variableKey}.interval.lower`, event.target.value);
              updateVariable(variableKey, {
                ...varConf,
                interval: {
                  ...varConf.interval,
                  lower: event.target.value,
                },
              });
            }}
            error={!!form.errors[`variables.${variableKey}.interval.lower`]}
            disabled={loadingState === 'all'}
          />
          <TextInput
            aria-label="Upper bound"
            placeholder="Inf"
            style={{ width: 100 }}
            value={varConf.interval.upper}
            onChange={event => {
              // setLoadingState('solution');
              form.setFieldValue(`variables.${variableKey}.interval.upper`, event.target.value);
              updateVariable(variableKey, {
                ...varConf,
                interval: {
                  ...varConf.interval,
                  upper: event.target.value,
                },
              });
            }}
            error={!!form.errors[`variables.${variableKey}.interval.upper`]}
            disabled={loadingState === 'all'}
          />

          <Button
            variant="filled"
            color="teal"
            p={0}
            pl={8}
            pr={8}
            style={{ fontSize: '20px' }}
            onClick={() => {
              // setLoadingState('solution');
              // form.setFieldValue(
              //   `variables.${variableKey}.interval.upperIncluded`,
              //   !varConf.interval.upperIncluded
              // );
              updateVariable(variableKey, {
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
        </Group>
        {!!form.errors[`variables.${variableKey}.interval.lower`] && (
          <Text size="xs" c="red">
            {form.errors[`variables.${variableKey}.interval.lower`]}
          </Text>
        )}
        {!!form.errors[`variables.${variableKey}.interval.upper`] && (
          <Text size="xs" c="red">
            {form.errors[`variables.${variableKey}.interval.upper`]}
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        {varConf.order % 2 === 0 && (
          <Chip.Group
            multiple
            value={[...varConf.tags, ...varConf.inferredTags]}
            onChange={tags => {
              if (loadingState !== 'all' && !loadingState?.includes(varConf.name)) {
                updateVariable(variableKey, {
                  ...varConf,
                  tags,
                });
              }
            }}
          >
            <Grid style={{ position: 'relative' }} gutter="xs" justify="center">
              <LoadingOverlay
                visible={loadingState?.includes(varConf.name)}
                loaderProps={{ size: 'xs' }}
              />

              <Grid.Col span={{ base: 4, lg: 2 }} order={{ base: 1, lg: 1 }}>
                <Tooltip label="Diagonal" refProp="rootRef">
                  <Chip
                    color="teal"
                    value="DIA"
                    variant="filled"
                    disabled={varConf.inferredTags.includes('DIA')}
                  >
                    DIA
                  </Chip>
                </Tooltip>
              </Grid.Col>
              <Grid.Col span={{ base: 4, lg: 2 }} order={{ base: 4, lg: 2 }}>
                <Tooltip label="Symmetric" refProp="rootRef">
                  <Chip
                    value="SYM"
                    color="teal"
                    variant="filled"
                    disabled={varConf.inferredTags.includes('SYM')}
                  >
                    SYM
                  </Chip>
                </Tooltip>
              </Grid.Col>
              <Grid.Col span={{ base: 4, lg: 2 }} order={{ base: 2, lg: 3 }}>
                <Tooltip label="Positive definite" refProp="rootRef">
                  <Chip
                    color="teal"
                    value="PD"
                    variant="filled"
                    disabled={varConf.inferredTags.includes('PD')}
                  >
                    PD
                  </Chip>
                </Tooltip>
              </Grid.Col>
              <Grid.Col span={{ base: 4, lg: 2 }} order={{ base: 5, lg: 4 }}>
                <Tooltip label="Positive semi-definite" refProp="rootRef">
                  <Chip
                    color="teal"
                    value="PSD"
                    variant="filled"
                    disabled={varConf.inferredTags.includes('PSD')}
                  >
                    PSD
                  </Chip>
                </Tooltip>
              </Grid.Col>
              <Grid.Col span={{ base: 4, lg: 2 }} order={{ base: 3, lg: 5 }}>
                <Tooltip label="Negative definite" refProp="rootRef">
                  <Chip
                    color="teal"
                    value="ND"
                    variant="filled"
                    disabled={varConf.inferredTags.includes('ND')}
                  >
                    ND
                  </Chip>
                </Tooltip>
              </Grid.Col>
              <Grid.Col span={{ base: 4, lg: 2 }} order={{ base: 6, lg: 6 }}>
                <Tooltip label="Negative semi-definite" refProp="rootRef">
                  <Chip
                    color="teal"
                    value="NSD"
                    variant="filled"
                    disabled={varConf.inferredTags.includes('NSD')}
                  >
                    NSD
                  </Chip>
                </Tooltip>
              </Grid.Col>
            </Grid>
          </Chip.Group>
        )}
      </Table.Td>
    </Table.Tr>
  );
}
