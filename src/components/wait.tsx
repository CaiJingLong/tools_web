import { Spin } from 'antd';
import styles from './wait.less';
interface Props {
  name: string;
}

export default function Wait(props: Props) {
  return (
    <div className={styles.wait}>
      {props.name} 还没完工
      <Spin></Spin>
    </div>
  );
}

export function Placeholder() {
  return <div className={styles.placeholder}></div>;
}
