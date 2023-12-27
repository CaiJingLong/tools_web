import { CachedRadioGroup } from '@/components/cached/cached_radio_picker';
import { useSafeState } from 'ahooks';
import { Space } from 'antd';
import React from 'react';
import AndroidPart from './android';
import AutoToolIOS from './ios';

const types = ['android', 'iOS'];
type AutoToolType = (typeof types)[number];

const contentMap: {
  [key in AutoToolType]: React.ReactNode;
} = {
  android: <AndroidPart />,
  iOS: <AutoToolIOS />,
};

export default function Page() {
  const localStoreKey = 'c-autotools-type';
  const [type, setType] = useSafeState<AutoToolType>(types[0]);

  const widget = contentMap[type];

  return (
    <Space direction="vertical">
      <CachedRadioGroup
        title={'Platform'}
        allOptions={types}
        cachedKey={localStoreKey}
        onOptionChanged={setType}
      />
      {widget}
    </Space>
  );
}
