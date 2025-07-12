// /utils/tableSearch.js
export const tableSearch = (data, query, keys = []) => {
  if (!query) return data;

  const lowerQuery = query.toLowerCase();

  return data.filter((item) =>
    keys.some((key) => {
      const value = key
        .split(".")
        .reduce((obj, k) => (obj ? obj[k] : null), item);
      return (
        typeof value === "string" && value.toLowerCase().includes(lowerQuery)
      );
    })
  );
};
