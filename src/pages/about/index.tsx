import { GithubFilled, GithubOutlined } from '@ant-design/icons';
import { Descriptions, Space, Typography } from 'antd';
import React from 'react';

const iconStyle: React.CSSProperties = {
  fontSize: 32,
  color: 'black',
};

const github = <GithubOutlined style={iconStyle} />;
const githubFill = <GithubFilled style={iconStyle} />;

export default function About() {
  return (
    <Space direction="vertical">
      <Typography.Title>About</Typography.Title>
      <Descriptions bordered>
        <Descriptions.Item label="Author">
          <a href="https://github.com/CaiJingLong">{github}</a>
        </Descriptions.Item>
        <Descriptions.Item label="Github">
          <a href="https://github.com/CaiJingLong/tools_web.git">
            {githubFill}
          </a>
        </Descriptions.Item>
      </Descriptions>
    </Space>
  );
}
