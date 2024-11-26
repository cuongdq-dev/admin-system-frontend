import { useEffect, useRef } from 'react';
import { invokeRequest, RequestProps } from '../api-core';
import { useLocation } from 'react-router-dom';

export const useAPI = (options: RequestProps & { clearRequest?: boolean; key?: string }) => {
  const location = useLocation();
  const { clearRequest = false, key, ...rest } = options;

  const prevReloadTable = useRef(location.state?.reloadTable);

  useEffect(() => {
    // Nếu clearRequest là true, không gọi API
    if (clearRequest) return;

    console.log(location.state?.reloadTable, prevReloadTable.current);
    // Kiểm tra nếu baseURL có sẵn và nếu reloadTable thực sự thay đổi
    if (
      (rest.baseURL && location.state?.reloadTable !== prevReloadTable.current) ||
      !location.state?.reloadTable
    ) {
      // Cập nhật prevReloadTable để so sánh lần sau
      prevReloadTable.current = location.state?.reloadTable;

      // Gọi API khi reloadTable thay đổi
      invokeRequest({ ...rest, onHandleError: (error) => {} });
    }
  }, [rest.baseURL, clearRequest, key, location.state?.reloadTable]);
};
