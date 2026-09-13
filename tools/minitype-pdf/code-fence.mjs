/** Tracks Markdown fences without mistaking inline backticks for a block. */
export function codeFence(line, current) {
  if (current) {
    const closing = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
    return closing && closing[1][0] === current[0] && closing[1].length >= current.length
      ? undefined : current;
  }
  const opening = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
  if (!opening || (opening[1][0] === "`" && opening[2].includes("`"))) return undefined;
  return opening[1];
}
