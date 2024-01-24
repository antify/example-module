import {type Car, validator} from "../../../../glue/plugins/car";

export default defineEventHandler(async (event) => {
  const body = validator.validate(await readBody(event), 'server-put');

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const storage = useStorage('db');
  const cars = (await storage.getItem<Car[]>('cars')) || [];
  const index = cars.findIndex((car) => car.id === event.context.params?.carId);

  if (index === -1) {
    return {
      notFound: true
    }
  }

  cars[index] = body;

  await storage.setItem('cars', cars);

  return cars[index];
})
