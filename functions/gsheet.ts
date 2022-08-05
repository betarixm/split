export const getIdfromUrl = (url: string) =>
  url.includes("docs.google.com")
    ? ((url.match(/.+\/d\/([^/]+)/) as string[]) ?? [""]).at(-1)
    : url;
