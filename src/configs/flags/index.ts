// lib names

interface Flag {
  name: 'libde265' | '';
  flags: string[];
}

export const flags: Flag[] = [
  {
    name: 'libde265',
    flags: [
      '--disable-dec265',
      '--disable-sherlock265',
      '--enable-log-error',
      '--enable-log-info',
      '--enable-log-trace',
    ],
  },
];
