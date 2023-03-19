import { CachedTextArea } from '@/components/cached/cached_input';
import {
  base64Decode,
  base64Encode,
  md5Encode,
  sha1Encode,
  sha256Encode,
  sha512Encode,
  urlDecode,
  urlEncode,
} from '@/utils/strings';
import { useSafeState } from 'ahooks';
import { Button, Descriptions, Space, Typography } from 'antd';
import copy from 'copy-to-clipboard';

const convertMap: {
  [key: string]: {
    decode?: (str: string) => string;
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
      {text}
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

  return (
    <Descriptions title={type} column={1} size="small" bordered>
      <Descriptions.Item label="encode">
        <DescContent text={encode(text)} />
      </Descriptions.Item>
      {decode && (
        <Descriptions.Item label="decode">
          <Space>
            <DescContent text={decode(text)} />
          </Space>
        </Descriptions.Item>
      )}
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
      <Typography.Title level={3}>Converter</Typography.Title>
      <CachedTextArea cachedKey={'convert-input'} onValueChanged={setText} />
      {widgets}
    </Space>
  );
}
