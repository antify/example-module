import {type Permission} from '#authorization-module';

export enum PermissionId {
	CAN_CREATE_CAR = 'CAN_CREATE_CAR',
	CAN_READ_CAR = 'CAN_READ_CAR',
	CAN_UPDATE_CAR = 'CAN_UPDATE_CAR',
	CAN_DELETE_CAR = 'CAN_DELETE_CAR',
}

export const permissions: Permission[] = [
	{
		id: PermissionId.CAN_CREATE_CAR,
		name: 'Can create car'
	},
	{
		id: PermissionId.CAN_READ_CAR,
		name: 'Can read car'
	},
	{
		id: PermissionId.CAN_UPDATE_CAR,
		name: 'Can update car'
	},
	{
		id: PermissionId.CAN_DELETE_CAR,
		name: 'Can delete car'
	},
];
