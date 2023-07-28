import ToolTitle from '@/components/title';
import { DeleteFilled } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { useInterval, useSafeState } from 'ahooks';
import {
  Button,
  Checkbox,
  DatePicker,
  Descriptions,
  Input,
  Modal,
  Space,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';

const { Item } = Descriptions;

const labelStyle: React.CSSProperties | undefined = {
  width: '16%',
};

function AddFormatDateWithDialog() {
  const { dateFormatArray, setDateFormatArray } = useModel('time');
  const [dialogVisible, setDialogVisible] = useSafeState(false);
  const [newFormat, setNewFormat] = useSafeState('');

  return (
    <Space>
      <Button onClick={() => setDialogVisible(true)}>Add</Button>
      <Modal
        closeIcon={null}
        open={dialogVisible}
        onCancel={() => setDialogVisible(false)}
        onOk={() => {
          setDialogVisible(false);
          setDateFormatArray([...dateFormatArray, newFormat]);
        }}
      >
        <Input
          placeholder="Format string"
          value={newFormat}
          autoFocus
          onChange={(e) => setNewFormat(e.target.value)}
        />
      </Modal>
    </Space>
  );
}

function FormattedDates(props: { time: Date }) {
  const { dateFormatArray, setDateFormatArray } = useModel('time');

  const dateFormatters = dateFormatArray;
  const { time } = props;
  return (
    <Descriptions
      labelStyle={labelStyle}
      bordered
      column={1}
      title="Formatted date"
    >
      {dateFormatters.map((item) => (
        <Descriptions.Item
          label={
            <>
              {item}{' '}
              <Button
                shape="circle"
                type="text"
                icon={<DeleteFilled />}
                onClick={() => {
                  const newDateFormatArray = dateFormatters.filter(
                    (i) => i !== item,
                  );
                  setDateFormatArray(newDateFormatArray);
                }}
              />
            </>
          }
          key={`date-format-$(item)`}
        >
          {moment(time).format(item)}
        </Descriptions.Item>


      ))}
      <Descriptions.Item label={<AddFormatDateWithDialog />}>
        Add new format date string
      </Descriptions.Item>
    </Descriptions>
  );
}

function DiffNow(props: { time: Date }) {
  const now = moment();
  const target = moment(props.time);
  const days = now.diff(target, 'days');
  const hours = now.diff(target, 'hours') % 24;
  const minutes = now.diff(target, 'minutes') % 60;
  const seconds = now.diff(target, 'seconds') % 60;

  return (
    <Descriptions
      title="Time Since Target"
      labelStyle={labelStyle}
      bordered
      column={1}
    >
      <Descriptions.Item label="Days">{days}</Descriptions.Item>
      <Descriptions.Item label="Hours">{hours}</Descriptions.Item>
      <Descriptions.Item label="Minutes">{minutes}</Descriptions.Item>
      <Descriptions.Item label="Seconds">{seconds}</Descriptions.Item>
    </Descriptions>
  );
}

export default function Time() {
  const [autoTime, setAutoTime] = useSafeState(new Date());
  const [inputTime, setInputTime] = useSafeState<Date | null | undefined>(
    autoTime,
  );

  const [pickOpen, setPickOpen] = useSafeState(false);

  const time = inputTime || autoTime;
  const momentTime = inputTime && dayjs(inputTime.getTime());

  const [playing, setPlaying] = useSafeState(true);

  useInterval(() => {
    if (playing && !pickOpen) {
      setAutoTime(new Date());
    }
  }, 1000);

  return (
    <Space direction="vertical">
      <ToolTitle text="time" />

      <Space>
        <Typography.Text>Unix time stamp</Typography.Text>
        <Input
          title="Unix time stamp (ms)"
          value={inputTime?.getTime()}
          placeholder="Unix time stamp (ms)"
          allowClear
          onChange={(e) => {
            const value = e.target.value;
            if (!value.trim()) {
              setInputTime(null);
            } else {
              const time = new Date(Number(value));
              setInputTime(time);
            }
          }}
        />
        <Input
          placeholder="Unix time stamp seconds"
          allowClear
          title="Unix time stamp (second)"
          value={(inputTime?.getTime() ?? 0) / 1000}
          onChange={(e) => {
            const value = e.target.value;
            if (!value.trim()) {
              setInputTime(null);
            } else {
              const time = new Date(Number(value) * 1000);
              setInputTime(time);
            }
          }}
        />
      </Space>

      <Space>
        <Typography.Text>Pick date time</Typography.Text>
        <DatePicker
          showTime
          value={momentTime}
          onOpenChange={(open) => {
            setPickOpen(open);
          }}
          onChange={(date) => {
            setInputTime(date?.toDate());
          }}
        />
      </Space>

      <Checkbox
        checked={!playing}
        onChange={(e) => {
          setPlaying(!e.target.checked);
        }}
      >
        Pause auto update
        {playing && !pickOpen && (
          <Typography.Text
            type="secondary"
            style={{
              marginLeft: '8px',
            }}
          >
            {autoTime.toLocaleString()}
          </Typography.Text>
        )}
      </Checkbox>

      <Descriptions
        title="Time string"
        bordered
        column={1}
        labelStyle={labelStyle}
      >
        <Item label="UTC">{time.toUTCString()}</Item>
        <Item label="ISO">{time.toISOString()}</Item>
        <Item label="Date">{time.toDateString()}</Item>
        <Item label="Time">{time.toTimeString()}</Item>
        <Item label="Timezone Minutes Offset">
          {time.getTimezoneOffset()} mins
        </Item>
      </Descriptions>
      <Descriptions
        title="Unix time"
        bordered
        column={1}
        labelStyle={labelStyle}
      >
        <Item label="Seconds">{(time.getTime() / 1000).toFixed(0)}</Item>
        <Item label="Milliseconds">{time.getTime()}</Item>
      </Descriptions>
      <Descriptions
        title="Local time"
        bordered
        column={1}
        labelStyle={labelStyle}
      >
        <Item label="Date">{time.toLocaleDateString()}</Item>
        <Item label="Time">{time.toLocaleTimeString()}</Item>
      </Descriptions>

      <FormattedDates time={time} />

      <DiffNow time={time} />
    </Space>
  );
}
