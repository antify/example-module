import {defineSchema} from '../../../../../../../database';

/**
 * This is an example, how to extend an existing schema coming form a module.
 */
// TODO:: how to extend the type?
// export type Car = {
//   _id: string
//   model: string
//   manufacturer: string
//   type: string
//   color: string
//   engine: {
//     type: string
//     volumeInLiter: number
//     powerPs: number
//   }
// };

export default defineSchema(async (client) => {
  client.getSchema('cars').add({
    engine: {
      fuel: {
        type: String,
				default: null,
        required: false,
      }
    }
  });
});
