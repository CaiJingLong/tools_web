import { ItemWrapper } from '@/components/item';
import { PageContainer } from '@ant-design/pro-components';
import { useSafeState } from 'ahooks';
import { Input, Radio, Result, Space } from 'antd';

function encodeUleb128(v: string[]): string {
  // 转十六进制为数字
  const nums = v.map((v) => parseInt(v, 16));

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

function ByInput() {
  const length = 4;
  const defaultValue = Array.from({ length }).map(() => '0');
  const [values, setValues] = useSafeState(defaultValue);

  const result = encodeUleb128(values);
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
      <Result title="Result">{result}</Result>
    </Space>
  );
}

function ByPaste() {
  const [text, setText] = useSafeState<string>('98 27 40 55');

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

  const result = encodeUleb128(newValues);

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

      <Result title="Result">{result}</Result>
    </Space>
  );
}

export default function Uleb128Page() {
  const options = ['input', 'paste'];
  const [checked, setChecked] = useSafeState<string>('input');

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

        {checked.includes('input') && <ByInput />}
        {checked.includes('paste') && <ByPaste />}
      </Space>
    </PageContainer>
  );
}
