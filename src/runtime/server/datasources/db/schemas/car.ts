import {defineSchema} from '@antify/database';

export type Car = {
  _id: string
  model: string
  manufacturer: string
  type: string
  color: string
  engine: {
    type: string
    volumeInLiter: number
    powerPs: number
  }
};

export default defineSchema(async (client) => {
  client.getSchema('cars').add({
    model: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    engine: {
      type: {
        type: String,
        required: true,
      },
      volumeInLiter: {
        type: Number,
        required: true,
      },
      powerPs: {
        type: Number,
        required: true,
      }
    }
  });
});
