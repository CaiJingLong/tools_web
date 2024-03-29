import { useLocalStorageState, useMount } from 'ahooks';
import { Input, InputNumber, InputNumberProps, Space } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { InputProps } from 'antd/lib/input';

interface Props<T> {
  cachedKey: string;
  emptytooltip?: string;
  onValueChanged: (e: T) => void;
}

interface DefaultValueProps<T> {
  defaultValue?: T;
}

type CachedTextAreaProps = Props<string> &
  TextAreaProps &
  DefaultValueProps<string>;
type CachedInputProps = Props<string> & InputProps & DefaultValueProps<string>;
type CachedInputNumberProps = Props<number> &
  InputNumberProps &
  DefaultValueProps<number>;

export function CachedTextArea(props: CachedTextAreaProps) {
  const {
    cachedKey,
    onValueChanged: onTextChanged,
    title,
    ...restProps
  } = props;

  const [value, setValue] = useLocalStorageState(cachedKey, {
    defaultValue: props.defaultValue || '',
    deserializer: (v) => v,
    serializer: (v) => v,
  });

  useMount(() => {
    if (value) onTextChanged(value);
  });

  console.log('text area', value);

  return (
    <Space direction="vertical">
      {title}
      <Input.TextArea
        {...restProps}
        status={props.emptytooltip && value === '' ? 'warning' : undefined}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onTextChanged(e.target.value);
          restProps.onChange?.(e);
        }}
        cols={120}
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
    defaultValue: props.defaultValue || '',
    deserializer: (v) => v,
    serializer: (v) => v,
  });

  useMount(() => {
    setValue(value);
    if (value) onTextChanged(value);
  });

  return (
    <Space direction="vertical">
      {title}
      <Input
        {...restProps}
        status={props.emptytooltip && value === '' ? 'warning' : undefined}
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
    defaultValue: props.defaultValue || 0,
    deserializer: (v) => Number(v),
    serializer: (v) => v.toString(),
  });

  useMount(() => {
    setValue(value);
    if (value) onTextChanged(value);
  });

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
