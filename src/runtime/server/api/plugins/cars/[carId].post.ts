import {type Car, validator} from "../../../../glue/plugins/car";

export default defineEventHandler(async (event) => {
  const body = validator.validate(await readBody(event), 'server-post');

  if (validator.hasErrors()) {
    throw new Error(validator.getErrorsAsString());
  }

  const storage = useStorage('db');
  const cars = (await storage.getItem<Car[]>('cars')) || [];
  // generate a random uuid
  const newCar = {
    // id: faker.string.uuid(),
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
    ...body
  }

  cars.push(newCar)

  await storage.setItem('cars', cars);

  return newCar;
})
