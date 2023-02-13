export const prevIndex = <T extends any>(currIndex: number, arr: T[]) => {
  return currIndex < 0 ? arr.length - 1 : currIndex - 1;
};
