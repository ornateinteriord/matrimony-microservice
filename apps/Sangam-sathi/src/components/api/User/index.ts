import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { del, get, post, put } from "../authHooks";
import TokenService from "../../token/tokenService";
import axios from "axios";

// Get all user profiles
export const useGetAllUsersProfiles = () => {
  return useMutation<any, any, any>({
    mutationFn: async ({ page, pageSize }: any) => {
      const response = await post("/api/user/all-users-profiles", {
        page,
        pageSize,
      });

      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    },
  });
};

export const useDeleteImage = () => {
  return useMutation<any, any, any>({
    mutationFn: async ({ regNo }: any) => {
      const response = await del(`/api/user/delete-image/${regNo}`);
      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    },
  });
};
export const useGetMyMatches = () => {
  return useMutation<any, any, any>({
    mutationFn: async ({ page, pageSize }: any) => {
      const response = await post("/api/user/my-matches", {
        page,
        pageSize,
      });

      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    },
  });
};
export const useGetSearchProfiles = (input?: any, isAdmin = false) => {
  return useQuery({
    queryKey: ["searchProfiles", input],
    queryFn: async () => {
      const response = await get(isAdmin ? `/api/admin/search?input=${input}` : `/api/user/search?input=${input}`);
      if (response?.success) {
        return response.users || [];
      } else {
        throw new Error(
          response?.data?.error?.message
        );
      }
    },
    enabled: false,
  });
};

// Get single member details
export const useGetMemberDetails = (reg_No?: any) => {
  return useQuery({
    queryKey: ["userDetails", reg_No],
    queryFn: async () => {
      const response = await get(`/api/user/profile/${reg_No}`);
      if (response?.success) {
        return response.data;
      } else {
        throw new Error(response?.message || "Failed to fetch member details");
      }
    },
    enabled: !!reg_No,
  });
};

// Update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const reg_No = TokenService.getRegistrationNo();

  return useMutation<any, any, any>({
    mutationFn: async (data: any) => {
      return await put(`/api/user/update-profile/${reg_No}`, data);
    },
    onSuccess: (response: any) => {
      if (response?.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["userDetails", reg_No] });
      }
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || err?.message || "Update failed";
      toast.error(errorMessage);
    },
  });
};

// Express interest mutation
export const useExpressInterest = () => {
  const queryClient = useQueryClient();

  return useMutation<any, any, any>({
    mutationFn: async ({
      sender,
      recipient,
      message,
    }: any) => {
      const { data } = await post("/api/user/interest", {
        sender,
        recipient,
        message,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Interest expressed successfully!');
      queryClient.invalidateQueries({ queryKey: ['interestStatus', 'get-interes'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "";

      if (errorMessage.includes('already expressed') || errorMessage.includes('Interest already exists')) {
        toast.info('You have already expressed interest to this user.');
      } else {
        toast.error('Failed to express interest. Please try again.');
      }
    }
  });
};

export const useGetReceivedInterests = (recipient?: any) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>({
    mutationFn: async ({ page, pageSize }: any) => {
      const response = await post(`/api/user/interest/received/${recipient}`, {
        page,
        pageSize,
      });

      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interestCounts'] });
    }
  });
};
export const useGetSentInterests = (sender?: any) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>({
    mutationFn: async ({ page, pageSize }: any) => {
      const response = await post(`/api/user/interest/sent/${sender}`, {
        page,
        pageSize,
      });

      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interestCounts'] });
    }
  });
};

export const useUpdateInterestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<any, any, any>({
    mutationFn: async ({
      sender,
      recipient,
      status,
    }: any) => {
      const { data } = await put(`/api/user/interest/${sender}`, {
        recipient,
        status,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Interest updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['interestStatus'] });
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
    onError: (_error: any) => {
      toast.error('Failed to update interest. Please try again.');
    }
  });
};

export const useGetAcceptedInterests = (recipient?: any) => {
  const queryClient = useQueryClient();
  return useMutation<any, any, any>({
    mutationFn: async ({ page, pageSize }: any) => {
      const response = await post(`/api/user/interest/accepted/${recipient}`, {
        page,
        pageSize,
      });

      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || "Failed to fetch users");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interestCounts'] });
    }
  });
};

export const useRemoveAcceptedConnection = () => {
  return useMutation<any, any, any>({
    mutationFn: ({ sender, recipient }: any) => {
      return del("/api/user/remove-connection", {
        data: {
          sender,
          recipient,
          isConnectionRemove: true
        },
      });
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "Connection removed");
    },
    onError: (_error: any) => {
      toast.error("Failed to Remove Connection");
    },
  });
};

export const useCancelSentInterest = () => {
  return useMutation<any, any, any>({
    mutationFn: ({ sender, recipient }: any) => {
      return del("/api/user/cancel", {
        data: {
          sender,
          recipient,
        },
      });
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || "Interest cancelled");
    },
    onError: (_error: any) => {
      toast.error("Failed to cancel interest");
    },
  });
};

export const useImageKitUpload = (username?: any) => {
  return useMutation<any, any, any>({
    mutationFn: async (file: any) => {
      // 1. Get signature from backend
      const authRes: any = await get("/image-kit-auth"); 
      const { signature, expire, token } = authRes;

      // 2. Prepare form data
      const data = new FormData();
      data.append("file", file);
      data.append("fileName", username || "photo"); 
      data.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
      data.append("signature", signature);
      data.append("expire", expire);
      data.append("token", token);
      data.append("folder", "/profile-images"); // optional folder

      // 3. Upload to ImageKit
      const uploadRes = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        data
      );

      return uploadRes.data; // contains URL in .url
    },
  });
};

const changePasswordAPI = async ({ registrationNo, oldPassword, newPassword }: any) => {
  return await post(`/api/user/change-password/${registrationNo}`, {
    oldPassword,
    newPassword,
  });
};

export const useChangePassword = () => {
  return useMutation<any, any, any>({
    mutationFn: changePasswordAPI,
  });
};

export const useGetInterestCounts = (reg_No?: any) => {
  return useSuspenseQuery({
    queryKey: ["sentInterests", "acceptedInterests", "receivedInterests", 'interestCounts', reg_No],
    queryFn: async () => {
      const data = await get(`/api/user/interest-counts/${reg_No}`);
      return data;
    },
  });
};

export const useGetConnections = () => {
  return useMutation<any, any, any>({
    mutationFn: async ({ page, pageSize, userId }: any) => {
      const response = await get(`/api/user/connections/${userId}`, {
        page,
        pageSize,
        userId
      });

      if (response?.success) {
        return {
          connections: response.content || [],
          currentPage: response.currentPage,
          pageSize: response.pageSize,
          totalRecords: response.totalRecords
        };
      } else {
        throw new Error(response?.message || "Failed to fetch connections");
      }
    },
  });
};
