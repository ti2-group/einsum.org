import { HighlightedCode } from './HighlightedCode';
import { Card, CardBody } from '@heroui/react';

export function Example({
  title,
  value,
  setProblem,
}: {
  title: string;
  value: string;
  setProblem: (problem: string) => void;
}) {
  return (
    <Card
      isPressable
      className="p-2"
      shadow="sm"
      radius="sm"
      onPress={() => {
        setProblem(value);
        window.scrollTo(0, 0);
      }}
    >
      <CardBody className="text-center">
        <div className="text-center mb-1">
          <h3>{title}</h3>
        </div>
        <HighlightedCode expression={value} />
      </CardBody>
    </Card>
  );
}
