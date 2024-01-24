<script setup lang="ts">
const {$cars} = useNuxtApp();
const {
  data,
  skeleton,
  save,
  validator,
  formDisabled,
} = $cars.item

// const {
//   error: updateError,
// } = $updateCar

// watch(updateError, () => useUiClient().handler.handleResponseError(updateError))
</script>

<template>
  <div class="p-2.5">
    <form @submit.prevent="save">
      <AntFormGroup>
        <AntFormGroup :direction="useUi().Direction.row">
          <AntTextInput
            v-model="data.manufacturer"
            :label="validator.fieldMap.manufacturer.readableName"
            :skeleton="skeleton"
            :disabled="formDisabled"
            :errors="validator.fieldMap.manufacturer.validator.getErrors()"
            @validate="val => validator.fieldMap.manufacturer.validator.validate(val, data, ['client-put', 'client-post'])"
          />

          <AntTextInput
            v-model="data.model"
            :label="validator.fieldMap.model.readableName"
            :skeleton="skeleton"
            :disabled="formDisabled"
            :errors="validator.fieldMap.model.validator.getErrors()"
            @validate="val => validator.fieldMap.model.validator.validate(val, data, ['client-put', 'client-post'])"
          />
        </AntFormGroup>

        <AntFormGroup :direction="useUi().Direction.row">
          <AntTextInput
            v-model="data.type"
            :label="validator.fieldMap.type.readableName"
            :skeleton="skeleton"
            :disabled="formDisabled"
            :errors="validator.fieldMap.type.validator.getErrors()"
            @validate="val => validator.fieldMap.type.validator.validate(val, data, ['client-put', 'client-post'])"
          />

          <AntTextInput
            v-model="data.color"
            :label="validator.fieldMap.color.readableName"
            :validator-groups="['client-put', 'client-post']"
            :skeleton="skeleton"
            :disabled="formDisabled"
            :errors="validator.fieldMap.color.validator.getErrors()"
            @validate="val => validator.fieldMap.color.validator.validate(val, data, ['client-put', 'client-post'])"
          />
        </AntFormGroup>
      </AntFormGroup>
    </form>
  </div>
</template>
