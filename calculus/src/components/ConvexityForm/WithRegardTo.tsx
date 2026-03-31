import { Select, SelectItem } from '@heroui/react';
import type { FormState, LoadingState, VarConf } from './ConvexityForm';
import type { UseFormReturnType } from '@mantine/form';

export function WithRegardTo({
  form,
  loadingState,
  updateForm,
  variables,
}: {
  form: UseFormReturnType<FormState>;
  loadingState: LoadingState;
  updateForm: (newValue: FormState) => void;
  variables: string[];
}) {
  return (
    <Select
      label="with regard to"
      labelPlacement="outside-left"
      aria-label="with regard to"
      variant="bordered"
      selectedKeys={form.values.wrt}
      className="max-w-xs text-nowrap "
      classNames={{
        label: 'sm:text-xl w-55 h-10 place-content-center pr-4',
        popoverContent: 'light:bg-white',
        trigger: 'variable-select-trigger',
      }}
      disabledKeys={[form.values.wrt]}
      onChange={e => {
        const val = e.target.value;
        if (loadingState === null && val !== null) {
          updateForm({ ...form.values, wrt: val });
        }
      }}
    >
      {variables.map(variable => (
        <SelectItem key={variable}>{variable}</SelectItem>
      ))}
    </Select>
  );
}
