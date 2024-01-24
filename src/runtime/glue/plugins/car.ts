import {
  Types,
  isTypeOfRule,
  notBlankRule,
  useValidator,
  isRequiredRule,
  isUUIDRule
} from "@antify/validate"

export type Car = {
  id: string | null
  model: string | null
  manufacturer: string | null
  type: string | null
  color: string | null
  engine: {
    type: string | null
    volumeInLiter: number | null
    powerPs: number | null
  }
};

// TODO:: Fix type
export const validator = useValidator<Car>({
  id: {
    rules: [(val: any) => isUUIDRule(val)],
    groups: ['client-put', 'server-put']
  },
  model: {
    readableName: 'Model',
    rules: [
      {
        rule: (val: any) => isTypeOfRule(val, Types.STRING),
        groups: ['server-post', 'server-put']
      },
      isRequiredRule,
      notBlankRule
    ],
    groups: ['client-put', 'client-post', 'client-main-data', 'server-post', 'server-put']
  },
  color: {
    readableName: 'Color',
    rules: [
      {
        rule: (val: any) => isTypeOfRule(val, Types.STRING),
        groups: ['server-post', 'server-put']
      },
      isRequiredRule,
      notBlankRule
    ],
    groups: ['client-put', 'client-post', 'client-main-data', 'server-post', 'server-put']
  },
  manufacturer: {
    readableName: 'Manufacturer',
    rules: [
      {
        rule: (val: any) => isTypeOfRule(val, Types.STRING),
        groups: ['server-post', 'server-put']
      },
      isRequiredRule,
      notBlankRule
    ],
    groups: ['client-put', 'client-post', 'client-main-data', 'server-post', 'server-put']
  },
  type: {
    readableName: 'Type',
    rules: [
      {
        rule: (val: any) => isTypeOfRule(val, Types.STRING),
        groups: ['server-post', 'server-put']
      },
      isRequiredRule,
      notBlankRule
    ],
    groups: ['client-put', 'client-post', 'client-main-data', 'server-post', 'server-put']
  },
  engine: {
    type: {
      readableName: 'Type',
      rules: [
        {
          rule: (val: any) => isTypeOfRule(val, Types.STRING),
          groups: ['server-post', 'server-put']
        },
        isRequiredRule,
        notBlankRule
      ],
      groups: ['client-put', 'client-post', 'client-engine', 'server-post', 'server-put']
    },
    volumeInLiter: {
      readableName: 'Volume',
      rules: [
        {
          rule: (val: any) => isTypeOfRule(val, Types.NUMBER),
          groups: ['server-post', 'server-put']
        },
        isRequiredRule
      ],
      groups: ['client-put', 'client-post', 'client-engine', 'server-post', 'server-put']
    },
    powerPs: {
      readableName: 'Power',
      rules: [
        {
          rule: (val: any) => isTypeOfRule(val, Types.NUMBER),
          groups: ['server-post', 'server-put']
        },
        isRequiredRule,
      ],
      groups: ['client-put', 'client-post', 'client-engine', 'server-post', 'server-put']
    },
    /**
     * This is a "virtual" field to show how to use a dependency between fields.
     */
    powerPsVolumeDependency: {
      rules: (val, formData) => {
        if (formData.engine.volumeInLiter === null) {
          return true
        }

        return !(formData.engine.volumeInLiter <= 3 && formData.engine.powerPs >= 200)
          || `A ${formData.engine.volumeInLiter} liter engine can not have ${formData.engine.powerPs} ps`
      },
      groups: ['client-put', 'client-post', 'client-engine']
    }
  }
});
