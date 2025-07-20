'use client';

import { useMemo } from 'react';
import { useSettingStore } from 'src/store/setting';
import { useShallow } from 'zustand/react/shallow';

type ActionType = 'create' | 'read' | 'update' | 'delete' | 'publish';
type Permission = {
  id: string;
  action: ActionType;
  subject: string;
  properties?: any;
  conditions?: any;
};

type Role = {
  id: string;
  name: string;
  permissions?: Permission[];
};

export const usePermissions = () => {
  const userRoles = useSettingStore(useShallow((state) => state.user?.user_roles)) as IUserRole[];

  // Check if user has specific permission
  const hasPermission = useMemo(() => {
    return (subject: string, action: ActionType) => {
      if (!userRoles || userRoles.length === 0) {
        return false;
      }

      return userRoles.some((role) => {
        return role.role?.role_permissions?.some((rp) => {
          return rp.permission.subject === subject && rp.permission.action === action;
        });
      });
    };
  }, [userRoles]);

  // Check if user has any permission for a subject
  const hasAnyPermission = useMemo(() => {
    return (subject: string) => {
      if (!userRoles || userRoles.length === 0) {
        return false;
      }

      return userRoles.some((ur) => {
        return ur.role?.role_permissions?.some((rp) => {
          return rp?.permission?.subject === subject;
        });
      });
    };
  }, [userRoles]);

  // Get all permissions for a subject
  const getSubjectPermissions = useMemo(() => {
    return (subject: string) => {
      if (!userRoles || userRoles.length === 0) {
        return [];
      }

      const permissions: string[] = [];
      userRoles.forEach((ur) => {
        ur.role?.role_permissions?.forEach((rp) => {
          if (
            rp?.permission?.subject === subject &&
            !permissions.includes(rp?.permission?.action!)
          ) {
            permissions.push(rp?.permission?.action!);
          }
        });
      });
      return permissions;
    };
  }, [userRoles]);

  // Check multiple permissions at once
  const hasAllPermissions = useMemo(() => {
    return (permissions: Array<{ subject: string; action: ActionType }>) => {
      return permissions.every(({ subject, action }) => hasPermission(subject, action));
    };
  }, [hasPermission]);

  return {
    hasPermission,
    hasAnyPermission,
    getSubjectPermissions,
    hasAllPermissions,
    userRoles,
  };
};
