import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, put } from "../authHooks";

export const useGetPromoterDashboard = (promoter_id?: any) => {
  return useQuery({
    queryKey: ["promoterDashboard", promoter_id],
    queryFn: async () => {
      if (!promoter_id) return null;
      return await get(`/api/promoter/dashboard/${promoter_id}`);
    },
    enabled: !!promoter_id,
  });
};

export const useUpdatePromoterProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>({
    mutationFn: async ({ promoter_id, data }: any) => {
      return await put(`/api/promoter/profile/${promoter_id}`, data);
    },
    onSuccess: (res: any, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: ["promoterDashboard", variables.promoter_id],
      });
    },
  });
};

export const useGetMyUsers = (promoter_id?: any) => {
  return useQuery({
    queryKey: ["myUsers", promoter_id],
    queryFn: async () => {
      if (!promoter_id) return { users: [] };
      return await get(`/api/promoter/my-users/${promoter_id}`);
    },
    enabled: !!promoter_id,
  });
};

export const useGetPromoterSentInterests = (promoter_id?: any) => {
  return useQuery({
    queryKey: ["promoterSentInterests", promoter_id],
    queryFn: async () => {
      if (!promoter_id) return { content: [] };
      return await get(`/api/promoter/interests/sent/${promoter_id}`);
    },
    enabled: !!promoter_id,
  });
};

// Get received interests for users referred by the promoter
export const useGetPromoterReceivedInterests = (promoter_id?: any) => {
  return useQuery({
    queryKey: ["promoterReceivedInterests", promoter_id],
    queryFn: async () => {
      const response = await get(`/api/promoter/interests/received/${promoter_id}`);
      if (response?.success) {
        return response.content || [];
      }
      throw new Error(response?.message || "Failed to fetch received interests");
    },
    enabled: !!promoter_id,
  });
};

// Search profiles via promoter endpoint
export const useGetPromoterSearchProfiles = (input?: any) => {
  return useQuery({
    queryKey: ["promoterSearchProfiles", input],
    queryFn: async () => {
      const response = await get(`/api/promoter/search?input=${input}`);
      if (response?.success) {
        return response.users || response.content || [];
      } else {
        throw new Error(response?.data?.error?.message || response?.message || "Failed to search profiles");
      }
    },
    enabled: false,
  });
};

export const useGetPromoterImageVerification = () => {
  return useMutation<any, any, any>({
    mutationFn: async ({ promoter_id, page, pageSize, status }: any) => {
      if (!promoter_id) throw new Error("promoter_id is required");
      const response = await post(`/api/promoter/image-verification/${promoter_id}`, {
        page,
        pageSize,
        status,
      });
      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to fetch pending images");
      }
    },
  });
};

export const useUpgradePromoterUserStatus = () => {
  return useMutation<any, any, any>({
    mutationFn: async ({ regno, image_verification }: any) => {
      const response = await put(`/api/promoter/upgrade-user/${regno}`, {
        image_verification,
      });
      if (response && response.success === false) {
        throw new Error(response.message || "Failed to update status");
      }
      return response;
    },
  });
};

export const usePromoterRegister = () => {
  return useMutation<any, any, any>({
    mutationFn: async (data: any) => {
      const response = await post("/api/promoter/register", data);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to register promoter");
      }
      return response;
    },
  });
};

export const useActivateFreeUser = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>({
    mutationFn: async (payload: any) => {
      const regNo = typeof payload === "string" ? payload : (payload?.registration_no || payload?.ref_no);
      const body = typeof payload === "object" ? payload : {};
      const response = await put(`/api/promoter/activate-user/${regNo}`, body);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myUsers"] });
      queryClient.invalidateQueries({ queryKey: ["promoterDashboard"] });
    },
  });
};

export const useReferUser = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, { email: string; phone: string }>({
    mutationFn: async ({ email, phone }: { email: string; phone: string }) => {
      const response = await post("/api/promoter/refer-user", { email, phone });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myUsers"] });
      queryClient.invalidateQueries({ queryKey: ["promoterDashboard"] });
    },
  });
};
