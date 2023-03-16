import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';

export default function HomePage() {
  return (
    <PageContainer ghost>
      <div className={styles.container}>Some develop tools</div>
    </PageContainer>
  );
}
