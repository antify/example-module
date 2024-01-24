import { defineDatabaseConfig } from '@antify/ant-database';

export default defineDatabaseConfig({
  core: {
    databaseUrl: 'mongodb://core:core@localhost:27017/core',
    isSingleConnection: true,
    migrationDir: './migrations/core',
  },
  tenant: {
    databaseUrl: 'mongodb://root:root@127.0.0.1:27017',
    isSingleConnection: false,
    migrationDir: './migrations/tenant',
    fetchTenants: async () => [],
  },
});
