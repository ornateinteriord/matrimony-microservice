import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { SponsorLockState } from '../types/sponsor';

export function extractSponsorCodeFromUrl(searchQuery: string = ''): string {
  try {
    const query = searchQuery || (typeof window !== 'undefined' ? window.location.search : '');
    const params = new URLSearchParams(query);
    const code =
      params.get('ref') ||
      params.get('promo') ||
      params.get('sponsor') ||
      params.get('refered_by') ||
      '';
    return code.trim().toUpperCase();
  } catch {
    return '';
  }
}

export function useSponsorCode(initialSearch: string = '') {
  const initialUrlCode = extractSponsorCodeFromUrl(initialSearch);
  const isAuto = Boolean(initialUrlCode);

  const [state, setState] = useState<SponsorLockState>({
    code: initialUrlCode,
    promoterName: '',
    isLocked: isAuto,
    isVerified: isAuto,
    isAutoPopulated: isAuto,
    error: null,
  });

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const hasAutoCheckedRef = useRef<boolean>(false);

  // Auto-verify if auto-populated from URL
  useEffect(() => {
    if (initialUrlCode && !hasAutoCheckedRef.current) {
      hasAutoCheckedRef.current = true;
      setIsValidating(true);
      axios
        .post('/api/promoter/promocheck', {
          promocode: initialUrlCode,
          code: initialUrlCode,
          sponsorCode: initialUrlCode,
        })
        .then((res) => {
          if (res.data && res.data.success) {
            setState((prev) => ({
              ...prev,
              promoterName: res.data.data?.promoterName || 'Verified Partner',
              isVerified: true,
              isLocked: true,
              error: null,
            }));
          }
        })
        .catch(() => {
          // Keep locked as auto-populated from referral link
          setState((prev) => ({
            ...prev,
            promoterName: 'Referral Partner',
            isVerified: true,
            isLocked: true,
          }));
        })
        .finally(() => {
          setIsValidating(false);
        });
    }
  }, [initialUrlCode]);

  const updateCode = useCallback((newCode: string) => {
    setState((prev) => {
      if (prev.isLocked) return prev;
      return {
        ...prev,
        code: newCode.toUpperCase(),
        error: null,
      };
    });
  }, []);

  const verifyCode = useCallback(async (codeToVerify?: string): Promise<boolean> => {
    const targetCode = (codeToVerify !== undefined ? codeToVerify : state.code).trim().toUpperCase();
    if (!targetCode) {
      setState((prev) => ({
        ...prev,
        error: 'Please enter a valid sponsor code',
      }));
      return false;
    }

    setIsValidating(true);
    try {
      const res = await axios.post('/api/promoter/promocheck', {
        promocode: targetCode,
        code: targetCode,
        sponsorCode: targetCode,
      });

      if (res.data && res.data.success) {
        setState({
          code: targetCode,
          promoterName: res.data.data?.promoterName || 'Verified Partner',
          isLocked: true,
          isVerified: true,
          isAutoPopulated: state.isAutoPopulated,
          error: null,
        });
        setIsValidating(false);
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLocked: false,
          isVerified: false,
          error: res.data?.message || 'Invalid promocode. Please check and try again.',
        }));
        setIsValidating(false);
        return false;
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        'Invalid promocode. Please check and try again.';
      setState((prev) => ({
        ...prev,
        isLocked: false,
        isVerified: false,
        error: errorMsg,
      }));
      setIsValidating(false);
      return false;
    }
  }, [state.code, state.isAutoPopulated]);

  const getRegistrationBinding = useCallback(() => {
    return {
      sponsor_code: state.code,
      isSponsorLocked: state.isLocked,
      isSponsorVerified: state.isVerified,
      promoterName: state.promoterName,
    };
  }, [state]);

  return {
    state,
    isValidating,
    updateCode,
    verifyCode,
    getRegistrationBinding,
  };
}

export default useSponsorCode;
