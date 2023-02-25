export const capitalize = <T extends string>(str: T) => {
  return str[0].toUpperCase().concat(str.slice(1)) as Capitalize<T>;
};
