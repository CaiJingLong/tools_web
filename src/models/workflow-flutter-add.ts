import { useNotnullLocalStorageState } from '@/utils/hooks/notnull_local_storage';
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';

// platform: android, ios, web, linux, macos, windows
type FlutterPlatform =
  | 'android'
  | 'ios'
  | 'web'
  | 'linux'
  | 'macos'
  | 'windows';
export const FlutterPlatforms: FlutterPlatform[] = [
  'android',
  'ios',
  'web',
  'linux',
  'macos',
  'windows',
];

export interface Pkg {
  name: string;
  path: string;
  checked: boolean;
}

export interface JavaVersion {
  version: string;
  distribution: string;
}

const JavaVersions = ['8', '11', '17'];

/**
 * temurin	Eclipse Temurin	Link	Link
 * zulu	Azul Zulu OpenJDK	Link	Link
 * adopt or adopt-hotspot	AdoptOpenJDK Hotspot	Link	Link
 * adopt-openj9	AdoptOpenJDK OpenJ9	Link	Link
 * liberica	Liberica JDK	Link	Link
 * microsoft	Microsoft Build of OpenJDK	Link	Link
 * corretto	Amazon Corretto Build of OpenJDK	Link	Link
 * semeru	IBM Semeru Runtime Open Edition	Link	Link
 * oracle	Oracle JDK	Link	Link
 */
const JavaDistributions = [
  'temurin',
  'zulu',
  'adopt',
  'adopt-hotspot',
  'adopt-openj9',
  'liberica',
  'microsoft',
  'corretto',
  'semeru',
  'oracle',
];

// triggered
type FlutterTriggered = 'push' | 'pull_request';
export const FlutterTriggereds: FlutterTriggered[] = ['push', 'pull_request'];

function getRunsOn(platform: string) {
  switch (platform) {
    case 'android':
    case 'linux':
    case 'web':
      return 'ubuntu-latest';
    case 'ios':
    case 'macos':
      return 'macos-latest';
    case 'windows':
      return 'windows-latest';
    default:
      return 'ubuntu-latest';
  }
}

function getBuildCommand(platform: string) {
  switch (platform) {
    case 'android':
      return 'flutter build apk --debug';
    case 'ios':
      return 'flutter build ios --release --no-codesign';
    case 'web':
      return 'flutter build web --release';
    case 'linux':
      return 'flutter build linux --release';
    case 'macos':
      return 'flutter build macos --release';
    case 'windows':
      return 'flutter build windows --release';
  }

  return 'Echo "Unknown platform"';
}

function matrixFlutterVersion(flutterVersionList: string[]) {
  return `flutter-version: [${flutterVersionList
    .map((v) => `'${v}'`)
    .join(', ')}]`;
}

function makeAddPkgs(pkgList: Pkg[]) {
  // flutter pub add 'foo:{"path":"../foo"}'
  return pkgList
    .map((pkg) => {
      let path = '${{ github.workspace }}';
      if (pkg.path !== '.') {
        path += `/${pkg.path}`;
      }
      const json = JSON.stringify({ path });
      return `flutter pub add -- '${pkg.name}:${json}'`;
    })
    .join('\n');
}

function makeAddPkgSteps(pkgList: Pkg[], newProjectPath: string) {
  return pkgList
    .map((pkg) => {
      let path = '${{ github.workspace }}';
      if (pkg.path !== '.') {
        path += `/${pkg.path}`;
      }
      const json = JSON.stringify({ path });
      return `
      - name: Add ${pkg.name} to new project.
        run: flutter pub add -- '${pkg.name}:${json}'
        working-directory: ${newProjectPath}
      `;
    })
    .join('\n');
}

function makeJobWithFlutterVersion(
  platform: string,
  flutterVersion: string,
  pkgList: Pkg[],
  javaVersion: JavaVersion,
) {
  const jobName = `build-on-${platform}-${flutterVersion}`.replace(/\./g, '-');
  const runsOn = getRunsOn(platform);

  const runName = `Build flutter for ${platform} on ${runsOn} with ${flutterVersion}`;

  const buildCommand = getBuildCommand(platform);
  const newProjectName = 'new_project';
  const newProjectPath = `\${{ github.workspace }}/${newProjectName}`;

  let androidJavaStep =
    platform === 'android'
      ? `
      - uses: actions/setup-java@v2
        with:
          distribution: '${javaVersion.distribution}'
          java-version: '${javaVersion.version}'`
      : '';

  return `  ${jobName}:
    name: ${runName}
    runs-on: ${runsOn}
    steps:
      - uses: actions/checkout@v3
      ${androidJavaStep}
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${flutterVersion}
          cache: true
          cache-key: 'flutter-:os:-:channel:-:version:-:arch:-:hash:'
      - run: flutter doctor -v
        name: Flutter info
      - run: flutter create new_project --platforms=${platform}
        name: Create new project
${makeAddPkgSteps(pkgList, newProjectPath)}
      - run: flutter pub get
        working-directory: ${newProjectPath}
      - run: ${buildCommand}
        working-directory: ${newProjectPath}
        name: Build example
`;
}

