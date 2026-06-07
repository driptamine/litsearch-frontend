
// sizes for devices
export const sizes = {
  giant: 2560,
  desktop: 1024,
  tablet: 668,
  phone: 420,
};

const buildMedia = (query) => (strings, ...values) => {
  const content = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  return `${query} { ${content} }`;
};

export const screenLargerThan = Object.keys(sizes).reduce(
  (accumulator, label) => {
    const emSize = sizes[label] / 16;
    accumulator[label] = buildMedia(`@media (min-width: ${emSize}em)`);
    return accumulator;
  },
  {}
);

export const media = Object.keys(sizes).reduce((accumulator, label) => {
  const emSize = sizes[label] / 16;
  accumulator[label] = buildMedia(`@media (max-width: ${emSize}em)`);
  return accumulator;
}, {});

export const maxWidthContent = "2560px";
