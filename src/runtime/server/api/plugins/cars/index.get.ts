import {type Car, type CarListingData} from "../../../../glue/plugins/car";
import {
  isTypeOfRule,
  useValidator,
  Types,
  stringToNumberTransformer
} from "@antify/validate";
import {extendSchemas} from "../../../datasources/db/car.extensions";
import {getDatabaseClientFromRequest} from "@antify/context";
import {type FilterQuery} from 'mongoose';

export default defineEventHandler(async (event) => {
  const contextConfig = useRuntimeConfig().exampleModule.providers;

  // TODO:: check authorization

  const {p, ipp} = queryValidator.validate(getQuery(event));

  if (queryValidator.hasErrors()) {
    throw new Error(queryValidator.getErrorsAsString());
  }

  const client = await getDatabaseClientFromRequest(
    event,
    contextConfig,
    extendSchemas
  );
  const query = getQuery(event);
  const filter: FilterQuery<Car> = {};
  const CarModel = client.getModel<Car>('cars');

  if (query.search) {
    filter['$or'] = [
      {manufacturer: {$regex: query.search, $options: "i"}},
      {model: {$regex: query.search, $options: "i"}}
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
