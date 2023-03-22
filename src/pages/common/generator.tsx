import CachedForm, {
  CachedFormData,
  CacheFormItemProps,
} from '@/components/cached/cached_form';
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
  const [configData, setConfigData] = useSafeState<CachedFormData | null>(null);

  async function onChange(data: CachedFormData) {
    const length = data['gen-random_length'] as number;
    const type = data['gen-random_type'] as string[];
    const other = data['gen-random_other'] as string;

    const number = '0123456789';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let all = '';

    if (type.includes('Number')) {
      all += number;
    }
    if (type.includes('Lowercase')) {
      all += lower;
    }
    if (type.includes('Uppercase')) {
      all += upper;
    }

    if (other) all += other;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += all[Math.floor(Math.random() * all.length)];
    }

    setRandom(result);
  }

  useEffect(() => {
    if (configData) onChange(configData);
  }, [configData]);

  const props: CacheFormItemProps[] = [
    {
      title: 'Length',
      type: 'inputNumber',
      defaultValue: 16,
      max: 1024,
      min: 1,
      cachedKey: 'gen-random_length',
    },
    {
      title: 'Type',
      type: 'checkboxGroup',
      cachedKey: 'gen-random_type',
      options: ['Number', 'Lowercase', 'Uppercase'],
    },
    {
      title: 'Other characters',
      type: 'input',
      cachedKey: 'gen-random_other',
    },
  ];

  return (
    <Space direction="vertical" title="Random" className={styles.box}>
      <CachedForm items={props} onDataChanged={setConfigData} />
      <Button
        onClick={() => {
          if (configData) onChange(configData);
        }}
      >
        Generate
      </Button>
      <OutputTextArea title="Random result" value={random} />
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
