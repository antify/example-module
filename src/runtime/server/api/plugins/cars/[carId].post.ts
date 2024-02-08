import {type Car, validator} from "../../../../glue/plugins/car";
import {getDatabaseClientFromRequest} from "@antify/context";
import {extendSchemas} from "../../../datasources/db/car.extensions";

export default defineEventHandler(async (event) => {
  // TODO:: check authorization

  const body = validator.validate(await readBody(event), 'server-post');

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const contextConfig = useRuntimeConfig().exampleModule.providers;
  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  const CarModel = client.getModel<Car>('cars');
  const car = new CarModel(body);

  await car.save();

  return car;
})
