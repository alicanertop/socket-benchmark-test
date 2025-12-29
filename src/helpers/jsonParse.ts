export const jsonParse = <T = any>(
  str?: string | null,
  noTryCatch: boolean = true
) => {
  if (!str) return undefined;

  if (noTryCatch) {
    return JSON.parse(str) as T;
  }

  try {
    return JSON.parse(str) as T;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
