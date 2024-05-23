import {type Car, validator} from '../../../../glue/stores/car';
import {defineEventHandler, readBody} from '#imports';
import {useDatabaseClient} from '#database-module';
import {isAuthorizedHandler} from '#authorization-module';
import {PermissionId} from '../../../../glue/permissions';
import {isValidAppContextHandler} from '#app-context-module';

export default defineEventHandler(async (event) => {
	const {appId, tenantId} = isValidAppContextHandler(event);

	await isAuthorizedHandler(event, PermissionId.CAN_UPDATE_CAR);

  const body = validator.validate(await readBody(event), 'server-put');

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const client = await useDatabaseClient(appId, tenantId);
  const CarModel = client.getModel<Car>('cars');
  const car = await CarModel.findOne({_id: event.context.params!.carId});

  if (!car) {
    return {
      notFound: true
    }
  }

  await CarModel.updateOne({_id: event.context.params!.carId}, body);

  Object.assign(car, body);

})
