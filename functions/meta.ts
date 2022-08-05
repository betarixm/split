import { META_COLUMNS, META_TYPE } from "@/enums";

export const getTitlefromMetaContent = (content: string[][]): string => {
  return (content
    .filter((m) => m[META_COLUMNS.TYPE] === META_TYPE.TITLE)
    .at(0) ?? ["", "", "Series"])[META_COLUMNS.VALUE];
};

export const getAccountsfromMetaContent = (
  content: string[][]
): Record<string, string> => {
  return Object.fromEntries(
    content
      .filter((m) => m[META_COLUMNS.TYPE] === META_TYPE.ACCOUNT)
      .map(([, name, value]) => [name, value])
  );
};
