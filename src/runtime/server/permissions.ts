import { Permission } from '@antify/ant-guard';

export enum PermissionId {
  CAN_DELETE_GLOBAL_NOTE = 'CAN_DELETE_GLOBAL_NOTE',
  CAN_DELETE_PERSONAL_NOTE = 'CAN_DELETE_PERSONAL_NOTE',
  CAN_EDIT_GLOBAL_NOTE = 'CAN_EDIT_GLOBAL_NOTE',
  CAN_EDIT_PERSONAL_NOTE = 'CAN_EDIT_PERSONAL_NOTE',
  CAN_READ_GLOBAL_NOTE = 'CAN_READ_GLOBAL_NOTE',
  CAN_READ_PERSONAL_NOTE = 'CAN_READ_PERSONAL_NOTE',
  CAN_CREATE_GLOBAL_NOTE = 'CAN_CREATE_GLOBAL_NOTE',
  CAN_CREATE_PERSONAL_NOTE = 'CAN_CREATE_PERSONAL_NOTE',
}

export const permissions: Permission[] = [
  {
    id: PermissionId.CAN_DELETE_GLOBAL_NOTE,
    name: 'Can delete global notes'
  },
  {
    id: PermissionId.CAN_DELETE_PERSONAL_NOTE,
    name: 'Can delete personal notes'
  },
  {
    id: PermissionId.CAN_EDIT_GLOBAL_NOTE,
    name: 'Can edit global notes'
  },
  {
    id: PermissionId.CAN_EDIT_PERSONAL_NOTE,
    name: 'Can edit personal notes'
  },
  {
    id: PermissionId.CAN_READ_GLOBAL_NOTE,
    name: 'Can read global notes'
  },
  {
    id: PermissionId.CAN_READ_PERSONAL_NOTE,
    name: 'Can read personal notes'
  },
  {
    id: PermissionId.CAN_CREATE_GLOBAL_NOTE,
    name: 'Can create global notes'
  },
  {
    id: PermissionId.CAN_CREATE_PERSONAL_NOTE,
    name: 'Can create personal notes'
  }
];
