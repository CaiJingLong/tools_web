import Building from '@/components/building';
import CachedForm, {
  CachedFormData,
  CacheFormItemProps,
} from '@/components/cached/cached_form';
import CodeWidget from '@/components/code_widget';
import ColSpace from '@/components/col';
import { libTypeList } from '@/utils/autotools';
import { formatConfigurations } from '@/utils/strings';
import { useSafeState } from 'ahooks';

export default function AutoToolIOS() {
  const props: CacheFormItemProps[] = [
    {
      cachedKey: 'xcode-path',
      title: 'Xcode Path',
      type: 'input',
      defaultValue: '/Applications/Xcode.app',
    },
    {
      cachedKey: 'ios-target-abi',
      title: 'Target ABI',
      type: 'checkboxGroup',
      options: ['arm64', 'arm64e', 'x86_64'],
      defaultValue: ['arm64', 'arm64e', 'x86_64'],
    },
    {
      cachedKey: 'ios-lib-type',
      title: 'Lib type',
      type: 'radioGroup',
      options: libTypeList,
    },
    {
      cachedKey: 'ios-cflags',
      title: 'CFLAGS',
      type: 'textArea',
    },
    {
      cachedKey: 'ios-prefix',
      title: 'prefix',
      type: 'input',
      defaultValue: '$HOME/libs/ios',
    },
  ];

  const [data, setData] = useSafeState<CachedFormData>({});

  const xcodePath = data['xcode-path'] as string;
  const targetAbi = data['ios-target-abi'] as string[];
  const iosLibType = data['ios-lib-type'] as string;
  const prefix = data['ios-prefix'] as string;
  const iosCflags = data['ios-cflags'] as string;

  console.log('xcodePath', xcodePath);
  console.log('targetAbi', targetAbi);
  console.log('iosLibType', iosLibType);
  console.log('prefix', prefix);
  console.log('iosCflags', iosCflags);

  let shell: string;

  if (xcodePath && targetAbi && iosLibType && prefix) {
    const libTypeFlag =
      iosLibType === 'shared'
        ? '--enable-shared --disable-static'
        : '--disable-shared --enable-static';

    const archs = targetAbi.map((abi) => `-arch ${abi}`).join(' ');
    const cc = `CC="$BINS/clang ${archs}"`;
    const cxx = `CXX="$BINS/clang++ ${archs}"`;

    let command = `./configure --prefix=${prefix} ${libTypeFlag} ${iosCflags}`;
    command = formatConfigurations(command);

    shell = `
#!/bin/bash
export XCODE_PATH=${xcodePath};
export BINS=$XCODE_PATH/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
export ${cc}
export ${cxx}
export LD=$BINS/ld
export AR=$BINS/ar
export AS=$BINS/as
export NM=$BINS/nm
export RANLIB=$BINS/ranlib
export STRIP=$BINS/strip

${command}
make -j8
make install
  `.trim();
  } else {
    shell = '';
  }

  return (
    <ColSpace>
      <Building />
      <CachedForm items={props} onDataChanged={setData} />
      <CodeWidget code={shell} fileName="ios-autotool.sh" language="bash" />
    </ColSpace>
  );
}
