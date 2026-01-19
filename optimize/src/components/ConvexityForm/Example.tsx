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
        document.getElementById('problem-heading')?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      <CardBody className="">
        <div className=" mb-1">
          <h3 className="text-primary text-lg font-semibold">{title}</h3>
        </div>
        <div className="relative overflow-x-auto max-h-[350px] overflow-y-auto">
          <pre>{value}</pre>
        </div>
      </CardBody>
    </Card>
  );
}
