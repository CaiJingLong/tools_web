import { clickButtonToDownloadBlobText } from '@/utils/download';
import { CodeBlock, SupportedLanguages } from '@atlaskit/code';
import { Button, Space } from 'antd';
import copy from 'copy-to-clipboard';

interface Props {
  fileName: string;
  code: string;
  language: SupportedLanguages;
}

function Code(props: { code: string; language: SupportedLanguages }) {
  const { code, language } = props;
  if (!code) return <></>;
  return <CodeBlock text={code} language={language} />;
}

export default function CodeWidget(props: Props) {
  const { fileName, code, language } = props;

  if (!code.trim()) {
    return <></>;
  }

  return (
    <Space direction="vertical">
      <Code code={code} language={language} />
      <Space>
        <Button
          onClick={() => {
            copy(code);
          }}
        >
          Copy
        </Button>
        <Button onClick={() => clickButtonToDownloadBlobText(code, fileName)}>
          Download
        </Button>
      </Space>
    </Space>
  );
}
