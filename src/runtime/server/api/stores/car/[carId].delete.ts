import {type Car} from '../../../../glue/stores/car';
import {useDatabaseClient, getContext} from '#database-module';
import {isAuthorizedHandler} from '#auth-module';
import {PermissionId} from '../../../../glue/permissions';

export default defineEventHandler(async (event) => {
	const {provider, tenantId} = getContext(event);

	await isAuthorizedHandler(event, PermissionId.CAN_DELETE_CAR, provider, tenantId);

  const client = await useDatabaseClient(event);
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
