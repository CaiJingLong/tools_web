import {
  CheckGroup,
  ConfigInputList,
  ConfigItemContainer,
  RadioGroup,
  configItemContainerStyle,
} from '@/components/config/config-items';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useSafeState } from 'ahooks';
import { Button, Checkbox, Input, Space, Table } from 'antd';
import { useEffect } from 'react';

function IosVersion() {
  const { minIOSVersion, setMinIOSVersion, platforms } = useModel(
    'workflow-flutter-add',
  );

  const haveIOS = platforms.includes('ios');

  if (!haveIOS) {
    return null;
  }

  return (
    <ConfigItemContainer title="iOS">
      <Input
        defaultValue={minIOSVersion}
        onChange={(e) => {
          setMinIOSVersion(e.target.value);
        }}
      />
    </ConfigItemContainer>
  );
}

function MacOSVersion() {
  const { minMacOSVersion, setMinMacOSVersion, platforms } = useModel(
    'workflow-flutter-add',
  );

  const haveMacOS = platforms.includes('macos');

  if (!haveMacOS) {
    return null;
  }

  return (
    <ConfigItemContainer title="macOS">
      <Input
        defaultValue={minMacOSVersion}
        onChange={(e) => {
          setMinMacOSVersion(e.target.value);
        }}
      />
    </ConfigItemContainer>
  );
}

function PkgList() {
  const { pkgList, setPkgList } = useModel('workflow-flutter-add');

  const [name, setName] = useSafeState('');
  const [path, setPath] = useSafeState('.');

  return (
    <ConfigItemContainer title={'Package list'}>
      <Space>
        Name:
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        Path:
        <Input
          value={path}
          onChange={(e) => {
            setPath(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            setPkgList([...pkgList, { name, path, checked: true }]);
          }}
        >
          Add
        </Button>
      </Space>
      <Table dataSource={pkgList} pagination={false}>
        <Table.Column
          title="Checked"
          dataIndex="checked"
          render={(v, _, index) => (
            <Checkbox
              defaultChecked={v}
              value={v}
              onChange={() => {
                const newPkgList = [...pkgList];
                newPkgList[index].checked = !newPkgList[index].checked;
                setPkgList(newPkgList);
              }}
            />
          )}
        />
        <Table.Column title="Name" dataIndex="name" />
        <Table.Column title="Version" dataIndex="path" />
        <Table.Column
          title="Action"
          render={(v) => (
            <Button
              onClick={() => {
                setPkgList(pkgList.filter((item) => item.name !== v.name));
              }}
            >
              Delete
            </Button>
          )}
        />
      </Table>
    </ConfigItemContainer>
  );
}

function JavaVersion() {
  const {
    platforms,
    javaVersion,
    setJavaVersion,
    JavaVersions,
    JavaDistributions,
  } = useModel('workflow-flutter-add');

  const [version, setVersion] = useSafeState(javaVersion.version);
  const [dist, setDist] = useSafeState(javaVersion.distribution);

  useEffect(() => {
    setJavaVersion({
      version: version,
      distribution: dist,
    });
  }, [version, dist]);

  const haveAndroid = platforms.includes('android');

  if (!haveAndroid) {
    return null;
  }

  return (
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
  );
}

export default function AddLibraryToNewProject() {
  const {
    // isCurrentProject,
    // setCurrentProject,
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
    workflowContent,
  } = useModel('workflow-flutter-add');

  return (
    <PageContainer title="Add library to new flutter project">
      <Space direction="vertical" style={{ width: '60vw' }}>
        <ConfigItemContainer title="CI name">
          <Input
            htmlSize={40}
            defaultValue={ciName}
            onChange={(e) => {
              setCiName(e.target.value);
            }}
          />
        </ConfigItemContainer>
        <CheckGroup
          title="Triggered"
          keyPrefix="triggered"
          values={FlutterTriggereds}
          checkedValues={triggered}
          onChange={setTriggered}
        />
        <CheckGroup
          title="Platforms"
          keyPrefix="platform"
          values={FlutterPlatforms}
          checkedValues={platforms}
          onChange={setPlatforms}
        />
        <JavaVersion />
        <IosVersion />
        <MacOSVersion />
        <ConfigInputList
          title={'Flutter SDK version'}
          values={flutterVersionList}
          onChange={setFlutterVersionList}
        />

        <PkgList />

        <ConfigItemContainer
          title="Workflow content"
          // children填充满
          style={{
            ...configItemContainerStyle,
            width: '60vw',
            alignItems: 'stretch',
          }}
        >
          <Button
            onClick={() => {
              navigator.clipboard.writeText(workflowContent);
            }}
          >
            Copy
          </Button>
          <Input.TextArea value={workflowContent} autoSize />
        </ConfigItemContainer>
      </Space>
    </PageContainer>
  );
}
