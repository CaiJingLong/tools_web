import CachedForm, {
  CachedFormData,
  CacheFormItemProps,
} from '@/components/cached/cached_form';
import CodeWidget from '@/components/code_widget';
import ColSpace from '@/components/col';
import { libTypeList } from '@/utils/autotools';
import { inlineText } from '@/utils/strings';
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
      options: ['arm64', 'armv7', 'armv7s', 'arm64e', 'armv7k'],
      defaultValue: ['arm64'],
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
  const targetAbi = data['target-abi'] as string[];
  const iosLibType = data['ios-lib-type'] as string;
  const prefix = data['prefix'] as string;
  const iosCflags = data['ios-cflags'] as string;

  console.log('xcodePath', xcodePath);
  console.log('targetAbi', targetAbi);
  console.log('iosLibType', iosLibType);
  console.log('prefix', prefix);
  console.log('iosCflags', iosCflags);

  let shell: string;

  if (xcodePath && targetAbi && iosLibType && prefix && iosCflags) {
    const libTypeFlag =
      iosLibType === 'shared'
        ? '--enable-shared --disable-static'
        : '--disable-shared --enable-static';

    let ldFlags = `-isysroot $XCODE_PATH/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk`;
    if (targetAbi) {
      for (const abi of targetAbi) {
        ldFlags += ` -arch ${abi}`;
      }
    }
    shell = `
#!/bin/bash
export XCODE_PATH=${xcodePath};
export BINS=$XCODE_PATH/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
export CC=$BINS/clang
export CXX=$BINS/clang++
export LD=$BINS/ld
export AR=$BINS/ar
export AS=$BINS/as
export NM=$BINS/nm
export RANLIB=$BINS/ranlib
export STRIP=$BINS/strip
export LDFLAGS="${ldFlags}"
export CFLAGS="${inlineText(iosCflags)}"
./configure --host=arm-apple-darwin --prefix=${prefix} ${libTypeFlag}
  `.trim();
  } else {
    shell = '';
  }

  return (
    <ColSpace>
      <CachedForm items={props} onDataChanged={setData} />
      <CodeWidget code={shell} fileName="ios-autotool.sh" language="bash" />
    </ColSpace>
  );
}
