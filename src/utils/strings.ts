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
