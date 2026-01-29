export function isExternallyLinkable(segments: string[]) {
  const [group, first] = segments;

  // Explicitly blocked
  if (group === '(modals)') {
    return (
      first === 'join' // example: allow join links
    );
  }

  if (first === 'sysAdmin') return false;

  // League routes
  if (group === '(tabs)' && first === 'leagues') {
    // leagues/[hash] is linkable
    // deeper routes are state-gated
    return segments.length <= 3;
  }

  return true;
}
