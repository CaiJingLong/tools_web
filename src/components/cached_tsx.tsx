import { useSafeState } from 'ahooks';
import { Space } from 'antd';
import {
  CachedInput,
  CachedInputNumber,
  CachedTextArea,
} from './cached_text_area';
import { CachedRadioGroup } from './radio_picker';

export interface CacheFormItemProps {
  type: 'input' | 'textArea' | 'inputNumber' | 'radioGroup';
  cachedKey: string;
  title: string;
  defaultValue?: string | number;
  values?: string[];
  min?: number;
  max?: number;
}

export interface CachedFormProps {
  items: CacheFormItemProps[];
  onDataChanged?: (data: {
    [key: string]: string | number | undefined;
  }) => void;
}

function MakerItem(props: {
  item: CacheFormItemProps;
  onValueChanged?: (v: string | number) => void;
}) {
  const { type, cachedKey, title, defaultValue, values } = props.item;
  const { onValueChanged: propValueChanged } = props;
  const [value, setValue] = useSafeState<string | number | undefined>(
    defaultValue,
  );

  const onValueChanged = (v: string) => {
    setValue(v);
    propValueChanged?.(v);
  };

  const onNumberValueChanged = (v: number) => {
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
          values={values!}
          localStoreKey={cachedKey}
          onValueChanged={onValueChanged}
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
    [key: string]: string | number | undefined;
  } = {};

  const [data, setData] = useSafeState(initData);

  for (let item of items) {
    widgets.push(
      <MakerItem
        item={item}
        onValueChanged={(v) => {
          const newData = { ...data, [item.cachedKey]: v };
          setData(newData);
          props.onDataChanged?.(newData);
        }}
      />,
    );
  }

  return <Space direction="vertical">{widgets}</Space>;
}
