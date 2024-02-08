import {type Car} from "../../../../../../glue/plugins/car";
import {getDatabaseClientFromRequest} from "@antify/context";
import {extendSchemas} from "../../../../../datasources/db/car.extensions";

export default defineEventHandler(async (event) => {
  // TODO:: check authorization

  const contextConfig = useRuntimeConfig().exampleModule.providers;
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

  car.isNew = true;
  car._id = undefined;

  await car.save();

  return {_id: car._id};
});
