export const getVal = (n, k) =>
  n?.references?.find(({ key }) => key === k)?.val;
