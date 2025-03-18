export function actualDifference(currentUrls: string[], newUrls: string[]): { actual: string[], difference: string[] } {
  const actual = newUrls.filter(url => currentUrls.includes(url));
  const difference = currentUrls.filter(url => !newUrls.includes(url));

  return { actual, difference };
}