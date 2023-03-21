import { Typography } from 'antd';

export default function ToolTitle(props: { text: string }) {
  const { text } = props;

  return <Typography.Title level={3}>{text}</Typography.Title>;
}
