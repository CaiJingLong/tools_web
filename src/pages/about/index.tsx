import { Descriptions, Space, Typography } from 'antd';

function LinkItem(props: { label: string; content: string; href: string }) {
  const { label, content, href } = props;
  return (
    <Descriptions.Item label={label}>
      <Typography.Link href={href} target="_blank">
        {content}
      </Typography.Link>
    </Descriptions.Item>
  );
}

export default function About() {
  return (
    <Space direction="vertical">
      <Typography.Title>About</Typography.Title>
      <Descriptions bordered>
        <Descriptions.Item label="Author">CaiJingLong</Descriptions.Item>
        <LinkItem label={'Github'} content={'1'} href={"https://github.com/CaiJingLong"} />
      </Descriptions>
    </Space>
  );
}
