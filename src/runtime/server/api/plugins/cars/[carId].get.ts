import {type Car} from "../../../../glue/plugins/car";

export default defineEventHandler(async (event) => {
  const cars = await useStorage<Car[]>('db').getItem('cars')
  const car = (cars || []).find((car) => car.id === event.context.params.carId);

  if (!car) {
    return {
      notFound: true
    }
  }

  return car
})
