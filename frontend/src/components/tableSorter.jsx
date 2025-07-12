export const tableSorter = (arr, key, direction) => {
  const getValue = (item) =>
    key.includes(".")
      ? key.split(".").reduce((obj, prop) => obj?.[prop], item)
      : item[key];

  return [...arr].sort((a, b) => {
    const valA = getValue(a);
    const valB = getValue(b);

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });
};
