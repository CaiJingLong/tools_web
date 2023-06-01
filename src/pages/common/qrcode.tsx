import { useModel } from '@umijs/max';
import { Input, Slider, Space } from 'antd';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect } from 'react';

export default function QRCodePage() {
  const {
    qrcode,
    setQrcode,
    bgColor,
    fgColor,
    level,
    setBgColor,
    setFgColor,
    setLevel,
    setSize,
    size,
  } = useModel('qrcode');

  useEffect(() => {});

  return (
    <Space direction="vertical">
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
        dots
        tooltip={{ open: true }}
        value={size}
        onChange={(v) => {
          setSize(v as number);
        }}
      />

      <QRCodeSVG
        value={qrcode}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        onCopy={(e) => {
          // 复制图片到剪切板
          e.clipboardData.setData('text/plain', qrcode);
        }}
      />
    </Space>
  );
}
