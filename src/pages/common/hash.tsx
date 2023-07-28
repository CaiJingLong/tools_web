import { CachedTextArea } from '@/components/cached/cached_input';
import ToolTitle from '@/components/title';
import {
  md5Encode,
  sha1Encode,
  sha256Encode,
  sha512Encode,
} from '@/utils/strings';
import { useSafeState } from 'ahooks';
import { Button, Descriptions, Space } from 'antd';
import copy from 'copy-to-clipboard';

const convertMap: {
  [key: string]: {
    encode: (str: string) => string;
  };
} = {
  md5: {
    encode: md5Encode,
  },
  sha1: {
    encode: sha1Encode,
  },
  sha256: {
    encode: sha256Encode,
  },
  sha512: {
    encode: sha512Encode,
  },
  sha3: {
    encode: sha512Encode,
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

  const { encode } = convertMap[type];

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
    </Descriptions>
  );
}

export default function Hash() {
  const keys = Object.keys(convertMap);

  const [text, setText] = useSafeState<string>('');

  const widgets = keys.map((key) => {
    const itemKey = `converter-${key}`;
    return <ConvertItem key={itemKey} type={key} text={text} />;
  });

  return (
    <Space direction="vertical">
      <ToolTitle text="decode/encode" />
      <CachedTextArea cachedKey={'common-hash-input'} onValueChanged={setText} />
      {widgets}
    </Space>
  );
}
