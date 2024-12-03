/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Form, Input, InputNumber } from 'antd';

const EditableCell = ({
  // eslint-disable-next-line react/prop-types
  editing,
  // eslint-disable-next-line react/prop-types
  dataIndex,
  // eslint-disable-next-line react/prop-types
  title,
  // eslint-disable-next-line react/prop-types
  inputType,
  // eslint-disable-next-line no-unused-vars
  record,
  // eslint-disable-next-line no-unused-vars
  index,
  // eslint-disable-next-line react/prop-types
  children,
  ...restProps
}) => {
  // Render InputNumber if the input type is 'number'; otherwise, render Input
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
