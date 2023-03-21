import { useLocalStorageState } from 'ahooks';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';

type Props = {
  cachedKey: string;
} & AutoCompleteProps;

export default function HistoryInput(props: Props) {
  const { cachedKey, ...rest } = props;

  const [options, setOptions] = useLocalStorageState<DefaultOptionType[]>(
    cachedKey,
    {
      defaultValue: [],
    },
  );

  const onChange = (value: string) => {
    if (value) {
      setOptions([
        {
          label: value,
          value,
        },
        ...options,
      ]);
    }
  };

  return <AutoComplete {...rest} options={options} onChange={onChange} />;
}
