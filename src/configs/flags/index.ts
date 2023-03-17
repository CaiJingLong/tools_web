// lib names

interface Flag {
  name: string;
  description: string;
  suggestion: boolean;
}

function createFlag(
  name: string,
  description: string,
  suggestion: boolean = false,
): Flag {
  return {
    name,
    description,
    suggestion,
  };
}

interface Lib {
  name: string;
  types: {
    type: string;
    flags: Flag[];
  }[];
}

const libde265: Lib = {
  name: 'libde265',
  types: [
    {
      type: 'examples',
      flags: [
        createFlag(
          '--disable-enc265',
          'Do not build the enc265 encoder program.',
          true,
        ),
        createFlag(
          '--disable-enc265',
          'Do not build the enc265 encoder program.',
          true,
        ),
      ],
    },
    {
      type: 'logs',
      flags: [
        createFlag(
          '--enable-log-debug',
          'turn on logging at debug level (default=no)',
        ),
        createFlag(
          '--enable-log-verbose',
          'turn on logging at verbose level (default=no)',
        ),
        createFlag(
          '--enable-log-all',
          'turn on logging at all levels (default=no)',
        ),
      ],
    },
  ],
};

export const flags = [libde265];
