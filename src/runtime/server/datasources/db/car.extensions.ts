import {Client} from '@antify/database';

export const extendSchemas = (client: Client) => {
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
};
