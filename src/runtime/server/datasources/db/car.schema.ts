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
