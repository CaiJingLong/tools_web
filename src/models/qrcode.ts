import { useNotnullLocalStorageState } from '@/utils/hooks/notnull_local_storage';

const useQrcode = () => {
  const [qrcode, setQrcode] = useNotnullLocalStorageState<string>(
    'qrcode-value',
    '',
  );
  const [size, setSize] = useNotnullLocalStorageState<number>(
    'qrcode-size',
    128,
  );

  const [fgColor, setFgColor] = useNotnullLocalStorageState<string>(
    'qrcode-fgcolor',
    '#000000',
  );

  const [bgColor, setBgColor] = useNotnullLocalStorageState<string>(
    'qrcode-bgcolor',
    '#ffffff',
  );

  const [level, setLevel] = useNotnullLocalStorageState<string>(
    'qrcode-level',
    'L',
  );

  const [includeMargin, setIncludeMargin] = useNotnullLocalStorageState<boolean>(
    'qrcode-include-margin',
    true,
  );

  console.log(`includeMargin: ${includeMargin}`)

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
    includeMargin,
    setIncludeMargin,
  };
};

export default useQrcode;
