export function stripLineBreaks(str: string) { return str.replace(/^[\n\r]*|[\n\r]*$/g, ""); }

export function stringToLineArray(str: string): string[] {
  const lfpos = str.indexOf("\n");
  const crpos = str.indexOf("\r");
  const linebreak = ((lfpos > -1 && crpos > -1) || crpos < 0) ? "\n" : "\r";

  const lines = str.split(linebreak);
  for (let i = 0; i < lines.length; i++) {
    lines[i] = stripLineBreaks(lines[i]);
  }

  return lines;
}
