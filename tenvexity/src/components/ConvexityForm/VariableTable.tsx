import {
  Button,
  Card,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import type { FormState, LoadingState, VarConf } from './ConvexityForm';
import VarConfTags from './VarConfTags';
import type { UseFormReturnType } from '@mantine/form';

export default function VariableTable({
  form,
  loadingState,
  variables,
  updateVariable,
}: {
  form: UseFormReturnType<FormState>;
  loadingState: LoadingState;
  variables: VarConf[];
  updateVariable: (key: number, newVar: VarConf) => void;
}) {
  return (
    <Table
      disabledKeys={Array.isArray(loadingState) ? loadingState : []}
      radius="sm"
      className="mt-8"
      aria-label="Configure variables (order, interval, symmetrie and definite properties)"
    >
      <TableHeader style={{ textAlign: 'center' }}>
        <TableColumn className="w-1">Variable</TableColumn>
        <TableColumn style={{ width: '90px' }}>Order</TableColumn>
        <TableColumn style={{ minWidth: '250px' }} className="w-80">
          Interval
        </TableColumn>
        <TableColumn style={{ minWidth: '220px' }}>Properties</TableColumn>
      </TableHeader>
      <TableBody style={{ textAlign: 'center' }}>
        {variables.map((varConf, variable) => (
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
                className="w-12"
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
                  onPress={() => {
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
                    form.setFieldValue(`variables.${variable}.interval.upper`, event.target.value);
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
                  onPress={() => {
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
  );
}
