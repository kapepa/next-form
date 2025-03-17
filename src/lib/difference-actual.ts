export function actualDifference(currentUrls: string[], newUrls: string[]): { actual: string[], difference: string[] } {
  const difference: string[] = [];
  const actual: string[] = [];

  for (let url of currentUrls) newUrls.includes(url) ? actual.push(url) : difference.push(url);

  return { actual, difference };
}