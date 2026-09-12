/**
 * Shared by both mentor tools (demo-fill and answer key) so they can never
 * drift apart. Not real security — the code ships in client-side plaintext on
 * purpose. It exists to stop a learner opening a mentor panel by accident,
 * nothing more, so don't upgrade it to real auth.
 */
export const MENTOR_PASSCODE = "muchson123";
