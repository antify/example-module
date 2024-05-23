import {type JsonWebToken} from '#authorization-module';
import {permissions} from './glue/permissions';

export const defaultToken: JsonWebToken = {
	id: 'an-user-id',
	isSuperAdmin: false,
	isBanned: false,
	providers: [
		{
			providerId: 'core',
			tenantId: null,
			isAdmin: false,
			isBanned: false,
			permissions: permissions.map(permission => permission.id)
		}, {
			providerId: 'tenant',
			tenantId: '65b23bf98f24acdf2bdc6f7f',
			isAdmin: false,
			isBanned: false,
			permissions: permissions.map(permission => permission.id)
		}
	]
};
