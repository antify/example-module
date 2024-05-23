import {isAuthorizedHandler} from '#authorization-module';
import {defineEventHandler} from '#imports';
import {type Car} from '../../../../../../glue/stores/car';
import {PermissionId} from '../../../../../../glue/permissions';
import {useDatabaseClient} from '#database-module';
import {isValidAppContextHandler} from '#app-context-module';

export default defineEventHandler(async (event) => {
	const {appId, tenantId} = isValidAppContextHandler(event);

	await isAuthorizedHandler(event, PermissionId.CAN_CREATE_CAR);

  const client = await useDatabaseClient(appId, tenantId);
  const CarModel = client.getModel<Car>('cars');
  const car = await CarModel.findOne({_id: event.context.params!.carId});

  if (!car) {
    return {
      notFound: true
    }
  }

  car.isNew = true;
  car._id = undefined;

  await car.save();

  return {_id: car._id};
});
