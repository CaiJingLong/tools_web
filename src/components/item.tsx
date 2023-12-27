import { Space } from "antd";
import { style } from "./config/config-items";

export function ItemWrapper(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Space style={style} direction="vertical">
      <h3>{props.title}</h3>
      {props.children}
    </Space>
  );
}
