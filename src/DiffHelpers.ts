// tslint:disable-next-line:no-var-requires
const difflib = require('difflib');

export function my_unified_diff(fromText: string[], toText: string[], n: number, lineterm: string): string {
  let diffStr = '';
  const s = new difflib.SequenceMatcher(null, fromText, toText);
  const groups = s.getGroupedOpcodes(n);
  console.log(groups.length + ' Changes');

  for (const group of groups) {
    for (const change of group) {
      const tag = change[0];
      const i1 = change[1];
      const i2 = change[2];
      const j1 = change[3];
      const j2 = change[4];

      if (tag === 'replace' || tag === 'delete') {
        const lines = fromText.slice(i1, i2);
        for (const line of lines) {
          diffStr += '-' + line + '\n';
        }
      }
      if (tag === 'replace' || tag === 'insert') {
        const lines = toText.slice(j1, j2);
        // tslint:disable-next-line:prefer-for-of
        for (const line of lines) {
          diffStr += '+' + line + '\n';
        }
      }
    }
  }
  // console.log(diffStr);
  return diffStr;
}
