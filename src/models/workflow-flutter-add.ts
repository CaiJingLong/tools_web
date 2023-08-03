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

function makeAddPkgSteps(
  pkgList: Pkg[],
  newProjectPath: string,
  platform: string,
  flutterVersion: string,
) {
  const isWin = platform === 'windows';
  console.log('is win: ' + isWin);

  const versionList = flutterVersion.split('.');
  const majorVersion = parseInt(versionList[0]);
  const minorVersion = parseInt(versionList[1]);

  const isNewPubAdd =
    (majorVersion === 3 && minorVersion >= 7) || majorVersion > 3;
  return pkgList
    .map((pkg) => {
      let path: string;
      if (pkg.path === '.') {
        path = '..';
      } else {
        path = '../' + pkg.path;
      }

      // if (isWin) {
      //   path = path.replaceAll('/', '\\');
      // }

      let addCmd: string;
      if (isNewPubAdd) {
        const json = JSON.stringify({ path });
        addCmd = `flutter pub add -- '${pkg.name}:${json}'`;
      } else {
        addCmd = `flutter pub add ${pkg.name} --path ${path}`;
      }

      return `
      - name: Add ${pkg.name} to new project.
        run: ${addCmd}
        working-directory: ${newProjectPath}
        shell: bash
      `;
    })
    .join('\n');
}

function makePlatformMinVersionStep(
  platform: string,
  minIOSVersion: string,
  minMacOSVersion: string,
  newProjectPath: string,
): string {
  if (platform === 'macos') {
    // sed -i '' 's/platform :osx, .*/platform :osx, '\''11.0'\''/g' macos/Podfile
    const sedCmd1 = `[ -f "macos/Podfile" ] && sed -i '' 's/platform :osx, .*/platform :osx, '\\''${minMacOSVersion}'\\''/g' macos/Podfile`;

    // sed -i '' 's/MACOSX_DEPLOYMENT_TARGET = .*;/MACOSX_DEPLOYMENT_TARGET = 11.0;/g' macos/Runner.xcodeproj/project.pbxproj
    const sedCmd2 = `[ -f "macos/Runner.xcodeproj/project.pbxproj" ] && sed -i '' 's/MACOSX_DEPLOYMENT_TARGET = .*;/MACOSX_DEPLOYMENT_TARGET = ${minMacOSVersion};/g' macos/Runner.xcodeproj/project.pbxproj`;

    return `
      - name: Set minimum macOS version
        run: |
              ${sedCmd1}
              ${sedCmd2}
        working-directory: ${newProjectPath}

    `;
  }
  if (platform === 'ios') {
    // sed -i '' 's/platform :ios, .*/platform :ios, '\''11.0'\''/g' ios/Podfile
    const sedCmd1 = `[ -f "ios/Podfile" ] && sed -i '' 's/platform :ios, .*/platform :ios, '\\''${minIOSVersion}'\\''/g' ios/Podfile`;;  

    // sed -i '' 's/IPHONEOS_DEPLOYMENT_TARGET = .*;/IPHONEOS_DEPLOYMENT_TARGET = 11.0;/g' ios/Runner.xcodeproj/project.pbxproj
    const sedCmd2 = `[ -f "ios/Runner.xcodeproj/project.pbxproj" ] && sed -i '' 's/IPHONEOS_DEPLOYMENT_TARGET = .*;/IPHONEOS_DEPLOYMENT_TARGET = ${minIOSVersion};/g' ios/Runner.xcodeproj/project.pbxproj`;

    return `
      - name: Set minimum iOS version
        run: |
              ${sedCmd1}
              ${sedCmd2}
        working-directory: ${newProjectPath}
    `;
  }

  return ``;
}

function makeRequiredStep(platform: string, javaVersion: JavaVersion) {
  let result = '';
  if (platform === 'android') {
    result += `
      - uses: actions/setup-java@v3
        with:
          distribution: '${javaVersion.distribution}'
          java-version: '${javaVersion.version}'`;
  }

  if (platform === 'linux') {
    result += `
      - name: Install required packages
        run: |
              sudo apt-get update -y
              sudo apt-get install -y ninja-build libgtk-3-dev
    `;

    // Enable support for linux
    result += `
      - name: Enable support for linux
        run: flutter config --enable-linux-desktop
    `;
  }

  return result;
}

function makeJobWithFlutterVersion(
  platform: string,
  flutterVersion: string,
  pkgList: Pkg[],
  javaVersion: JavaVersion,
  minIOSVersion: string,
  minMacOSVersion: string,
) {
  const jobName = `build-for-${platform}-${flutterVersion}`.replace(/\./g, '-');
  const runsOn = getRunsOn(platform);

  const runName = `Build for ${platform} with ${flutterVersion} on ${runsOn}`;

  const buildCommand = getBuildCommand(platform);
  const newProjectName = 'new_project';
  const newProjectPath = `\${{ github.workspace }}/${newProjectName}`;

  const requiredStep = makeRequiredStep(platform, javaVersion);

  return `  ${jobName}:
    name: ${runName}
    runs-on: ${runsOn}
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: ${flutterVersion}
          cache: true
          cache-key: 'flutter-:os:-:channel:-:version:-:arch:-:hash:'
      ${requiredStep}
      - run: flutter doctor -v
        name: Flutter info
      - run: flutter create new_project --platforms=${platform}
        name: Create new project
${makeAddPkgSteps(pkgList, newProjectPath, platform, flutterVersion)}
      - run: flutter pub get
        working-directory: ${newProjectPath}
${makePlatformMinVersionStep(platform, minIOSVersion, minMacOSVersion,newProjectPath)}
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
  minIOSVersion: string,
  minMacOSVersion: string,
) {
  let result = ``;
  for (const flutterVersion of flutterVersionList) {
    result += makeJobWithFlutterVersion(
      platform,
      flutterVersion,
      pkgList,
      javaVersion,
      minIOSVersion,
      minMacOSVersion,
    );
  }
  return result;
}

function createGithubWorkflow(
  ciName: string,
  platforms: string[],
  triggered: string[],
  flutterVersionList: string[],
  srcPkgList: Pkg[],
  javaVersion: JavaVersion,
  minIOSVersion: string,
  minMacOSVersion: string,
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
      makeJob(
        platform,
        flutterVersionList,
        pkgList,
        javaVersion,
        minIOSVersion,
        minMacOSVersion,
      ),
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

  // const min macOS version
  const [minMacOSVersion, setMinMacOSVersion] =
    useNotnullLocalStorageState<string>(
      `${keyPrefix}-min-macos-version`,
      '10.15',
    );

  // const min iOS version
  const [minIOSVersion, setMinIOSVersion] = useNotnullLocalStorageState<string>(
    `${keyPrefix}-min-ios-version`,
    '11.0',
  );

  const [content, setContent] = useSafeState<string>('');

  function refreshGithubWorkflow() {
    let content = createGithubWorkflow(
      ciName,
      platforms,
      triggered,
      flutterVersionList,
      pkgList,
      javaVersion,
      minIOSVersion,
      minMacOSVersion,
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
    platforms,
    triggered,
    flutterVersionList,
    pkgList,
    javaVersion,
    minIOSVersion,
    minMacOSVersion,
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
    JavaVersions,
    JavaDistributions,
    javaVersion,
    setJavaVersion,
    minMacOSVersion,
    setMinMacOSVersion,
    minIOSVersion,
    setMinIOSVersion,
  };
}
