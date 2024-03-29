import {defineFixture} from '@antify/database';
import {faker} from '@faker-js/faker';
import {type Car} from '../schemas/car';

function generate(count: number = 1) {
	const cars = [];

	for (let i = 0; i < count; i++) {
		cars.push({
			model: faker.vehicle.model(),
			manufacturer: faker.vehicle.manufacturer(),
			type: faker.vehicle.type(),
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
		})
	}

	return cars;
}

export default defineFixture({
	async load(client) {
		await client.getModel<Car>('cars').insertMany(generate(100));
	},

	dependsOn() {
		return [];
	}
});
