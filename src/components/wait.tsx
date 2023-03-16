import { Space, Spin } from 'antd';
import styles from './wait.less';
interface Props {
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Wait(_props: Props) {
  return (
    <Space className={styles.wait} direction="vertical">
      Coming soon...
      <Spin size="large" />
    </Space>
  );
}

export function Placeholder() {
  return <div className={styles.placeholder}></div>;
}
