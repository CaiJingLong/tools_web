import { PageContainer } from '@ant-design/pro-components';
import { useSafeState } from 'ahooks';
import { Input, Space, message } from 'antd';
import { Decimal } from 'decimal.js';
import { FC } from 'react';

const SizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

type Unit = (typeof SizeUnits)[number];

const SizeItem: FC<{
  bytes: Decimal;
  unit: Unit;
  onChange: (size: Decimal) => void;
}> = ({ bytes, unit, onChange }) => {
  const unitIndex = SizeUnits.indexOf(unit);

  const handleChange = (v?: Decimal) => {
    if (!v) {
      return;
    }

    // calculate bytes
    let bytes = new Decimal(v);
    for (let i = 0; i < unitIndex; i++) {
      bytes = bytes.mul(1024);
    }

    onChange(bytes);
  };

  const size = bytes.div(Decimal.pow(1024, unitIndex)).toNumber();

  // convert to readable
  const sizeNumber = Number(size);

  return (
    <Space>
      <div style={{ marginRight: 8, minWidth: '25px' }}>{unit}:</div>
      <Input.TextArea
        value={sizeNumber}
        onChange={(e) => {
          if (e.target.value === '') {
            handleChange();
            return;
          }
          try {
            const v = new Decimal(e.target.value);
            handleChange(v);
          } catch (error) {
            message.error('Convert number failed');
          }
        }}
        style={{
          width: '45vw',
        }}
      />
    </Space>
  );
};

const FileSize: FC = () => {
  const [v, setV] = useSafeState<Decimal>(new Decimal(0));

  return (
    <PageContainer title="FileSizeToReadable">
      <Space direction="vertical">
        {SizeUnits.map((unit) => {
          return <SizeItem key={unit} bytes={v} unit={unit} onChange={setV} />;
        })}
      </Space>
    </PageContainer>
  );
};

export default FileSize;
