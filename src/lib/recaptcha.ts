export interface RecaptchaResult {
  success: boolean;
  score: number;
  challengeRequired: boolean;
  simulated: boolean;
  reason?: string;
}

const SITE_VERIFY = 'https://www.google.com/recaptcha/api/siteverify';

export const verifyRecaptcha = async (token: string | undefined, action?: string): Promise<RecaptchaResult> => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { success: true, score: 0.9, challengeRequired: false, simulated: true };
  }
  if (!token) {
    return { success: false, score: 0, challengeRequired: true, simulated: false, reason: 'Missing token' };
  }
  try {
    const response = await fetch(SITE_VERIFY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
      cache: 'no-store',
    });
    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      'error-codes'?: string[];
    };
    const score = typeof data.score === 'number' ? data.score : data.success ? 0.9 : 0;
    const actionMatches = !action || !data.action || data.action === action;
    return {
      success: Boolean(data.success) && actionMatches && score >= 0.5,
      score,
      challengeRequired: !data.success || score < 0.5,
      simulated: false,
      reason: data['error-codes']?.join(', '),
    };
  } catch {
    return {
      success: false,
      score: 0,
      challengeRequired: true,
      simulated: false,
      reason: 'Verification service unavailable',
    };
  }
};
