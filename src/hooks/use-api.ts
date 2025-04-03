import { useEffect } from 'react';
import { invokeRequest, RequestProps } from '../api-core';
export const useAPI = (
  options: RequestProps & { clearRequest?: boolean; refreshNumber?: number }
) => {
  const { clearRequest = false, refreshNumber, ...rest } = options;
  useEffect(() => {
    if (clearRequest) return;
    if (rest.baseURL) {
      invokeRequest(rest);
    }
  }, [rest.baseURL, clearRequest, refreshNumber, JSON.stringify(rest.params)]);
};
