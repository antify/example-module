import {type Car} from '../../../../glue/stores/car';
import {getContext, useDatabaseClient} from '#database-module';
import {isAuthorizedHandler} from '#auth-module';
import {PermissionId} from '../../../../glue/permissions';

export default defineEventHandler(async (event) => {
	const {provider, tenantId} = getContext(event);

	await isAuthorizedHandler(event, PermissionId.CAN_READ_CAR, provider, tenantId);

  const client = await useDatabaseClient(event);
  const CarModel = client.getModel<Car>('cars');
  const car = await CarModel.findOne({_id: event.context.params!.carId});

  if (!car) {
    return {
      notFound: true
    }
  }

  return car
})
