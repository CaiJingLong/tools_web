import { useLocalStorageState, useMount } from 'ahooks';
import { Radio, RadioGroupProps, Space } from 'antd';

interface Props {
  title: string;
  allOptions: string[];
  cachedKey: string;
  onOptionChanged?: (value: string) => void;
}

type CachedRadioGroupProps = Props & RadioGroupProps;

export function CachedRadioGroup(props: CachedRadioGroupProps) {
  const {
    title,
    allOptions: radioValues,
    cachedKey,
    onOptionChanged: onChange,
    ...origin
  } = props;

  const [value, setValue] = useLocalStorageState(cachedKey, {
    defaultValue: radioValues[0],
    deserializer: (v) => v,
    serializer: (v) => v,
  });

  useMount(() => {
    if (onChange) {
      setValue(value);
      if (value) onChange(value);
    }
  });

  return (
    <Space direction="vertical">
      {title}
      <Radio.Group
        options={radioValues}
        onChange={(e) => {
          setValue(e.target.value);
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        value={value}
        optionType="button"
        {...origin}
      />
    </Space>
  );
}

interface BoolProps {
  title: string;
  cachedKey: string;
  onValueChanged?: (value: boolean) => void;
}

type CachedBoolRadioProps = BoolProps & RadioGroupProps;

export function CachedBoolRadio(props: CachedBoolRadioProps) {
  return (
    <Space direction="vertical">
      {props.title}
      <Radio.Group
        options={['true', 'false']}
        onChange={(e) => {
          const value = e.target.value === 'true';
          if (props.onValueChanged) {
            props.onValueChanged(value);
          }
        }}
        value={props.value}
        optionType="button"
        {...props}
      />
    </Space>
  );
}
