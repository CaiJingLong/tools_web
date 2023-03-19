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
  defaultValue?: string | number | string[];
  options?: string[];
  min?: number;
  max?: number;
}

export interface CachedFormData {
  [key: string]: string | number | string[] | undefined;
}

export interface CachedFormProps {
  items: CacheFormItemProps[];
  onDataChanged?: (data: CachedFormData) => void;
}

function CachedFormItem(props: {
  item: CacheFormItemProps;
  onValueChanged?: (v: string | number | string[]) => void;
}) {
  const { type, cachedKey, title, defaultValue, options: values } = props.item;
  const { onValueChanged: propValueChanged } = props;

  const onValueChanged = (v: string) => {
    propValueChanged?.(v);
  };

  const onNumberValueChanged = (v: number) => {
    propValueChanged?.(v);
  };

  const onCheckboxValueChanged = (v: string[]) => {
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
          cachedKey={cachedKey}
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
    const { cachedKey, defaultValue } = item;
    let saved = localStorage.getItem(item.cachedKey) ?? '';

    const setItem = (value: string | number | string[] | undefined) => {
      initData[cachedKey] = value ?? defaultValue;
    };

    if (item.type === 'inputNumber') {
      setItem(Number(saved));
    } else if (item.type === 'checkboxGroup') {
      setItem(saved.split(','));
    } else {
      setItem(saved);
    }
  }

  console.log('initData', initData);

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
