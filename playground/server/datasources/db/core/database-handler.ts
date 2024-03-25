import {type User} from './schemas/user';
import {defineDatabaseHandler, type Auth} from '#auth-module';
import {getDatabaseClient, type SingleConnectionClient} from '@antify/database';

export default defineDatabaseHandler({
	async getDatabaseClient() {
		return (await getDatabaseClient('core') as SingleConnectionClient)
			.connect();
	},
	async findOneAuthByPassword(identifier: string, password: string): Promise<Auth | null> {
		const client = await this.getDatabaseClient();
		const user = await client
			.getModel<User>('users')
			.findOne({
				email: identifier
			})
			.populate({
				path: 'auth',
				model: client.getModel('auths')
			});

		if (!user || user.auth.password !== password) {
			return null;
		}

		return user.auth;
	}
});
