export const nextIndex = <T extends any>(currIndex: number, arr: T[]) => {
  return currIndex >= arr.length - 1 ? 0 : currIndex + 1;
};
