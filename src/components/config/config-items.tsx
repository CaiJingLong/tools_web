import {
  Button,
  Checkbox,
  Input,
  Radio,
  Space,
  SpaceProps,
  message,
} from 'antd';
import React from 'react';

export const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  border: '1px solid #eee',
  padding: '10px',
};

export { style as configItemContainerStyle };

export function CheckGroup(props: {
  values: string[];
  checkedValues: string[];
  onChange: (v: string[]) => void;
  title: string;
  keyPrefix: string;
}) {
  return (
    <Space style={style} direction="vertical">
      <Space>
        <h3>{props.title}</h3>
        <Checkbox
          checked={props.checkedValues.length === props.values.length}
          onChange={(e) => {
            if (e.target.checked) {
              props.onChange(props.values);
            } else {
              props.onChange([]);
            }
          }}
        >
          All
        </Checkbox>
      </Space>
      <Checkbox.Group
        defaultValue={props.checkedValues}
        value={props.checkedValues}
        onChange={(v) => {
          props.onChange(v.map((item) => item as string));
        }}
      >
        {props.values.map((item) => (
          <Checkbox key={`${props.keyPrefix}-${item}`} value={item}>
            {item}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Space>
  );
}

export function Check(props: {
  text: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  onCheckedRender?: React.ReactNode;
  onUnCheckedRender?: React.ReactNode;
  title: string;
}) {
  return (
    <Space style={style} direction="vertical">
      <h3>{props.title}</h3>
      <Checkbox
        checked={props.checked}
        onChange={(v) => props.onChange(v.target.checked)}
      >
        {props.text}
      </Checkbox>

      {props.checked && props.onCheckedRender}
      {!props.checked && props.onUnCheckedRender}
    </Space>
  );
}

export function RadioGroup(props: {
  title: string;
  values: string[];
  checkedValue?: string;
  onChange: (v: string) => void;
  keyPrefix: string;
}) {
  return (
    <Space style={style} direction="vertical">
      <h3>{props.title}</h3>
      <Radio.Group
        value={props.checkedValue}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      >
        {props.values.map((item) => (
          <Radio key={`${props.keyPrefix}-${item}`} value={item}>
            {item}
          </Radio>
        ))}
      </Radio.Group>
    </Space>
  );
}

export function ConfigItemContainer(
  props: {
    title: string;
  } & React.PropsWithChildren<SpaceProps>,
) {
  const { title, ...rest } = props;
  return (
    <Space style={{ ...style }} direction="vertical" {...rest}>
      <h3>{title}</h3>
      {props.children}
    </Space>
  );
}

export function ConfigInputList(props: {
  title: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [inputValue, setInputValue] = React.useState('');
  return (
    <Space style={style} direction="vertical">
      <h3>{props.title}</h3>
      <Space>
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            if (!inputValue) {
              message.error('Please input value');
              return;
            }
            props.onChange([...props.values, inputValue]);
            setInputValue('');
          }}
        >
          Add
        </Button>
      </Space>
      <Space direction="vertical">
        {props.values.map((item) => (
          <Space key={item}>
            {item}
            <Button
              onClick={() => {
                props.onChange(props.values.filter((i) => i !== item));
              }}
            >
              Remove
            </Button>
          </Space>
        ))}
      </Space>
    </Space>
  );
}
