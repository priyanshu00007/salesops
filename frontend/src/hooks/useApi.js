import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export function useFetch(key, url, options = {}) {
  const { enabled = true, params = {}, staleTime = 30000, refetchInterval = false } = options;
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key, params],
    queryFn: async () => {
      const res = await api.get(url, { params });
      return res.data;
    },
    enabled,
    staleTime,
    refetchInterval,
  });
}

export function useCreate(key, url, options = {}) {
  const queryClient = useQueryClient();
  const { successMsg = 'Created successfully', invalidateKey = key } = options;

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post(url, data);
      return res.data;
    },
    onSuccess: () => {
      if (successMsg) toast.success(successMsg);
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: Array.isArray(invalidateKey) ? invalidateKey : [invalidateKey] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Something went wrong');
    },
  });
}

export function useUpdate(key, url, options = {}) {
  const queryClient = useQueryClient();
  const { successMsg = 'Updated successfully', invalidateKey = key } = options;

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.patch(`${url}/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      if (successMsg) toast.success(successMsg);
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: Array.isArray(invalidateKey) ? invalidateKey : [invalidateKey] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Something went wrong');
    },
  });
}

export function useRemove(key, url, options = {}) {
  const queryClient = useQueryClient();
  const { successMsg = 'Deleted successfully', invalidateKey = key } = options;

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`${url}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      if (successMsg) toast.success(successMsg);
      if (invalidateKey) queryClient.invalidateQueries({ queryKey: Array.isArray(invalidateKey) ? invalidateKey : [invalidateKey] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Something went wrong');
    },
  });
}
