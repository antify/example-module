import {type Car, validator} from '../../../../glue/stores/car';
import {getContext, useDatabaseClient} from '#database-module';
import {isAuthorizedHandler} from '#auth-module';
import {PermissionId} from '../../../../glue/permissions';

export default defineEventHandler(async (event) => {
	const {provider, tenantId} = getContext(event);

	await isAuthorizedHandler(event, PermissionId.CAN_CREATE_CAR, provider, tenantId);

  const body = validator.validate(await readBody(event), 'server-post');

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const client = await useDatabaseClient(event);
  const CarModel = client.getModel<Car>('cars');
  const car = new CarModel(body);

  await car.save();

  return car;
})
