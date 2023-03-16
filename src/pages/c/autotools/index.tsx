import React from 'react';
import { useSafeState } from 'ahooks';
import { Space } from 'antd';
import AndroidPart from './android';
import Wait from '@/components/wait';
import { CachedRadioGroup } from '@/components/radio_picker';

const types = ['android', 'ios'];
type AutoToolType = (typeof types)[number];

const contentMap: Record<AutoToolType, React.ReactNode> = {
  android: <AndroidPart />,
  ios: <Wait name="ios" />,
};

export default function Page() {
  const localStoreKey = 'c-autotools-type';
  const [type, setType] = useSafeState<AutoToolType>(types[0]);

  const widget = contentMap[type];

  return (
    <Space direction="vertical">
      <CachedRadioGroup
        title={'Platform'}
        values={types}
        localStoreKey={localStoreKey}
        onValueChanged={setType}
      />
      {widget}
    </Space>
  );
}
