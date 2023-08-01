import {
  CheckGroup,
  ConfigInputList,
  ConfigItemContainer,
} from '@/components/config/config-items';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useSafeState } from 'ahooks';
import { Button, Input, Space, Table } from 'antd';

function PkgList() {
  const { pkgList, setPkgList } = useModel('workflow-flutter-add');

  const [name, setName] = useSafeState('');
  const [path, setPath] = useSafeState('.');

  return (
    <ConfigItemContainer title={'Pkg List'}>
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
            setPkgList([...pkgList, { name, path }]);
          }}
        >
          Add
        </Button>
      </Space>
      <Table dataSource={pkgList}>
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
            value={ciName}
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
        <ConfigInputList
          title={'Flutter SDK version'}
          values={flutterVersionList}
          onChange={setFlutterVersionList}
        />
        <PkgList />

        <Input.TextArea value={workflowContent} autoSize />
      </Space>
    </PageContainer>
  );
}
