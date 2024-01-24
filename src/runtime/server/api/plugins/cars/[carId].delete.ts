import {type Car} from "../../../../glue/plugins/car";

export default defineEventHandler(async (event) => {
  const cars = (await useStorage<Car[]>('db').getItem('cars')) || []
  const index = cars.findIndex((car) => car.id === event.context.params?.carId);

  if (index === -1) {
    return {
      notFound: true
    }
  }

  cars.splice(index, 1)

  await useStorage('db').setItem('cars', cars)

  return {}
})
