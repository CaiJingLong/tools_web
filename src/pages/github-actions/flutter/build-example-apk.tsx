import {
  ConfigItemContainer,
  RadioGroup,
} from '@/components/config/config-items';
import { JavaVersion } from '@/models/workflow-flutter-add';
import { useNotnullLocalStorageState } from '@/utils/hooks/notnull_local_storage';
import { formatWorkflow } from '@/utils/strings';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useSafeState } from 'ahooks';
import { Input, Space } from 'antd';
import { useEffect } from 'react';
import WorkflowResult from '../result';

// const keyPrefix = 'workflow-flutter-build-example-apk';

function makeWorkflow(
  javaVersion: JavaVersion,
  examplePath: string,
  mode: string,
) {
  const workDir = '${{ github.workspace }}/' + examplePath;
  const setupJava = `
      - uses: actions/setup-java@v3
        with:
          distribution: '${javaVersion.distribution}'
          java-version: '${javaVersion.version}'
  `;

  const setupFlutter = `
      - uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
          cache: true
          cache-key: 'flutter-:os:-:channel:-:version:-:arch:-:hash:'
      - run: flutter doctor -v
        name: Flutter info
  `;

  const buildApk = `
      - run: flutter build apk --${mode}
        name: Build apk
        working-directory: ${workDir}
      `;

  const releaseVersion = '${{ github.event.release.tag_name }}';
  const uploadApkToRelease = `
      - name: Upload apk to release ${releaseVersion}
        run: |
          gh release upload ${releaseVersion} build/app/outputs/flutter-apk/*.apk
          echo "Show apk download url: "
          gh release view ${releaseVersion} --json assets --jq '.assets.[].url'
        working-directory: ${workDir}
  `;

  let result = `
name: Build example apk
on:
  release:
    types:
      - created

env:
  GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}

jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      ${setupJava}
      ${setupFlutter}
      ${buildApk}
      ${uploadApkToRelease}

permissions:
  contents: write
  `;

  return formatWorkflow(result);
}

const keyPrefix = 'workflow-build-example-apk';

export default function BuildExampleApk() {
  const { javaVersion, JavaDistributions, JavaVersions, setJavaVersion } =
    useModel('workflow-flutter-add');

  const [version, setVersion] = useSafeState(javaVersion.version);
  const [dist, setDist] = useSafeState(javaVersion.distribution);

  const [examplePath, setExamplePath] = useNotnullLocalStorageState(
    `${keyPrefix}-example-path`,
    'example',
  );

  const modes = ['debug', 'profile', 'release'];
  const [mode, setMode] = useNotnullLocalStorageState(
    `${keyPrefix}-mode`,
    modes[2],
  );

  useEffect(() => {
    setJavaVersion({
      version: version,
      distribution: dist,
    });
  }, [version, dist]);

  const workflow = makeWorkflow(javaVersion, examplePath, mode);

  return (
    <PageContainer title="Make github workflow for make apk in release">
      <Space direction='vertical'>
        <ConfigItemContainer title="Java">
          <RadioGroup
            title="Java Version"
            keyPrefix="java-version"
            values={JavaVersions}
            checkedValue={version}
            onChange={(v) => setVersion(v)}
          />
          <RadioGroup
            title="Java Distribution"
            keyPrefix="java-dist"
            values={JavaDistributions}
            checkedValue={dist}
            onChange={(v) => setDist(v)}
          />
        </ConfigItemContainer>

        <RadioGroup
          title={'Mode'}
          values={modes}
          onChange={function (v: string): void {
            setMode(v);
          }}
          checkedValue={mode}
          keyPrefix={`mode`}
        />

        <ConfigItemContainer title="Example Path">
          <Input
            defaultValue={examplePath}
            onChange={(e) => {
              setExamplePath(e.target.value);
            }}
          />
        </ConfigItemContainer>

        <WorkflowResult content={workflow} />
      </Space>
    </PageContainer>
  );
}
