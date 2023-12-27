import {
  ConfigItemContainer,
  configItemContainerStyle,
} from '@/components/config/config-items';
import { Button, Input } from 'antd';

export default function WorkflowResult(props: { content: string }) {
  const { content } = props;
  return (
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
          navigator.clipboard.writeText(content);
        }}
      >
        Copy
      </Button>
      <Input.TextArea value={content} autoSize />
    </ConfigItemContainer>
  );
}
