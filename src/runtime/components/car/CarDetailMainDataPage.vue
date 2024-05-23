<script setup lang="ts">
import {useUi} from '#imports';
import {useCarDetailStore} from '../../stores/car';

const carDetailStore = useCarDetailStore();

// const {
//   error: updateError,
// } = $updateCar

// watch(updateError, () => useUiClient().handler.handleResponseError(updateError))
const fieldMap = carDetailStore.validator.fieldMap

// TODO:: fix ts errors
</script>

<template>
  <div class="p-2.5">
    <form @submit.prevent="carDetailStore.save">
      <AntFormGroup>
        <AntFormGroup :direction="useUi().Direction.row">
          <AntTextInput
            v-model="carDetailStore.entity.manufacturer"
            :label="fieldMap.manufacturer.readableName"
            :skeleton="carDetailStore.skeleton"
            :disabled="carDetailStore.formDisabled"
            :errors="fieldMap.manufacturer.validator.getErrors()"
            @validate="val => fieldMap.manufacturer.validator.validate(val, carDetailStore.entity, ['client-put', 'client-post'])"
          />

          <AntTextInput
            v-model="carDetailStore.entity.model"
            :label="fieldMap.model.readableName"
            :skeleton="carDetailStore.skeleton"
            :disabled="carDetailStore.formDisabled"
            :errors="fieldMap.model.validator.getErrors()"
            @validate="val => fieldMap.model.validator.validate(val, carDetailStore.entity, ['client-put', 'client-post'])"
          />
        </AntFormGroup>

        <AntFormGroup :direction="useUi().Direction.row">
          <AntTextInput
            v-model="carDetailStore.entity.type"
            :label="fieldMap.type.readableName"
            :skeleton="carDetailStore.skeleton"
            :disabled="carDetailStore.formDisabled"
            :errors="fieldMap.type.validator.getErrors()"
            @validate="val => fieldMap.type.validator.validate(val, carDetailStore.entity, ['client-put', 'client-post'])"
          />

          <AntTextInput
            v-model="carDetailStore.entity.color"
            :label="fieldMap.color.readableName"
            :validator-groups="['client-put', 'client-post']"
            :skeleton="carDetailStore.skeleton"
            :disabled="carDetailStore.formDisabled"
            :errors="fieldMap.color.validator.getErrors()"
            @validate="val => fieldMap.color.validator.validate(val, carDetailStore.entity, ['client-put', 'client-post'])"
          />
        </AntFormGroup>
      </AntFormGroup>
    </form>
  </div>
</template>
