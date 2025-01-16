/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContextType, RJSFSchema, RJSFValidationError, StrictRJSFSchema } from "@rjsf/utils";
import { FormProps, IChangeEvent } from "@rjsf/core/lib/components/Form";

import Button from "@mui/material/Button";
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import { Form } from "@rjsf/mui";
import { IdType } from "../../model/id";
import PendingIcon from '@mui/icons-material/Pending';
import React from "react";
import { log } from "../util";
import validator from '@rjsf/validator-ajv8';

interface SchemaFormProps<Model = any,
  S extends StrictRJSFSchema = any,
  F extends FormContextType = any
> extends Omit<FormProps<any, S, F>, 'validator'> {
  modelId: IdType | undefined | null;
  // schema: RJSFSchema;
  // uiSchema: UiSchema<any, any, any>
  // validator: any;
  // formData: any;
  validator?: any;
  onSubmit: (data: IChangeEvent<any, any, any>, event: React.FormEvent<any>) => Promise<Model>;
  // onError?: (errors: any) => void;
}

export const SimpleSchemaForm = <Model = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: SchemaFormProps<Model, S, F>): JSX.Element => {
  const [pendingCall, setPendingCall] = React.useState(false);
  const [primaryButtonColor, setPrimaryButtonColor] = React.useState<'primary' | 'inherit' | 'success' | 'error' | 'secondary' | 'info' | 'warning'>('primary');
  const [submitButtonIcon, setSubmitButtonIcon] = React.useState<React.ReactNode>(undefined);
  const [formHasvalidationError, setFormHasValidationError] = React.useState(false);
 
  return (
    <Form
      {
        ...props
      }
      validator={props.validator || validator}

      // schema={props.schema}
      // validator={props.validator}

      // schema={props.schema}
      // validator={props.validator}
      // uiSchema={props.uiSchema || undefined}
      // formData={props.formData}
        focusOnFirstError={props.focusOnFirstError !== undefined ? props.focusOnFirstError : true}
        onChange={(data, id) => {
          log('changed ' + id);
          setSubmitButtonIcon(undefined);
          setPrimaryButtonColor('primary');
          if (props.onChange) {
            return props.onChange(data, id);
          }
        }}
        onSubmit={(d, e) => {
          setPendingCall(true);
          setSubmitButtonIcon(<PendingIcon />);
          props.onSubmit(d, e).then(() => {
            setPrimaryButtonColor('success');
            setSubmitButtonIcon(<DoneIcon />);
          }).catch((err) => {
            log(err);
            setPrimaryButtonColor('error');
            setSubmitButtonIcon(<ErrorIcon />);
          }).finally(() => setPendingCall(false));
        }}
        onError={(errs: RJSFValidationError[]) => {
          !formHasvalidationError && setFormHasValidationError(true);
          if (props.onError) {
            props.onError(errs);
         } else {
           log('errors');
         }
        }}
      liveValidate={true}
    >
      <div>
        <Button
          type='submit'
          variant='contained'
          color={primaryButtonColor}
          disabled={pendingCall || formHasvalidationError}
          endIcon={submitButtonIcon}>{props.modelId == undefined ? 'Create' : 'Save changes'}</Button>
        <Button
          type='button'
          variant='outlined'
          color='secondary'
          disabled={pendingCall}>Cancel</Button>
      </div>
      </Form>);
};
