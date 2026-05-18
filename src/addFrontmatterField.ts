export const addFrontmatterField = (
  content: string,
  key: string,
  value: string | boolean,
): string => {
  if (!content.startsWith("---")) return content;

  const endIndex = content.indexOf("\n---", 3);
  if (endIndex === -1) return content;

  const frontmatter = content.slice(3, endIndex);
  if (frontmatter.includes(`${key}:`)) return content;

  const before = content.slice(0, endIndex);
  const after = content.slice(endIndex);

  return `${before}\n${key}: ${value}${after}`;
};
