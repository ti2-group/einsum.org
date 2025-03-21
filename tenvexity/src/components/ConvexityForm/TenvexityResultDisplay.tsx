import { Chip } from '@heroui/react';
import React, { Fragment } from 'react';
import { WithRegardTo } from './WithRegardTo';
import type { UseFormReturnType } from '@mantine/form';
import type { FormState, LoadingState, VarConf } from './ConvexityForm';

const resultToColorMap: { [key in Solution['result']]: Colors } = {
  AFFINE: 'primary',
  UKNOWN: 'default',
  CONVEX: 'success',
  CONCAVE: 'warning',
};
function TenvexityResultDisplay({
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
    <>
      <div className="flex place-content-center my-3 gap-2 sm:text-xl">
        <div className="place-content-center sm:text-xl">Is </div>
        <Chip
          className="h-10 place-content-center mx-2 uppercase sm:text-xl"
          color={
            form.values.result in resultToColorMap && !form.values.weak
              ? resultToColorMap[form.values.result]
              : 'default'
          }
        >
          {form.values.strict ? 'strictly ' : ''}
          {form.values.weak ? 'UNKNOWN' : form.values.result.toLowerCase()}
        </Chip>
        <WithRegardTo
          form={form}
          loadingState={loadingState}
          updateForm={updateForm}
          variables={variables}
        />
      </div>
      {form.values.weak && (
        <div className="flex place-content-center gap-1 my-3">
          <span>It would be </span>
          <Chip
            color={
              form.values.result in resultToColorMap
                ? resultToColorMap[form.values.result]
                : 'default'
            }
            className="uppercase"
            size="md"
          >
            {form.values.result}
          </Chip>
          <span>
            &nbsp;if <strong>{form.values.wrt}</strong> were&nbsp;
          </span>
          <div className="flex">
            {form.values?.weakConditions?.slice(0, -1).map((condition, index) => (
              <Fragment key={condition}>
                <Chip size="md" color="primary" className="uppercase">
                  {condition}
                </Chip>
                {index < form.values.weakConditions.length - 2 && <span>,&nbsp;</span>}
              </Fragment>
            ))}
            {form.values.weakConditions?.length > 1 && <span>&nbsp;and&nbsp;</span>}
            {form.values?.weakConditions?.slice(-1).map(condition => (
              <Chip key={condition} size="md" color="primary" className="uppercase">
                {condition}
              </Chip>
            ))}
          </div>
          .
        </div>
      )}
    </>
  );
}

export default TenvexityResultDisplay;
