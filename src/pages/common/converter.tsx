import { CachedTextArea } from '@/components/cached/cached_input';
import ToolTitle from '@/components/title';
import {
  base64Decode,
  base64Encode,
  urlDecode,
  urlEncode,
} from '@/utils/strings';
import { useSafeState } from 'ahooks';
import { Button, Descriptions, Space } from 'antd';
import copy from 'copy-to-clipboard';

const convertMap: {
  [key: string]: {
    decode: (str: string) => string;
    encode: (str: string) => string;
  };
} = {
  base64: {
    encode: base64Encode,
    decode: base64Decode,
  },
  url: {
    encode: urlEncode,
    decode: urlDecode,
  },
};

function DescContent(props: { text: string }) {
  const { text } = props;

  return (
    <Space>
      <pre
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: 0,
          padding: 0,
          minWidth: '50vw',
          overflow: 'auto',
        }}
      >
        {text}
      </pre>
      <Button
        onClick={() => {
          copy(text);
        }}
      >
        Copy
      </Button>
    </Space>
  );
}

function ConvertItem(props: { type: string; text: string }) {
  const { type, text } = props;

  const { encode, decode } = convertMap[type];

  const labelStyle: React.CSSProperties | undefined = {
    width: '100px',
  };
  return (
    <Descriptions
      title={type}
      column={1}
      size="small"
      bordered
      labelStyle={labelStyle}
    >
      <Descriptions.Item label="encode">
        <DescContent text={encode(text)} />
      </Descriptions.Item>
      <Descriptions.Item label="decode">
        <Space>
          <DescContent text={decode(text)} />
        </Space>
      </Descriptions.Item>
    </Descriptions>
  );
}

export default function Converter() {
  const keys = Object.keys(convertMap);

  const [text, setText] = useSafeState<string>('');

  const widgets = keys.map((key) => {
    const itemKey = `converter-${key}`;
    return <ConvertItem key={itemKey} type={key} text={text} />;
  });

  return (
    <Space direction="vertical">
      <ToolTitle text="decode/encode" />
      <CachedTextArea cachedKey={'convert-input'} onValueChanged={setText} />
      {widgets}
    </Space>
  );
}
