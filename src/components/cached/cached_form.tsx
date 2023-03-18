import { useSafeState } from 'ahooks';
import { Space } from 'antd';
import { useEffect } from 'react';
import { CachedCheckboxGroup } from './cached_checkbox';
import { CachedInput, CachedInputNumber, CachedTextArea } from './cached_input';
import { CachedRadioGroup } from './cached_radio_picker';

export interface CacheFormItemProps {
  type: 'input' | 'textArea' | 'inputNumber' | 'radioGroup' | 'checkboxGroup';
  cachedKey: string;
  title: string;
  defaultValue?: string | number;
  options?: string[];
  min?: number;
  max?: number;
}

export interface CachedFormProps {
  items: CacheFormItemProps[];
  onDataChanged?: (data: {
    [key: string]: string | number | string[] | undefined;
  }) => void;
}

function CachedFormItem(props: {
  item: CacheFormItemProps;
  onValueChanged?: (v: string | number | string[]) => void;
}) {
  const { type, cachedKey, title, defaultValue, options: values } = props.item;
  const { onValueChanged: propValueChanged } = props;
  const [value, setValue] = useSafeState<
    string | number | string[] | undefined
  >(defaultValue);

  const onValueChanged = (v: string) => {
    setValue(v);
    propValueChanged?.(v);
  };

  const onNumberValueChanged = (v: number) => {
    setValue(v);
    propValueChanged?.(v);
  };

  const onCheckboxValueChanged = (v: string[]) => {
    setValue(v);
    propValueChanged?.(v);
  };

  switch (type) {
    case 'input':
      return (
        <CachedInput
          cachedKey={cachedKey}
          onValueChanged={onValueChanged}
          title={title}
          htmlSize={120}
          value={value}
          defaultValue={defaultValue as string}
        />
      );
    case 'textArea':
      return (
        <CachedTextArea
          cachedKey={cachedKey}
          onValueChanged={onValueChanged}
          title={title}
          defaultValue={defaultValue as string}
        />
      );
    case 'inputNumber':
      return (
        <CachedInputNumber
          min={props.item.min}
          max={props.item.max}
          cachedKey={cachedKey}
          onValueChanged={onNumberValueChanged}
          title={title}
          defaultValue={defaultValue as number}
        />
      );
    case 'radioGroup':
      return (
        <CachedRadioGroup
          title={title}
          allOptions={values!}
          localStoreKey={cachedKey}
          onOptionChanged={onValueChanged}
        />
      );
    case 'checkboxGroup':
      return (
        <CachedCheckboxGroup
          title={title}
          allOptions={values!}
          localStoreKey={cachedKey}
          onOptionChanged={onCheckboxValueChanged}
        />
      );
    default:
      return <div>Unknown type: {type}</div>;
  }
}

export default function CachedForm(props: CachedFormProps) {
  const { items } = props;
  let widgets: JSX.Element[] = [];

  const initData: {
    [key: string]: string | number | string[] | undefined;
  } = {};

  for (let item of items) {
    initData[item.cachedKey] =
      localStorage.getItem(item.cachedKey) ?? item.defaultValue;
  }

  const [data, setData] = useSafeState(initData);

  useEffect(() => {
    props.onDataChanged?.(data);
    return () => {};
  }, [data]);

  for (let item of items) {
    widgets.push(
      <CachedFormItem
        item={item}
        key={item.cachedKey}
        onValueChanged={(v) => {
          const newData = { ...data, [item.cachedKey]: v };
          setData(newData);
        }}
      />,
    );
  }

  return <Space direction="vertical">{widgets}</Space>;
}
