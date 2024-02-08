import {type Car, validator} from "../../../../glue/plugins/car";
import {getDatabaseClientFromRequest} from "@antify/context";
import {extendSchemas} from "../../../datasources/db/car.extensions";

export default defineEventHandler(async (event) => {
  // TODO:: Authorization
  const body = validator.validate(await readBody(event), 'server-put');

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const contextConfig = useRuntimeConfig().exampleModule.providers;

  // TODO:: check authorization

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
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