function makeJob(
  platform: string,
  flutterVersionList: string[],
  pkgList: Pkg[],
  javaVersion: JavaVersion,
  splitMatrix: boolean,
) {
  if (splitMatrix) {
    let result = ``;
    for (const flutterVersion of flutterVersionList) {
      result += makeJobWithFlutterVersion(
        platform,
        flutterVersion,
        pkgList,
        javaVersion,
      );
    }
    return result;
  }
  const runsOn = getRunsOn(platform);
  const buildCommand = getBuildCommand(platform);
  const newProjectName = 'new_project';
  const newProjectPath = `\${{ github.workspace }}/${newProjectName}`;
  const flutterVersionMatrix = matrixFlutterVersion(flutterVersionList);
  const jobName = `build-on-${platform}`;
  const runName = `Build flutter for ${platform} on ${runsOn} with \${{ matrix.flutter-version }}`;
  const flutterVersion = '${{ matrix.flutter-version }}';

  let androidJavaStep =
    platform === 'android'
      ? `
      - uses: actions/setup-java@v2
        with:
          distribution: '${javaVersion.distribution}'
          java-version: '${javaVersion.version}'`
      : '';

  return `  ${jobName}:
    name: ${runName}
    runs-on: ${runsOn}
    strategy:
      matrix:
        ${flutterVersionMatrix}
    steps:
      - uses: actions/checkout@v3
      ${androidJavaStep}
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${flutterVersion}
          cache: true
          cache-key: 'flutter-:os:-:channel:-:version:-:arch:-:hash:'
      - run: flutter doctor -v
        name: Flutter info
      - run: flutter create new_project --platforms=${platform}
        name: Create new project
${makeAddPkgSteps(pkgList, newProjectPath)}
      // - run: ${makeAddPkgs(pkgList)}
      //   working-directory: ${newProjectPath}
      //   name: Add package to new project
      - run: flutter pub get
        working-directory: ${newProjectPath}
      - run: ${buildCommand}
        working-directory: ${newProjectPath}
        name: Build example
`;
}

function createGithubWorkflow(
  ciName: string,
  platforms: string[],
  triggered: string[],
  flutterVersionList: string[],
  srcPkgList: Pkg[],
  javaVersion: JavaVersion,
  splitMatrix: boolean,
): string {
  const pkgList = srcPkgList.filter((pkg) => pkg.checked);
  if (pkgList.length === 0) {
    return 'Please add package or checked package to Package list';
  }

  if (flutterVersionList.length === 0) {
    return 'Please add flutter version to Flutter version list';
  }

  if (platforms.length === 0) {
    return 'Please add platform to Platform list';
  }

  const jobs = platforms
    .map((platform) =>
      makeJob(platform, flutterVersionList, pkgList, javaVersion, splitMatrix),
    )
    .join('\n');
  return `name: ${ciName}

on:
  ${triggered.map((t) => `${t}:`).join('\n  ')}

jobs:
${jobs}
`;
}

export default function useWorkflowFlutterAdd() {
  const keyPrefix = 'workflow-flutter-add';

  const [ciName, setCiName] = useNotnullLocalStorageState<string>(
    `${keyPrefix}-name`,
    'Add library to new flutter project',
  );

  // current project
  const [isCurrentProject, setCurrentProject] =
    useNotnullLocalStorageState<boolean>(
      `${keyPrefix}-is-current-project`,
      true,
    );

  // split matrix
  const [splitMatrix, setSplitMatrix] = useNotnullLocalStorageState<boolean>(
    `${keyPrefix}-split-matrix`,
    true,
  );

  const [platforms, setPlatforms] = useNotnullLocalStorageState<string[]>(
    `${keyPrefix}-platform`,
    ['android', 'ios'],
  );

  const [triggered, setTriggered] = useNotnullLocalStorageState<string[]>(
    `${keyPrefix}-triggered`,
    ['push', 'pull_request'],
  );

  const [pkgList, setPkgList] = useNotnullLocalStorageState<Pkg[]>(
    `${keyPrefix}-pkg-list`,
    [],
  );

  // flutter version list
  const [flutterVersionList, setFlutterVersionList] =
    useNotnullLocalStorageState<string[]>(`${keyPrefix}-flutter-version-list`, [
      '3.10.0',
      '3.7.0',
      '3.0.5',
    ]);

  // const java version
  const [javaVersion, setJavaVersion] =
    useNotnullLocalStorageState<JavaVersion>(`${keyPrefix}-java-version`, {
      distribution: 'adopt',
      version: '11',
    });

  const [content, setContent] = useSafeState<string>('');

  function refreshGithubWorkflow() {
    let content = createGithubWorkflow(
      ciName,
      platforms,
      triggered,
      flutterVersionList,
      pkgList,
      javaVersion,
      splitMatrix,
    );

    content = content
      .split('\n')
      .filter((line) => line.trim() !== '')
      .join('\n');

    setContent(content);
  }

  useEffect(() => {
    refreshGithubWorkflow();
  }, [
    ciName,
    isCurrentProject,
    platforms,
    triggered,
    pkgList,
    flutterVersionList,
    splitMatrix,
  ]);

  return {
    isCurrentProject,
    setCurrentProject,
    ciName,
    setCiName,
    platforms,
    setPlatforms,
    triggered,
    setTriggered,
    FlutterPlatforms,
    FlutterTriggereds,
    flutterVersionList,
    setFlutterVersionList,
    splitMatrix,
    setSplitMatrix,
    pkgList,
    setPkgList,
    workflowContent: content,
    JavaVersions,
    JavaDistributions,
    javaVersion,
    setJavaVersion,
  };
}
