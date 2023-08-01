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
}

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
      return 'flutter build macos --release --no-codesign';
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
      return `flutter pub add '${pkg.name}:${json}'`;
    })
    .join('\n');
}

function makeJob(
  platform: string,
  flutterVersionMatrix: string,
  pkgList: Pkg[],
) {
  const runsOn = getRunsOn(platform);
  const buildCommand = getBuildCommand(platform);
  const newProjectName = 'new_project';
  const newProjectPath = `\${{ github.workspace }}/${newProjectName}`;
  return `  build-on-${platform}:
    name: flutter build on ${platform} with \${{ matrix.flutter-version }}
    runs-on: ${runsOn}
    strategy:
      matrix:
        ${flutterVersionMatrix}
    steps:
      - uses: actions/checkout@v2
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: \${{ matrix.flutter-version }}
      - run: flutter doctor -v
        name: Flutter info
      - run: flutter create new_project --platforms=${platform}
        name: Create new project
      - run: ${makeAddPkgs(pkgList)}
        working-directory: ${newProjectPath}
        name: Add package to new project
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
  pkgList: Pkg[],
): string {
  const flutterVersion = matrixFlutterVersion(flutterVersionList);

  const jobs = platforms
    .map((platform) => makeJob(platform, flutterVersion, pkgList))
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

  const [content, setContent] = useSafeState<string>('');

  function refreshGithubWorkflow() {
    const content = createGithubWorkflow(
      ciName,
      platforms,
      triggered,
      flutterVersionList,
      pkgList,
    );
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
    pkgList,
    setPkgList,
    workflowContent: content,
  };
}
