import { CachedInput, CachedInputNumber } from '@/components/cached_text_area';
import { CachedRadioGroup } from '@/components/radio_picker';
import { makeBuildShell } from '@/utils/autotools';
import { useSafeState } from 'ahooks';
import { Space } from 'antd';
import { CodeBlock } from '@atlaskit/code';
const abiList = [
  'aarch64-linux-android',
  'armv7a-linux-androideabi',
  'i686-linux-android',
  'x86_64-linux-android',
];

const buildPlatformList: string[] = ['macOS', 'linux', 'windows'];

const libTypeList = ['shared', 'static'];

export default function AndroidPart() {
  const [ndkPath, setNdkPath] = useSafeState<string>('');
  const [abi, setAbi] = useSafeState<string>('');
  const [buildPlatform, setBuildPlatform] = useSafeState<string>('');
  const [flags, setFlags] = useSafeState<string>('');
  const [apiLevel, setApiLevel] = useSafeState<number>(21);
  const [prefix, setPrefix] = useSafeState<string>('');
  const [libType, setLibType] = useSafeState<string>('shared');

  const shell = makeBuildShell({
    ndkPath,
    targetAbi: abi,
    apiLevel,
    buildPlatform,
    flags,
    prefix,
    processCount: 8,
    shell: 'bash',
    libType,
  });

  return (
    <Space direction="vertical">
      <CachedInput
        htmlSize={120}
        cachedKey={'android-ndk-path'}
        onValueChanged={setNdkPath}
        title={'NDK Path'}
        placeholder={'The path to the NDK. The support version is 25'}
        checkEmpty
      />
      <CachedRadioGroup
        title={'ABI'}
        values={abiList}
        localStoreKey={'android-abi'}
        onValueChanged={setAbi}
      />
      <CachedRadioGroup
        title={'Build Platform'}
        values={buildPlatformList}
        localStoreKey={'android-build-platform'}
        onValueChanged={setBuildPlatform}
      />
      <CachedRadioGroup
        title={'Lib Type'}
        values={libTypeList}
        localStoreKey={'android-lib-type'}
        onValueChanged={setLibType}
      />
      <CachedInputNumber
        title={'API Level'}
        cachedKey={'android-api-level'}
        min={21}
        max={33}
        value={apiLevel}
        onValueChanged={(n) => {
          setApiLevel(n as number);
        }}
      />
      <CachedInput
        cachedKey={'android-prefix'}
        onValueChanged={setPrefix}
        htmlSize={120}
        title={'prefix'}
        placeholder={
          'The prefix is used to install the built files. Recommended to use the absolute path.'
        }
        checkEmpty
      />
      <CachedInput
        title="other flags"
        cachedKey={'android-flags'}
        placeholder={
          'The flags are used to pass to the configure script. For example, --enable-static --disable-shared'
        }
        onValueChanged={setFlags}
      />
      <CodeBlock text={shell} language="shell" />
    </Space>
  );
}
