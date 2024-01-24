import {faker} from '@faker-js/faker'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hookOnce("request", async () => {
    const cars = [];
    const amount = 100000;

    for (let i = 0; i < amount; i++) {
      cars.push({
        id: faker.string.uuid(),
        model: faker.vehicle.model(),
        manufacturer: faker.vehicle.manufacturer(),
        type: faker.vehicle.type(),
        fuel: faker.vehicle.fuel(),
        year: faker.number.int({min: 1990, max: 2020}),
        color: faker.vehicle.color(),
        price: faker.number.int({min: 10000, max: 100000}),
        engine: {
          type: 'diesel',
          volumeInLiter: 2.0,
          powerPs: 150,
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      });
    }

    await useStorage('db').setItem('cars', cars)

    console.log(`Generated ${amount} cars`);
  });
})
