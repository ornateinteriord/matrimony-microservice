import { useState, useEffect, useCallback } from "react";
import { post } from "../components/api/authHooks";
import { SponsorLockState } from "../types/sponsor";

export const useSponsorCode = () => {
  const [sponsorState, setSponsorState] = useState<SponsorLockState>({
    code: "",
    promoterName: "",
    isLocked: false,
    isVerified: false,
    isAutoPopulated: false,
    error: null,
  });
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Check URL query parameters on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const queryCode =
      params.get("ref") ||
      params.get("promo") ||
      params.get("sponsor") ||
      params.get("refered_by") ||
      params.get("promocode");

    if (queryCode && queryCode.trim()) {
      const codeValue = queryCode.trim().toUpperCase();
      // Lock immediately when auto-populated
      setSponsorState({
        code: codeValue,
        promoterName: "",
        isLocked: true,
        isVerified: false,
        isAutoPopulated: true,
        error: null,
      });

      // Verify immediately with backend
      setIsVerifying(true);
      post("/api/promoter/promocheck", { promocode: codeValue, code: codeValue })
        .then((res: any) => {
          if (res?.success) {
            setSponsorState((prev) => ({
              ...prev,
              promoterName: res?.data?.promoterName || res?.data?.name || "Verified Sponsor",
              isVerified: true,
              error: null,
            }));
          } else {
            setSponsorState((prev) => ({
              ...prev,
              error: res?.message || "Invalid or inactive referral code",
              isVerified: false,
            }));
          }
        })
        .catch((err: any) => {
          setSponsorState((prev) => ({
            ...prev,
            error: err?.response?.data?.message || err?.message || "Invalid referral code",
            isVerified: false,
          }));
        })
        .finally(() => {
          setIsVerifying(false);
        });
    }
  }, []);

  // Manual code input change
  const setCode = useCallback(
    (newCode: string) => {
      if (sponsorState.isLocked) return;
      setSponsorState((prev) => ({
        ...prev,
        code: newCode.toUpperCase(),
        error: null,
      }));
    },
    [sponsorState.isLocked]
  );

  // Manual code verification
  const verifyCode = useCallback(
    async (codeToVerify?: string) => {
      const targetCode = (codeToVerify || sponsorState.code).trim().toUpperCase();
      if (!targetCode) {
        setSponsorState((prev) => ({
          ...prev,
          error: "Please enter a referral / sponsor code",
        }));
        return false;
      }

      setIsVerifying(true);
      setSponsorState((prev) => ({ ...prev, error: null }));

      try {
        const res: any = await post("/api/promoter/promocheck", {
          promocode: targetCode,
          code: targetCode,
        });

        if (res?.success) {
          setSponsorState({
            code: targetCode,
            promoterName: res?.data?.promoterName || res?.data?.name || "Verified Sponsor",
            isLocked: true,
            isVerified: true,
            isAutoPopulated: false,
            error: null,
          });
          return true;
        } else {
          setSponsorState((prev) => ({
            ...prev,
            isVerified: false,
            error: res?.message || "Invalid sponsor code",
          }));
          return false;
        }
      } catch (err: any) {
        setSponsorState((prev) => ({
          ...prev,
          isVerified: false,
          error: err?.response?.data?.message || err?.message || "Invalid sponsor code",
        }));
        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    [sponsorState.code]
  );

  const resetCode = useCallback(() => {
    if (sponsorState.isAutoPopulated) return;
    setSponsorState({
      code: "",
      promoterName: "",
      isLocked: false,
      isVerified: false,
      isAutoPopulated: false,
      error: null,
    });
  }, [sponsorState.isAutoPopulated]);

  return {
    ...sponsorState,
    isVerifying,
    setCode,
    verifyCode,
    resetCode,
  };
};

export default useSponsorCode;
