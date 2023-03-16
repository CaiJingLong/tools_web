import { TextAreaProps } from 'antd/es/input';
import { Input, InputNumber, InputNumberProps, Space } from 'antd';
import { useLocalStorageState, useMount } from 'ahooks';
import { InputProps } from 'antd/lib/input';

interface Props<T> {
  cachedKey: string;
  checkEmpty?: boolean;
  onValueChanged: (e: T) => void;
}

type CachedTextAreaProps = Props<string> & TextAreaProps;
type CachedInputProps = Props<string> & InputProps;
type CachedInputNumberProps = Props<number> & InputNumberProps;

export function CachedTextArea(props: CachedTextAreaProps) {
  const {
    cachedKey,
    onValueChanged: onTextChanged,
    title,
    ...restProps
  } = props;

  const [value, setValue] = useLocalStorageState(cachedKey, {
    defaultValue: '',
  });

  useMount(() => {});

  return (
    <Space direction="vertical">
      {title}
      <Input.TextArea
        {...restProps}
        status={props.checkEmpty && value === '' ? 'warning' : undefined}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onTextChanged(e.target.value);
          restProps.onChange?.(e);
        }}
      />
    </Space>
  );
}

export function CachedInput(props: CachedInputProps) {
  const {
    cachedKey,
    onValueChanged: onTextChanged,
    title,
    ...restProps
  } = props;

  const [value, setValue] = useLocalStorageState(cachedKey, {
    defaultValue: '',
  });

  useMount(() => {
    onTextChanged(value);
  });

  return (
    <Space direction="vertical">
      {title}
      <Input
        {...restProps}
        status={props.checkEmpty && value === '' ? 'warning' : undefined}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onTextChanged(e.target.value);
          restProps.onChange?.(e);
        }}
      />
    </Space>
  );
}

export function CachedInputNumber(props: CachedInputNumberProps) {
  const {
    cachedKey,
    onValueChanged: onTextChanged,
    title,
    ...restProps
  } = props;

  const [value, setValue] = useLocalStorageState(cachedKey, {
    defaultValue: 0,
  });

  useMount(() => {});

  return (
    <Space direction="vertical">
      {title}
      <InputNumber
        {...restProps}
        value={value}
        onChange={(e) => {
          setValue(e as number);
          onTextChanged(e as number);
          restProps.onChange?.(e);
        }}
      />
    </Space>
  );
}
