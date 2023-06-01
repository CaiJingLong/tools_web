import { useLocalStorageState } from 'ahooks';

function getDecode<T>(defaultValue: T): (value: string) => T {
  const type = typeof defaultValue;

  if (type === 'string') {
    return (value: string) => value as any as T;
  } else if (type === 'number') {
    return (value: string) => Number(value) as any as T;
  } else if (type === 'boolean') {
    return (value: string) => {
      const result = value === 'true';
      console.log(`value: ${value}, decode result: ${result}`);
      return result as any as T;
    };
  }

  return (value: string) => JSON.parse(value);
}
function getEncode<T>(defaultValue: T): (value: T) => string {
  const type = typeof defaultValue;

  if (type === 'string') {
    return (value: T) => value as any as string;
  } else if (type === 'number') {
    return (value: T) => String(value) as any as string;
  } else if (type === 'boolean') {
    return (value: T) => String(value) as any as string;
  }

  return (value: T) => JSON.stringify(value);
}

export function useNotnullLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useLocalStorageState<T>(key, {
    serializer: getEncode(defaultValue),
    deserializer: getDecode(defaultValue),
  });

  if (value === null || value === undefined) {
    return [defaultValue, setValue];
  }

  return [value!, setValue];
}
