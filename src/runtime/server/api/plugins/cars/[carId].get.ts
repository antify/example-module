import {type Car} from "../../../../glue/plugins/car";
import {getDatabaseClientFromRequest} from "@antify/context";
import {extendSchemas} from "../../../datasources/db/car.extensions";

export default defineEventHandler(async (event) => {
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

  return car
})
