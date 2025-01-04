import { useEffect } from 'react';

const useBeforeUnload = (value: ((evt: BeforeUnloadEvent) => any) | string) => {
  useEffect(() => {
    const handleBeforeunload = (evt: BeforeUnloadEvent) => {
      let returnValue;
      if (typeof value === 'function') {
        returnValue = value(evt);
      } else {
        returnValue = value;
      }
      if (returnValue) {
        evt.preventDefault();
        evt.returnValue = returnValue;
      }
      return returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeunload);
    return () => window.removeEventListener('beforeunload', handleBeforeunload);
  }, [value]);
};

export default useBeforeUnload;
