// import { HighlightedCode } from './HighlightedCode';
import { Card, CardBody } from '@heroui/react';
import { CodeEditor } from './CodeEditor';

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
        <CodeEditor value={value} readOnly={true} />
      </CardBody>
    </Card>
  );
}
