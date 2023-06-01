import { CachedRadioGroup } from '@/components/cached/cached_radio_picker';
import { useModel } from '@umijs/max';
import { Checkbox, ColorPicker, Input, Slider, Space } from 'antd';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodePage() {
  const {
    qrcode,
    setQrcode,
    level,
    setBgColor,
    setFgColor,
    setLevel,
    setSize,
    size,
    includeMargin,
    setIncludeMargin,
  } = useModel('qrcode');

  let { bgColor, fgColor } = useModel('qrcode');

  console.log(
    `qrcode: ${qrcode}, level: ${level}, bgColor: ${bgColor}, fgColor: ${fgColor}, size: ${size}`,
  );

  return (
    <Space direction="vertical" style={{ width: 600 }}>
      <Input
        value={qrcode}
        onChange={(v) => {
          setQrcode(v.target.value);
        }}
      />

      {/* size是一个滑块 */}
      <Slider
        min={100}
        max={500}
        value={size}
        onChange={(v) => {
          setSize(v as number);
        }}
      />

      <Space>
        {'FgColor: '}
        <ColorPicker
          value={fgColor}
          format="hex"
          defaultValue={fgColor}
          onChange={(v) => {
            setFgColor(v.toHexString());
          }}
        />
      </Space>

      <Space>
        {'BgColor: '}
        <ColorPicker
          value={bgColor}
          format="hex"
          defaultValue={bgColor}
          onChange={(v) => {
            setBgColor(v.toHexString());
          }}
        />
      </Space>

      <CachedRadioGroup
        title={'QrcodeLevel'}
        allOptions={['L', 'M', 'Q', 'H']}
        defaultValue={'M'}
        value={level}
        onOptionChanged={(v) => {
          setLevel(v);
        }}
        cachedKey={'qrcode-level'}
      />

      <Checkbox
        checked={includeMargin}
        onChange={() => {
          setIncludeMargin(!includeMargin);
        }}
      >
        includeMargin
      </Checkbox>

      <QRCodeSVG
        value={qrcode}
        includeMargin={includeMargin}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        onCopy={(e) => {
          // 复制图片到剪切板
          e.clipboardData.setData('text/plain', qrcode!);
        }}
      />
    </Space>
  );
}
