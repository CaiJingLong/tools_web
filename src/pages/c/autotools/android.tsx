import {
  abiList,
  buildPlatformList,
  libTypeList,
  makeBuildShell,
} from '@/utils/autotools';
import { useSafeState } from 'ahooks';
import { Button, Modal, Space } from 'antd';
import { flags } from '@/configs';
import {
  CachedInput,
  CachedInputNumber,
} from '@/components/cached/cached_input';
import { CachedRadioGroup } from '@/components/cached/cached_radio_picker';
import CodeWidget from '@/components/code_widget';

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
        allOptions={abiList}
        cachedKey={'android-abi'}
        onOptionChanged={setAbi}
      />
      <CachedRadioGroup
        title={'Build Platform'}
        allOptions={buildPlatformList}
        cachedKey={'android-build-platform'}
        onOptionChanged={setBuildPlatform}
      />
      <CachedRadioGroup
        title={'Lib Type'}
        allOptions={libTypeList}
        cachedKey={'android-lib-type'}
        onOptionChanged={setLibType}
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
      <CodeWidget
        fileName={`autotool-build-${abi}.sh`}
        code={shell}
        language="bash"
      />
    </Space>
  );
}

export default AndroidPart;
