import { CachedInput, CachedInputNumber } from '@/components/cached_text_area';
import { CachedRadioGroup } from '@/components/radio_picker';
import {
  abiList,
  buildPlatformList,
  libTypeList,
  makeBuildShell,
} from '@/utils/autotools';
import { useSafeState } from 'ahooks';
import { Button, Modal, Space } from 'antd';
import { CodeBlock } from '@atlaskit/code';
import copy from 'copy-to-clipboard';
import { flags } from '@/configs';

function pickFlags() {
  for (const flag of flags.flags) {
    console.log(flag);
  }

  Modal.info({
    title: 'Pick flags',
    maskClosable: true,
    content: <div>Coming soon</div>,
  });
}

function AndroidPart() {
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
        emptytooltip={'The NDK path is empty.'}
        defaultValue={'$ANDORID_NDK'}
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
        defaultValue={21}
      />
      <CachedInput
        cachedKey={'android-prefix'}
        onValueChanged={setPrefix}
        htmlSize={120}
        title={'prefix'}
        placeholder={
          'The prefix is used to install the built files. Recommended to use the absolute path.'
        }
        emptytooltip={'The prefix is empty.'}
        defaultValue={'$HOME/android-libs'}
      />
      <Button onClick={pickFlags}>Show Flags</Button>
      <CachedInput
        title="other flags"
        htmlSize={120}
        cachedKey={'android-flags'}
        placeholder={
          'The flags are used to pass to the configure script. For example, --enable-static --disable-shared'
        }
        onValueChanged={setFlags}
      />
      <CodeBlock text={shell} language="shell" />
      <Button
        onClick={() => {
          copy(shell);
        }}
      >
        Copy
      </Button>
    </Space>
  );
}

export default AndroidPart;
