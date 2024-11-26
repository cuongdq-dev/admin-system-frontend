import { useEffect } from 'react';
import { invokeRequest, RequestProps } from '../api-core';
export const useAPI = (
  options: RequestProps & { clearRequest?: boolean; key?: string; refreshNumber?: number }
) => {
  const { clearRequest = false, key, refreshNumber, ...rest } = options;

  useEffect(() => {
    if (clearRequest) return;

    if (rest.baseURL) {
      invokeRequest({ ...rest, onHandleError: (error) => {} });
    }
  }, [rest.baseURL, clearRequest, key, refreshNumber]);
};
