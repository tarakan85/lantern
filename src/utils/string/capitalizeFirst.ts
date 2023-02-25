export const capitalizeFirst = <T extends string>(str: T) =>
  str[0].toUpperCase().concat(str.slice(1)) as Capitalize<T>;
