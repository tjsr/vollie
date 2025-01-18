// import { FieldProps } from "@rjsf/utils";
// import { User } from "../../model/entity";
// import { Widgets } from '@rjsf/mui';
// const { SelectWidget } = Widgets; // To get widgets from a theme do this



// const UserArrayFieldItemTemplate = function (props: FieldProps) {
//   const { index, registry } = props;
//   const item: User = props.schema.items[index];
//   const { SchemaField } = registry.fields;
//   const name = `Index ${index}`;
//   return <SchemaField {...props} name={name} />;
// };

// const UserDropdownWidget = (props: WidgetProps) => {
//   const { options } = props;
//   let { enumOptions } = options;
//   const label = <ArrayFieldItemTemplate {...props} />;
//   options.ArrayFieldItemTemplate?.propTypes.
//   return <SelectWidget {...props} label="" />
// };

import { ArrayFieldTemplateItemType } from '@rjsf/utils';
// import validator from '@rjsf/validator-ajv8';
import { User } from '../../model/entity';

// const schema: RJSFSchema = {
//   type: 'user',
//   items: {
//     type: 'User',
//   },
// };

export const UserArrayFieldItemTemplate = (props: ArrayFieldTemplateItemType) => {
  const { children } = props;
  // const item = formData[index];
  const item: User = children as unknown as User;
  const label = <><span className='firstname'>{item.firstName}</span><span className='lastname'>{item.lastName}</span>{children}</>;
  return label;
};

// render(
//   <Form schema={schema} validator={validator} templates={{ ArrayFieldItemTemplate }} />,
//   document.getElementById('app')
// );