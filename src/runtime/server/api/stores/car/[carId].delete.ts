import {type Car} from '../../../../glue/stores/car';
import {defineEventHandler} from '#imports';
import {useDatabaseClient} from '#database-module';
import {isAuthorizedHandler} from '#authorization-module';
import {PermissionId} from '../../../../glue/permissions';
import {isValidAppContextHandler} from '#app-context-module';

export default defineEventHandler(async (event) => {
	const {appId, tenantId} = isValidAppContextHandler(event);

	await isAuthorizedHandler(event, PermissionId.CAN_DELETE_CAR);

  const client = await useDatabaseClient(appId, tenantId);
  const CarModel = client.getModel<Car>('cars');
  const car = await CarModel.findOne({_id: event.context.params!.carId});

  if (!car) {
    return {
      notFound: true
    }
  }

  await CarModel.deleteOne({_id: event.context.params!.carId})

  return {}
})
