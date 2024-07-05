import { Center, Paper } from '@mantine/core';
import type { FormState } from './ConvexityForm';
import { HighlightedCode } from './HighlightedCode';

export function Example({
  title,
  values,
  updateForm,
}: {
  title: string;
  values: FormState;
  updateForm: (data: FormState) => void;
}) {
  return (
    <Paper
      component="button"
      p="sm"
      mt="sm"
      shadow="sm"
      style={{ width: '100%', cursor: 'pointer' }}
      onClick={() => {
        //   setLoadingState('all');
        //   setValues(values);
        const newValues = { ...values, expression: values.expression.replace(/\n/g, '') };
        updateForm(newValues);
        window.scrollTo(0, 0);
      }}
    >
      <Center>
        <strong>{title}</strong>
      </Center>
      <HighlightedCode expression={values.expression} />
    </Paper>
  );
}
