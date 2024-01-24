<script setup lang="ts">
const {
  data,
  skeleton,
  save,
  formDisabled,
  validator,
} = useNuxtApp().$cars.item
const engine = validator.fieldMap.engine

// TODO:: test error case
// watch(updateError, () => useUiClient().handler.handleResponseError(updateError))

const volumeInLiterErrors = computed(() => ([
  ...engine.volumeInLiter.validator.getErrors(),
  ...engine.powerPsVolumeDependency.validator.getErrors()
]))
const powerPsErrors = computed(() => ([
  ...engine.powerPs.validator.getErrors(),
  ...engine.powerPsVolumeDependency.validator.getErrors()
]))

function validateVolume(val) {
  engine.volumeInLiter.validator.validate(val, data.value, ['client-put', 'client-post'])
  engine.powerPsVolumeDependency.validator.validate(data.value.engine.volumeInLiter, data.value)
}
function validatePower(val) {
  engine.powerPs.validator.validate(val, data.value, ['client-put', 'client-post'])
  engine.powerPsVolumeDependency.validator.validate(data.value.engine.powerPs, data.value)
}
</script>

<template>
  <div class="p-2.5">
    <form @submit.prevent="save">
      <AntFormGroup>
        <AntFormGroup :direction="useUi().Direction.row">
          <AntTextInput
            v-model="data.engine.type"
            :label="validator.fieldMap.engine.type.readableName"
            :skeleton="skeleton"
            :disabled="formDisabled"
            :errors="validator.fieldMap.engine.type.validator.getErrors()"
            @validate="val => validator.fieldMap.engine.type.validator.validate(val, data, ['client-put', 'client-post'])"
          />

          <AntUnitInput
            v-model="data.engine.volumeInLiter"
            unit="Liter"
            :label="engine.volumeInLiter.readableName"
            :skeleton="skeleton"
            :disabled="formDisabled"
            :errors="volumeInLiterErrors"
            @validate="validateVolume"
          />
        </AntFormGroup>

        <AntFormGroup :direction="useUi().Direction.row">
          <AntUnitInput
            v-model="data.engine.powerPs"
            unit="ps"
            :label="engine.powerPs.readableName"
            :skeleton="skeleton"
            :disabled="formDisabled"
            description="If volume is less than 3 liter, power must be less than 200 ps."
            :errors="powerPsErrors"
            @validate="validatePower"
          />

          <div class="w-full"></div>
        </AntFormGroup>
      </AntFormGroup>
    </form>
  </div>
</template>
