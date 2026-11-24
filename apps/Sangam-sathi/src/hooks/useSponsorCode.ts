import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SponsorLockState } from '../types/sponsor';
import { post } from '../components/api/authHooks';
import { toast } from 'react-toastify';

export const useSponsorCode = () => {
  const location = useLocation();
  const [sponsorState, setSponsorState] = useState<SponsorLockState>({
    code: '',
    promoterName: '',
    isLocked: false,
    isVerified: false,
    isAutoPopulated: false,
    error: null,
  });
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const initialCheckDone = useRef<boolean>(false);

  const getQueryCode = useCallback((): string => {
    try {
      const search = location.search || (typeof window !== 'undefined' ? window.location.search : '');
      const params = new URLSearchParams(search);
      const rawCode =
        params.get('ref') ||
        params.get('promo') ||
        params.get('sponsor') ||
        params.get('refered_by') ||
        '';
      return rawCode.trim().toUpperCase();
    } catch {
      return '';
    }
  }, [location.search]);

  const verifyCode = useCallback(
    async (codeToVerify: string, isAuto: boolean = false) => {
      const trimmed = codeToVerify.trim().toUpperCase();
      if (!trimmed) {
        setSponsorState((prev) => ({
          ...prev,
          error: 'Please enter a valid sponsor code',
        }));
        return;
      }

      setIsValidating(true);
      setSponsorState((prev) => ({ ...prev, error: null }));

      try {
        const response: any = await post('/api/promoter/promocheck', {
          promocode: trimmed,
        });

        if (response?.success && response?.data?.promoterName) {
          const promoterName = response.data.promoterName;
          setSponsorState({
            code: trimmed,
            promoterName,
            isLocked: true, // Immutable once verified
            isVerified: true,
            isAutoPopulated: isAuto,
            error: null,
          });
          toast.success(
            `Sponsor verified: ${trimmed} (${promoterName})`,
            { toastId: 'sponsor-verify-success' }
          );
        } else {
          const errMsg = response?.message || 'Invalid or inactive sponsor code';
          setSponsorState((prev) => ({
            ...prev,
            error: errMsg,
            // If from URL, remain locked to prevent tampering with referral link
            isLocked: isAuto ? true : false,
            isVerified: false,
          }));
        }
      } catch (err: any) {
        const errMsg =
          err?.response?.data?.message || 'Failed to verify sponsor code';
        setSponsorState((prev) => ({
          ...prev,
          error: errMsg,
          isLocked: isAuto ? true : false,
          isVerified: false,
        }));
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;

    const queryCode = getQueryCode();
    if (queryCode) {
      setSponsorState({
        code: queryCode,
        promoterName: '',
        isLocked: true, // Immediately locked from URL
        isVerified: false,
        isAutoPopulated: true,
        error: null,
      });
      verifyCode(queryCode, true);
    }
  }, [getQueryCode, verifyCode]);

  const setCode = useCallback(
    (newCode: string) => {
      // Prevent modification if already locked
      if (sponsorState.isLocked) return;
      setSponsorState((prev) => ({
        ...prev,
        code: newCode.toUpperCase(),
        error: null,
      }));
    },
    [sponsorState.isLocked]
  );

  const handleManualVerify = useCallback(() => {
    if (sponsorState.isLocked && sponsorState.isVerified) return;
    verifyCode(sponsorState.code, false);
  }, [sponsorState.code, sponsorState.isLocked, sponsorState.isVerified, verifyCode]);

  const resetIfNotLocked = useCallback(() => {
    if (sponsorState.isLocked) return; // Do not clear locked code
    setSponsorState({
      code: '',
      promoterName: '',
      isLocked: false,
      isVerified: false,
      isAutoPopulated: false,
      error: null,
    });
  }, [sponsorState.isLocked]);

  return {
    sponsorState,
    isValidating,
    setCode,
    handleManualVerify,
    resetIfNotLocked,
  };
};

export default useSponsorCode;
