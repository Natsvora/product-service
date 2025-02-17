export const convertToObject = (item: any) => {
  const formattedItem: any = {};
  for (const key in item) {
    if (item[key].S)
      formattedItem[key] = item[key].S; // Strings
    else if (item[key].N)
      formattedItem[key] = Number(item[key].N); // Numbers
    else if (item[key].BOOL)
      formattedItem[key] = item[key].BOOL; // Booleans
    else formattedItem[key] = item[key]; // Default
  }
  return formattedItem;
};
