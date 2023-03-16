import { join } from './strings';

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

export function makeBuildShell(options: AutotoolsBuildOptions): string {
  const { ndkPath, targetAbi, apiLevel, buildPlatform, libType } = options;

  let { processCount, shell, flags } = options;

  if (libType === 'static') {
    flags += ' --enable-static --disable-shared';
  } else {
    flags += ' --enable-shared --disable-static';
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

  const bins = join(toolchains, 'bin');

  const cc = `${join(bins, targetAbi)}${apiLevel}-clang`;
  const cxx = `${join(bins, targetAbi)}${apiLevel}-clang++`;
  const ar = join(bins, 'llvm-ar');
  const as = cc;
  const ld = join(bins, 'ld');
  const ranlib = join(bins, 'llvm-ranlib');
  const strip = join(bins, 'llvm-strip');

  return `
#!/bin/${shell}
export NDK=${ndkPath}
export CC=${cc}
export CXX=${cxx}
export AR=${ar}
export AS=${as}
export LD=${ld}
export RANLIB=${ranlib}
export STRIP=${strip}

./configure --host ${targetAbi} --prefix=${options.prefix} ${flags}
make -j${processCount}
make install
    `.trim();
}

// The mode is absolute path
