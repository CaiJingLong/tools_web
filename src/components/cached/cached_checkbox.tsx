import { useLocalStorageState, useMount } from 'ahooks';
import { Checkbox, Space } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { useEffect } from 'react';

interface Props {
  title: string;
  allOptions: string[];
  localStoreKey: string;
  onOptionChanged?: (value: string[]) => void;
}

type CachedeckboxGroupProps = Props & CheckboxGroupProps;

export function CachedCheckboxGroup(props: CachedeckboxGroupProps) {
  const {
    title,
    allOptions: checkboxValues,
    localStoreKey,
    onOptionChanged: onChange,
    ...origin
  } = props;

  const [value, setValue] = useLocalStorageState(localStoreKey, {
    defaultValue: checkboxValues,
  });

  useMount(() => {
    setValue(value);
    if (onChange) {
      onChange(value);
    }
  });

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value]);

  return (
    <Space direction="vertical">
      {title}
      <Checkbox.Group
        options={checkboxValues}
        onChange={(e) => {
          setValue(e as string[]);
        }}
        value={value}
        {...origin}
      />
    </Space>
  );
}
