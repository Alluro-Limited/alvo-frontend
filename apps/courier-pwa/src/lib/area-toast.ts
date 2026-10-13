/**
 * Hand-off flag between the area picker and home: the picker sets `pending` before
 * navigating back, and home renders the "Delivery area changed" toast exactly once.
 * (A module flag, not search params — the /home route owns no search schema.)
 */
export const areaToast = {pending: false};
