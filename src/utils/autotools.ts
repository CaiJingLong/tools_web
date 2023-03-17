import { join } from './strings';
export const abiList = [
  'aarch64-linux-android',
  'armv7a-linux-androideabi',
  'i686-linux-android',
  'x86_64-linux-android',
];

export const buildPlatformList: string[] = ['macOS', 'linux', 'windows'];

export const libTypeList = ['shared', 'static'];

interface AutotoolsBuildOptions {
  ndkPath: string;
  targetAbi: string;
  apiLevel: number;
  buildPlatform: string;
  flags: string;
  libType: string;
  processCount?: number;
  shell?: string;
  prefix: string;
}

function convertBuildPlatform(platform: string): string {
  let p = platform.toLowerCase();
  if (p === 'darwin' || p === 'macos') {
    return 'darwin-x86_64';
  } else if (p === 'linux') {
    return 'linux-x86_64';
  } else if (p === 'windows') {
    return 'windows-x86_64';
  } else {
    return '';
  }
}

function convertAndroidAbi(abi: string): string {
  if (abi === 'aarch64-linux-android') {
    return 'arm64-v8a';
  } else if (abi === 'armv7a-linux-androideabi') {
    return 'armeabi-v7a';
  } else if (abi === 'i686-linux-android') {
    return 'x86';
  } else if (abi === 'x86_64-linux-android') {
    return 'x86_64';
  }

  return '';
}

function convertAndroidPrefix(prefix: string, targetAbi: string): string {
  let installPrefix = prefix || join('$HOME', 'libs', 'android');
  return join(installPrefix, convertAndroidAbi(targetAbi));
}

export function makeBuildShell(options: AutotoolsBuildOptions): string {
  const { ndkPath, targetAbi, apiLevel, buildPlatform, libType } = options;

  let { processCount, shell, flags } = options;

  if (libType === 'static') {
    flags = `--enable-static --disable-shared ${flags}`;
  } else {
    flags = `--enable-shared --disable-static ${flags}`;
  }

  processCount = processCount || 6;
  shell = shell || 'bash';

  const toolchains = join(
    ndkPath,
    'toolchains',
    'llvm',
    'prebuilt',
    convertBuildPlatform(buildPlatform),
  );

  const bin = join('$TOOLCHAINS', 'bin');
  const bins = '$BINS';

  const cc = `${join(bins, targetAbi)}${apiLevel}-clang`;
  const cxx = `${join(bins, targetAbi)}${apiLevel}-clang++`;
  const ar = join(bins, 'llvm-ar');
  const as = '$CC';
  const ld = join(bins, 'ld');
  const ranlib = join(bins, 'llvm-ranlib');
  const strip = join(bins, 'llvm-strip');

  const prefix = convertAndroidPrefix(options.prefix, targetAbi);

  return `
#!/bin/${shell}
export NDK=${ndkPath}
export TOOLCHAINS=${toolchains}
export BINS=${bin}
export CC=${cc}
export CXX=${cxx}
export AR=${ar}
export AS=${as}
export LD=${ld}
export RANLIB=${ranlib}
export STRIP=${strip}

./configure --host ${targetAbi} --prefix=${prefix} ${flags}
make -j${processCount}
make install
    `.trim();
}

// The mode is absolute path
