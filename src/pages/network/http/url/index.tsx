import CachedForm, { CachedFormData } from '@/components/cached/cached_form';
import { PageContainer } from '@ant-design/pro-components';
import { useSafeState } from 'ahooks';
import Uri from 'url-parse';
import { Button, Descriptions, Space } from 'antd';
import copy from 'copy-to-clipboard';

function Table(props: { data: Map<string, string>; title: string }) {
  const { data, title } = props;

  // use antd Descriptions

  return (
    <Descriptions
      title={title}
      contentStyle={{ backgroundColor: 'white', padding: '5px' }}
    >
      {Array.from(data)
        .filter(([, v]) => v)
        .map(([key, value]) => {
          return (
            <Descriptions.Item key={`${title}-${key}`} label={key} span={5}>
              <Space direction="vertical">
                <span>{value}</span>
                <Space>
                  <Button onClick={() => copy(key)}>Copy key</Button>
                  <Button onClick={() => copy(value)}>Copy value</Button>
                  <Button onClick={() => copy(`${key}=${value}`)}>
                    Copy key=value
                  </Button>
                </Space>
              </Space>
            </Descriptions.Item>
          );
        })}
    </Descriptions>
  );
}

function UrlTable(props: { url: string }) {
  const { url } = props;

  // convert to uri
  const uri = new Uri(url);

  const uriParams = new Map<string, string>();

  uriParams.set('href', uri.href);
  uriParams.set('origin', uri.origin);
  uriParams.set('protocol', uri.protocol);
  uriParams.set('host', uri.host);
  uriParams.set('auth', uri.auth);
  uriParams.set('username', uri.username);
  uriParams.set('password', uri.password);
  uriParams.set('hostname', uri.hostname);
  uriParams.set('port', uri.port);
  uriParams.set('pathname', uri.pathname);

  const queries = new Map<string, string>();
  const rs = Uri.qs.parse(uri.query);

  for (const key in rs) {
    if (Object.hasOwn(rs, key)) {
      const value = rs[key];
      if (value) queries.set(key, value);
    }
  }

  return (
    <div>
      <Table data={uriParams} title={'url'} />
      <Table data={queries} title={'query'} />
    </div>
  );
}

export default function Url() {
  const [data, setData] = useSafeState<CachedFormData>();

  let url: string;

  if (typeof data?.url === 'string') {
    url = data.url as string;
  } else {
    url = '';
  }

  // decode url

  return (
    <PageContainer title="url">
      <Space direction="vertical" size={'large'}>
        <h3>
          Use <a href="https://www.npmjs.com/package/url-parse">url-parse</a> to
          parse
        </h3>
        <CachedForm
          onDataChanged={setData}
          items={[
            {
              title: 'Input url',
              type: 'textArea',
              cachedKey: 'url',
            },
          ]}
        />
        <UrlTable url={url} />
      </Space>
    </PageContainer>
  );
}
