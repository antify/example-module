import {type Car} from '../../../../glue/stores/car';
import {
	Types,
	isTypeOfRule,
	useValidator,
	stringToNumberTransformer
} from '@antify/validate';
import {type FilterQuery} from 'mongoose';
import {getContext, useDatabaseClient} from '#database-module';
import {isAuthorizedHandler} from '#auth-module';
import {PermissionId} from '../../../../glue/permissions';

export default defineEventHandler(async (event) => {
	const {provider, tenantId} = getContext(event);

	await isAuthorizedHandler(event, PermissionId.CAN_READ_CAR, provider, tenantId);

	const {p, ipp} = queryValidator.validate(getQuery(event));

	if (queryValidator.hasErrors()) {
		throw new Error(queryValidator.getErrorsAsString());
	}

	const client = await useDatabaseClient(event);
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

const queryValidator = useValidator<{
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
