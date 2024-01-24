import {type Car} from "../../../../glue/plugins/car";
import {
  isTypeOfRule,
  useValidator,
  Types,
  stringToNumberTransformer
} from "@antify/validate";

export default defineEventHandler(async (event) => {
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
  const query = queryValidator.validate(getQuery(event));

  if (queryValidator.hasErrors()) {
    throw new Error(queryValidator.getErrorsAsString());
  }

  let cars = (await useStorage<Car[]>('db').getItem('cars')) || []

  const allColors = {};
  const allTypes = {};

  cars.forEach(car => {
    allColors[car.color] = true
    allTypes[car.type] = true
  })

  cars.sort((a, b) => a.manufacturer < b.manufacturer ? -1 : 1)

  if (query.search) {
    cars = cars.filter(car => Object.values(car).join(' ').toLowerCase().includes(query.search!.toLowerCase()))
  }

  if (query.color) {
    cars = cars.filter(car => car.color === query.color)
  }

  if (query.type) {
    cars = cars.filter(car => car.type === query.type)
  }

  return {
    count: cars.length,
    cars: cars
      .slice((query.p - 1) * query.ipp, query.p * query.ipp)
      .map(car => ({
        id: car.id,
        model: car.model,
        manufacturer: car.manufacturer,
        type: car.type,
        color: car.color,
      })),
    colors: Object.keys(allColors).sort(),
    types: Object.keys(allTypes).sort(),
  }
})
