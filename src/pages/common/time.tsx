import ToolTitle from '@/components/title';
import { useInterval, useSafeState } from 'ahooks';
import {
  Checkbox,
  DatePicker,
  Descriptions,
  Input,
  Space,
  Typography,
} from 'antd';
import moment from 'moment';

const { Item } = Descriptions;

const labelStyle: React.CSSProperties | undefined = {
  width: '16%',
};
function FormattedDates(props: { time: Date }) {
  const dateFormatters = [
    'yyyy-MM-DD',
    'YYYY-MM-DD HH:mm:ss',
    'YYYY-MM-DD HH:mm:ss.SSS',
  ];
  const { time } = props;
  return (
    <Descriptions
      labelStyle={labelStyle}
      bordered
      column={1}
      title="Formatted date"
    >
      {dateFormatters.map((item) => {
        return (
          <Descriptions.Item label={item} key={`date-format-$(item)`}>
            {moment(time).format(item)}
          </Descriptions.Item>
        );
      })}
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
  const momentTime = inputTime && moment(inputTime);

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
        <Typography.Text>Unit time stamp</Typography.Text>
        <Input
          value={inputTime?.getTime()}
          placeholder="Unit time stamp (ms)"
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
          placeholder="Unit time stamp seconds"
          allowClear
          value={inputTime?.getTime()}
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
