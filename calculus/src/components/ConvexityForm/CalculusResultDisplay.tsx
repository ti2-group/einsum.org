import { Button, Card, CardBody, Chip, Tab, Tabs } from '@heroui/react';
import React, { Fragment } from 'react';
import { WithRegardTo } from './WithRegardTo';
import type { UseFormReturnType } from '@mantine/form';
import type { FormState, LoadingState, VarConf } from './ConvexityForm';
import { HighlightedCode } from './HighlightedCode';

function CalculusResultsDisplay({
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
  console.log(form.values.result, form.values);
  return (
    <>
      <div className="flex place-content-center">
        <WithRegardTo
          form={form}
          loadingState={loadingState}
          updateForm={updateForm}
          variables={variables}
        />
      </div>
      <Tabs aria-label="Options" variant="underlined" color="default">
        <Tab key="derivative" title="Derivative" className="bg-transparent">
          <Card radius="sm">
            <CardBody>
              {form.values.derivative && (
                <>
                  <HighlightedCode expression={form.values.derivative} />
                  <Button className="mt-4" variant="solid" color="primary" fullWidth={false}>
                    Insert into expression
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        </Tab>
        {form.values.code &&
          Array.isArray(form.values.code) &&
          form.values.code.map((code, i) => (
            <Tab key={i} title={code.name} className="bg-transparent">
              <Card>
                <CardBody>
                  <HighlightedCode expression={code.value} lang="python" />
                </CardBody>
              </Card>
            </Tab>
          ))}
      </Tabs>
    </>
  );
}

export default CalculusResultsDisplay;
