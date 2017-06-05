export function FormatOutput(type: string, jobName: string, content: string | null): {summary: string, details: string[]} {

  // Returns a message type (i.e. 'changed') for
  // a URL and an optional (possibly multi-line) content.

  // The parameter "changeSummary" is a list variable
  // that gets one item appended for the summary of the changes.

  // The return value is a list of strings (one item per line).
  const summaryTxt = type.toUpperCase() + ': ' + jobName + '\n';
  const changeSummary = content ? (summaryTxt + ' (' + content.length + ' characters)') : summaryTxt;

  const result = [];
  result.push(summaryTxt);

  if (content) {
    result.push(content);
  }

  return {summary: changeSummary, details: result};
}
