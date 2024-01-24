import {type Car} from "~/src/runtime/glue/plugins/car";

export default defineEventHandler(async (event) => {
  const carIdToDuplicate = event.context.params.carId;

  const storage = useStorage('db');
  const cars = (await storage.getItem<Car[]>('cars')) || [];
  const index = cars.findIndex((car) => car.id === carIdToDuplicate);

  if (index === -1) {
    return {
      notFound: true
    }
  }

  const newCar = {
    id: (() => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // eslint-disable-next-line no-bitwise
        const r = (Math.random() * 16) | 0;
        // eslint-disable-next-line no-bitwise
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    })(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...cars[index]
  }

  cars.push(newCar);

  await storage.setItem('cars', cars);

  return {id: newCar.id};
});
