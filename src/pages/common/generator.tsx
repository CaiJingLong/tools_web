import ToolTitle from '@/components/title';
import {
  exportRSAPrivateKey,
  exportRSAPublicKey,
  generateRSAKeyPair,
} from '@/utils/secret';
import { useSafeState } from 'ahooks';
import { Button, InputNumber, Space, Input } from 'antd';
import copy from 'copy-to-clipboard';
import { useEffect } from 'react';
import styles from './index.less';

const { TextArea } = Input;

function OutputTextArea(props: { title: string; value: string }) {
  const { value, title } = props;
  return (
    <Space direction="vertical">
      <Space>
        {title}{' '}
        <Button
          onClick={() => {
            copy(value);
          }}
        >
          Copy
        </Button>
      </Space>
      <TextArea
        value={value}
        title={title}
        style={{
          width: '65vw',
          height: '96px',
        }}
      />
    </Space>
  );
}

function Random() {
  const [random, setRandom] = useSafeState('');

  useEffect(() => {
    setRandom(Math.random().toString(36).slice(2));
  }, []);

  return (
    <Space direction="vertical" title="Random" className={styles.box}>
      <Space>
        Random: {random}
        <Button
          onClick={() => {
            setRandom(Math.random().toString(36).slice(2));
          }}
        >
          Refresh
        </Button>
      </Space>
      <OutputTextArea title="Random" value={random} />
    </Space>
  );
}

function Rsa() {
  const [bits, setBits] = useSafeState(1024);
  const quickBits = [256, 512, 1024, 2048, 4096];

  const [publicKey, setPublic] = useSafeState('');
  const [privateKey, setPrivate] = useSafeState('');

  async function make() {
    const { publicKey, privateKey } = await generateRSAKeyPair(bits);
    const publibKeyString = await exportRSAPublicKey(publicKey);
    const privateKeyString = await exportRSAPrivateKey(privateKey);

    setPublic(publibKeyString);
    setPrivate(privateKeyString);
  }

  useEffect(() => {
    make();
  }, [bits]);

  return (
    <Space direction="vertical" title="RSA" className={styles.box}>
      <Space>
        Bits:
        <InputNumber
          value={bits}
          onChange={(e) => {
            if (e) setBits(e);
          }}
        />
        {quickBits.map((bit) => (
          <Button
            key={`bits-bt-${bit}`}
            onClick={() => {
              setBits(bit);
            }}
          >
            {bit}
          </Button>
        ))}
      </Space>
      <Button onClick={make}>Make</Button>
      <OutputTextArea value={publicKey} title="Public Key" />
      <OutputTextArea value={privateKey} title="Private Key" />
    </Space>
  );
}

export default function Generator() {
  return (
    <Space direction="vertical" size={30}>
      <ToolTitle text={'generator'} />
      <Rsa />
      <Random />
    </Space>
  );
}
