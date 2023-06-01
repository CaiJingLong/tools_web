import { useLocalStorageState } from 'ahooks';

type QrCodeLevel = 'L' | 'M' | 'Q' | 'H';

const useQrcode = () => {
  const [qrcode, setQrcode] = useLocalStorageState<string>('qrcode-value', {
    defaultValue: '',
  });
  const [size, setSize] = useLocalStorageState<number>('qrcode-size', {
    defaultValue: 128,
  });

  const [fgColor, setFgColor] = useLocalStorageState<string>('qrcode-fgcolor', {
    defaultValue: '#000000',
  });

  const [bgColor, setBgColor] = useLocalStorageState<string>('qrcode-bgcolor', {
    defaultValue: '#ffffff',
  });

  const [level, setLevel] = useLocalStorageState<QrCodeLevel>('qrcode-level', {
    defaultValue: 'L',
  });

  return {
    qrcode,
    setQrcode,
    size,
    setSize,
    fgColor,
    setFgColor,
    bgColor,
    setBgColor,
    level,
    setLevel,
  };
};

export default useQrcode;
