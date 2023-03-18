import { Space } from 'antd';

interface Props {
  children?: React.ReactNode[] | React.ReactNode;
}

export default function ColSpace(props: Props) {
  return <Space direction="vertical">{props.children}</Space>;
}
