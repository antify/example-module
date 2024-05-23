import {isAuthorizedHandler} from '#authorization-module';
import {defineEventHandler} from '#imports';
import {type Car} from '../../../../../../glue/stores/car';
import {PermissionId} from '../../../../../../glue/permissions';
import {getContext, useDatabaseClient} from '#database-module';

export default defineEventHandler(async (event) => {
	const {provider, tenantId} = getContext(event);

	await isAuthorizedHandler(event, PermissionId.CAN_CREATE_CAR, provider, tenantId);

  const client = await useDatabaseClient(event);
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
