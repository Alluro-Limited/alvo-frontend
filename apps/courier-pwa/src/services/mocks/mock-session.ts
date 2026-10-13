/**
 * In-memory courier session for the mock services — mirrors what the httpOnly
 * cookie would carry once the real backend exists.
 */
export const mockSession: {phone: string | null} = {phone: null};
