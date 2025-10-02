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
  Tooltip,
} from '@heroui/react';
import type { UseFormReturnType } from '@mantine/form';
import type { FormState, LoadingState, VarConf } from './ConvexityForm';
import VarConfTags from './VarConfTags';

export default function TransposedVariableTable({
  form,
  loadingState,
  updateVariable,
  variables,
}: {
  form: UseFormReturnType<FormState>;
  loadingState: LoadingState;
  updateVariable: (key: number, newVar: VarConf) => void;
  variables: FormState['variables'];
}) {
  return (
    <Table
      disabledKeys={Array.isArray(loadingState) ? loadingState : []}
      radius="sm"
      isCompact
      className="place-self-center mt-8"
      aria-label="Configure variables (order, interval, symmetrie and definite properties)"
    >
      <TableHeader style={{ textAlign: 'center' }}>
        <TableColumn>Variable</TableColumn>
        {/* @ts-expect-error */}
        {variables.map(variable => (
          <TableColumn key={variable.name} className="text-center">
            {variable.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody style={{ textAlign: 'center' }}>
        <TableRow>
          <TableCell>Order</TableCell>
          {/* @ts-expect-error */}
          {variables.map((varConf, variable) => (
            <TableCell key={varConf.name}>
              <Input
                aria-label="Order"
                type="number"
                size="sm"
                value={varConf.order.toString()}
                required={true}
                className="w-16 m-auto"
                classNames={{
                  input: 'text-center',
                }}
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
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Diagonal</TableCell>
          {/* @ts-expect-error */}
          {variables.map((varConf, variable) => {
            const activeTags = [...varConf.tags, ...varConf.inferredTags];
            if (varConf.order % 2 !== 0) {
              return <TableCell key={varConf.name}></TableCell>;
            }
            return (
              <TableCell key={varConf.name} className="text-center">
                <Button
                  size="sm"
                  aria-pressed={activeTags.includes('DIA')}
                  isDisabled={
                    varConf.inferredTags.includes('DIA') || loadingState?.includes(varConf.name)
                  }
                  color={activeTags.includes('DIA') ? 'success' : 'default'}
                  variant={activeTags.includes('DIA') ? 'solid' : 'ghost'}
                  onPress={() =>
                    updateVariable(variable, {
                      ...varConf,
                      tags: varConf.tags.includes('DIA')
                        ? varConf.tags.filter(t => t !== 'DIA')
                        : [...varConf.tags, 'DIA'],
                    })
                  }
                >
                  DIA
                </Button>
              </TableCell>
            );
          })}
        </TableRow>
        <TableRow>
          <TableCell>Symmetric</TableCell>
          {/* @ts-expect-error */}
          {variables.map((varConf, variable) => {
            const activeTags = [...varConf.tags, ...varConf.inferredTags];
            if (varConf.order % 2 !== 0) {
              return <TableCell key={varConf.name}></TableCell>;
            }
            return (
              <TableCell key={varConf.name} className="text-center">
                <Button
                  size="sm"
                  className="m-auto"
                  aria-pressed={activeTags.includes('SYM')}
                  isDisabled={
                    varConf.inferredTags.includes('SYM') || loadingState?.includes(varConf.name)
                  }
                  color={activeTags.includes('SYM') ? 'success' : 'default'}
                  variant={activeTags.includes('SYM') ? 'solid' : 'ghost'}
                  onPress={() =>
                    updateVariable(variable, {
                      ...varConf,
                      tags: varConf.tags.includes('SYM')
                        ? varConf.tags.filter(t => t !== 'SYM')
                        : [...varConf.tags, 'SYM'],
                    })
                  }
                >
                  SYM
                </Button>
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
}
