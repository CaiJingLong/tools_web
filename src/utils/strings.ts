export function join(...args: string[]): string {
  return args.join('/');
}

export function inlineText(text: string): string {
  let result = text.replaceAll('\n', ' ');
  while (result.includes('  ')) {
    result = result.replaceAll('  ', ' ');
  }
  return result;
}

export function formatConfigurations(text: string): string {
  let result = inlineText(text);

  return result.replaceAll(' -', ' \\\n    -');
}
