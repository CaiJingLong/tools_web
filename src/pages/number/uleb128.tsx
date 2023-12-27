import { ItemWrapper } from '@/components/item';
import { PageContainer } from '@ant-design/pro-components';
import { useSafeState } from 'ahooks';
import {
  Checkbox,
  Descriptions,
  DescriptionsProps,
  Input,
  Radio,
  Space,
} from 'antd';

function encodeUleb128(v: string[], radix: number | undefined = 16): string {
  // 转十六进制为数字
  const nums = v.map((v) => parseInt(v, radix));

  let result = 0;

  // 从第一位开始，判断是否大于等于128
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];

    const v = n & 0b01111111;

    // console.log('n', n);
    // console.log('v', v);

    // 无论如何，都要将当前位的值加到结果中
    result += v << (i * 7);

    // 如果当前位小于128，说明已经是最后一位了，直接返回
    if (n < 128) {
      break;
    }
  }

  return result.toString();
}

function encodeSleb128(v: string[], radix: number | undefined = 16): string {
  const array = v.map((v) => parseInt(v, radix));

  let result = array[0];

  if (result <= 0x7f) {
    result = (result << 25) >> 25;
  } else {
    let cur = array[1];
    result = (result & 0x7f) | ((cur & 0x7f) << 7);
    if (cur <= 0x7f) {
      result = (result << 18) >> 18;
    } else {
      cur = array[2];
      result |= (cur & 0x7f) << 14;
      if (cur <= 0x7f) {
        result = (result << 11) >> 11;
      } else {
        cur = array[3];
        result |= (cur & 0x7f) << 21;
        if (cur <= 0x7f) {
          result = (result << 4) >> 4;
        } else {
          cur = array[4];
          result |= cur << 28;
        }
      }
    }
  }

  return result.toString();
}

function LebResult(props: { n: string }) {
  const { n } = props;

  const n2 = parseInt(n, 10).toString(2);

  // 每 7 位分割一次，并转为 little endian
  // 格式示例 bit7 bit6 bit5 bit4 bit3 bit2 bit1 | bit 14 bit13 bit12 bit11 bit10 bit9 bit8
  const array = [];
  for (let i = 0; i < n2.length; i += 7) {
    const v = n2.slice(i, i + 7);
    array.push(v);
  }

  const n3 = array.reverse().join(', ');

  const n4 = array.map((v) => parseInt(v, 2).toString(16).toUpperCase()).join(', ');

  const n5 = array.map((v) => parseInt(v, 2).toString(16).toUpperCase()).reverse().join(', ');

  const items: DescriptionsProps['items'] = [
    {
      label: 'value',
      span: 3,
      children: n,
    },
    {
      label: 'binary',
      span: 3,
      children: n2,
    },
    {
      label: 'binary group',
      span: 3,
      children: n3,
    },
    {
      label: 'hex little endian',
      span: 3,
      children: n4,
    },
    {
      label: 'hex big endian',
      span: 3,
      children: n5,
    },
  ];

  return (
    // <Result>
    //   <div>{n}</div>
    //   <div>{n2}</div>
    //   <div>{n3}</div>
    // </Result>
    <Descriptions title="Result" items={items} />
  );
}

function ByInput(props: { sign: boolean }) {
  const length = 4;
  const defaultValue = Array.from({ length }).map(() => '0');
  const [values, setValues] = useSafeState(defaultValue);

  const method = props.sign ? encodeSleb128 : encodeUleb128;

  const result = method(values);
  return (
    <Space direction="vertical">
      <Space>
        {values.map((v, i) => {
          return (
            // inputRegex={/^[0-9a-fA-F]{0,2}$/}
            <Input
              prefix={'0x'}
              defaultValue={v}
              key={'input-' + i}
              style={{ width: 99 }}
              maxLength={2}
              onChange={(e) => {
                const value = e.target.value;
                const newValues = [...values];
                newValues[i] = value;
                setValues(newValues);
              }}
              allowClear
            />
          );
        })}
      </Space>
      <LebResult n={result} />
    </Space>
  );
}

function ByPaste(props: { sign: boolean }) {
  const [text, setText] = useSafeState<string>('98 27 40 55');

  const method = props.sign ? encodeSleb128 : encodeUleb128;

  // 转为字符串数组
  let values = text.split(' ');

  // 继续转，每个字符串按2位分割
  let newValues = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v.length <= 2) {
      newValues.push(v);
    } else {
      for (let j = 0; j < v.length; j += 2) {
        newValues.push(v.slice(j, j + 2));
      }
    }
  }

  const result = method(newValues);

  return (
    <Space direction="vertical">
      <ItemWrapper title="hex">
        <pre>Such as: 98 27 40 55</pre>
        <Input.TextArea
          defaultValue={text}
          onChange={(v) => {
            setText(v.target.value);
          }}
        />
      </ItemWrapper>

      <LebResult n={result} />
    </Space>
  );
}

export default function Uleb128Page() {
  const options = ['input', 'paste'];
  const [checked, setChecked] = useSafeState<string>('input');
  const [signChecked, setSignChecked] = useSafeState<boolean>(false);

  return (
    <PageContainer title="Uleb128">
      <Space direction="vertical">
        <Radio.Group
          options={options}
          defaultValue={checked}
          onChange={(v) => {
            setChecked(v.target.value);
          }}
        >
          {options.map((option) => {
            return <Radio key={option} value={option} />;
          })}
        </Radio.Group>
        <Checkbox onChange={(e) => setSignChecked(e.target.checked)}>
          signed
        </Checkbox>

        {checked.includes('input') && <ByInput sign={signChecked} />}
        {checked.includes('paste') && <ByPaste sign={signChecked} />}
      </Space>
    </PageContainer>
  );
}
