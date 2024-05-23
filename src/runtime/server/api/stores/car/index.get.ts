import {
	Types,
	isTypeOfRule,
	useValidator,
	stringToNumberTransformer
} from '@antify/validate';
import {type FilterQuery} from 'mongoose';
import {useDatabaseClient} from '#database-module';
import {type Car} from '../../../../glue/stores/car';
import {defineEventHandler, getQuery} from '#imports';
import {isAuthorizedHandler} from '#authorization-module';
import {PermissionId} from '../../../../glue/permissions';
import {isValidAppContextHandler} from '#app-context-module';

export default defineEventHandler(async (event) => {
	const {appId, tenantId} = isValidAppContextHandler(event);

	await isAuthorizedHandler(event, PermissionId.CAN_READ_CAR);

	const queryValidator = useQueryValidator()
	const {p, ipp} = queryValidator.validate(getQuery(event));

	if (queryValidator.hasErrors()) {
		throw new Error(queryValidator.getErrorsAsString());
	}
console.log(appId, tenantId);
	const client = await useDatabaseClient(appId, tenantId);
	const query = getQuery(event);
	const filter: FilterQuery<Car> = {};
	const CarModel = client.getModel<Car>('cars');

	if (query.search) {
		filter['$or'] = [
			{manufacturer: {$regex: query.search, $options: 'i'}},
			{model: {$regex: query.search, $options: 'i'}}
		]
	}

	if (query.color) {
		filter.color = query.color;
	}

	if (query.type) {
		filter.type = query.type;
	}

	const cars = await CarModel.find(filter)
		.skip((p - 1) * ipp)
		.limit(ipp)
		.sort({
			'manufacturer': 'asc',
			'model': 'asc',
			'type': 'asc',
			'color': 'asc',
		});

	return {
		count: await CarModel.countDocuments(filter),
		cars: cars,
		colors: await CarModel.distinct('color').sort(),
		types: await CarModel.distinct('type').sort(),
	}
})

function useQueryValidator() {
	return useValidator<{
		p: number,
		ipp: number,
		search: string | null,
		color: string | null,
		type: string | null,
	}>({
		p: {
			transform: stringToNumberTransformer,
			rules: (val) => isTypeOfRule(val, Types.NUMBER),
			defaultValue: 1
		},
		ipp: {
			transform: stringToNumberTransformer,
			rules: (val) => isTypeOfRule(val, Types.NUMBER),
			defaultValue: 20
		},
		search: {
			rules: (val) => isTypeOfRule(val, [Types.STRING, Types.NULL]),
			defaultValue: null
		},
		color: {
			rules: (val) => isTypeOfRule(val, [Types.STRING, Types.NULL]),
			defaultValue: null
		},
		type: {
			rules: (val) => isTypeOfRule(val, [Types.STRING, Types.NULL]),
			defaultValue: null
		}
	});
}
