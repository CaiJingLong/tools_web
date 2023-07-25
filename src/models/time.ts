import { useLocalStorageState } from 'ahooks';

export default function useTime() {
  const defaultDateFormatArray = [
    'YYYY-MM-DD',
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD HH:mm:ss.SSS',
  ];
  const [dateFormatArray, setDateFormatArray] = useLocalStorageState<string[]>(
    'time-date-format',
    {
      defaultValue: defaultDateFormatArray,
    },
  );

  function onChangeDateFormatArray(value: string[]) {
    setDateFormatArray(value);
  }

  return {
    dateFormatArray: dateFormatArray ?? defaultDateFormatArray,
    setDateFormatArray: onChangeDateFormatArray,
  };
}
