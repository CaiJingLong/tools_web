import { Alert } from 'antd';

export default function Building() {
  return (
    <Alert
      message="The function is building."
      description="Please wait for a moment."
      type="warning"
      closable
    />
  );
}
