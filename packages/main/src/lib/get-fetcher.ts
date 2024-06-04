/**
 * Get the bound service for the given MFE name or throws an error if it does not find.
 * @param env The CF environment bindings.
 * @param mfeName The name of the MFE to fetch.
 */
export const getFetcher = (
  env: Record<string, unknown>,
  mfeName: string
): Fetcher => {
  const service = env[mfeName];
  if (!service) {
    throw new Error(`MFE ${mfeName} is not bound to this Worker.`);
  }
  if (!isFetcher(service)) {
    throw new Error(
      `MFE ${mfeName} does not have an equivalent service binding.`
    );
  }
  return service;
};

/**
 * Narrowing predicate to determine if the object is a `Fetcher`.
 * @param obj The object to check.
 */
export const isFetcher = (obj: unknown): obj is Fetcher => {
  return Boolean((obj as Fetcher).fetch);
};
