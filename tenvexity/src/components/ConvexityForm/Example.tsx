import type { FormState } from './ConvexityForm';
import { HighlightedCode } from './HighlightedCode';
import { Card, CardBody } from '@nextui-org/react';

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
    <Card
      isPressable
      className="p-2"
      shadow="sm"
      radius="sm"
      onClick={() => {
        const newValues = {
          ...values,
          expression: values.expression.replace(/\n/g, ''),
        };
        updateForm(newValues);
        window.scrollTo(0, 0);
      }}
    >
      <CardBody className="text-center">
        <div className="text-center mb-1">
          <h3>{title}</h3>
        </div>
        <HighlightedCode expression={values.expression} />
      </CardBody>
    </Card>
  );
}
