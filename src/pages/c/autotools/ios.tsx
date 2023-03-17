import CachedForm, { CacheFormItemProps } from '@/components/cached_tsx';
import { libTypeList } from '@/utils/autotools';

export default function AutoToolIOS() {
  const data: CacheFormItemProps[] = [
    {
      cachedKey: 'xcode-path',
      title: 'Xcode Path',
      type: 'input',
      defaultValue: '/Applications/Xcode.app',
    },
    {
      cachedKey: 'target-abi',
      title: 'Target ABI',
      type: 'radioGroup',
      values: ['arm64', 'armv7', 'armv7s', 'arm64e', 'armv7k'],
      defaultValue: 'arm64',
    },
    {
      cachedKey: 'ios-lib-type',
      title: 'Lib type',
      type: 'radioGroup',
      values: libTypeList,
    },
    {
      cachedKey: 'prefix',
      title: 'prefix',
      type: 'input',
      defaultValue: '$HOME/libs/ios',
    },
  ];

  return (
    <CachedForm
      items={data}
      onDataChanged={(data) => {
        console.log(data);
      }}
    />
  );
}
