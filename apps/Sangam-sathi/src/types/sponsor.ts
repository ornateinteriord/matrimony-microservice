export interface SponsorLockState {
  code: string;
  promoterName: string;
  isLocked: boolean;
  isVerified: boolean;
  isAutoPopulated: boolean;
  error: string | null;
}
