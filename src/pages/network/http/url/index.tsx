import { useNotnullLocalStorageState } from '@/utils/hooks/notnull_local_storage';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Descriptions, Input, Space } from 'antd';
import copy from 'copy-to-clipboard';
import { default as URLParse, default as Uri } from 'url-parse';

function InfoTable(props: {
  data: Map<string, string>;
  title: string;
  onChange?: (key: URLParse.URLPart, value: string) => void;
}) {
  const { data, title, onChange } = props;

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
                <Input
                  defaultValue={value}
                  value={value}
                  onChange={(v) => {
                    onChange?.(key as URLParse.URLPart, v.target.value);
                  }}
                />
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

function UrlTable(props: { url: string; onChange?: (url: string) => void }) {
  const { url, onChange } = props;

  // useEffect(() => {
  //   console.log('url changed: ' + url);
  // }, [url]);

  // convert to uri
  const uri = new Uri(url);
  // console.log('uri', uri);

  const uriParams = new Map<URLParse.URLPart, string>();

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
  uriParams.set('hash', uri.hash);

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
      <InfoTable
        data={uriParams}
        title={'url'}
        onChange={(key, value) => {
          uri.set(key, value);
          onChange?.(uri.toString());
        }}
      />
      <InfoTable
        data={queries}
        title={'query'}
        onChange={(key, value) => {
          queries.set(key, value);
          const obj: {
            [key: string]: string;
          } = {};
          for (const [key, value] of queries) {
            obj[key] = value;
          }
          uri.set('query', Uri.qs.stringify(obj));
          // message.info('new uri: ' + uri);
          onChange?.(uri.toString());
        }}
      />
    </div>
  );
}

export default function Url() {
  const [url, setUrl] = useNotnullLocalStorageState('url-input', '');

  // decode url

  return (
    <PageContainer title="url">
      <Space direction="vertical" size={'large'}>
        <h3>
          Use{' '}
          <a
            href="https://www.npmjs.com/package/url-parse"
            target="_blank"
            rel="noreferrer"
          >
            url-parse
          </a>{' '}
          to parse
        </h3>
        <Space direction="vertical" style={{ width: '85vw' }}>
          <Input.TextArea
            value={url}
            autoSize={{ minRows: 1, maxRows: 4 }}
            onChange={(v) => setUrl(v.target.value)}
          />
          <Button onClick={() => copy(url)}>Copy url</Button>
        </Space>
        <UrlTable url={url} onChange={setUrl} />
      </Space>
    </PageContainer>
  );
}
