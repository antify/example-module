<script setup lang="ts">
import {useCarDetailStore} from '../../stores/car';
import {computed} from 'vue';
import {useUi} from '#imports';

const ui = useUi();
const carDetailStore = useCarDetailStore();
const fieldMap = carDetailStore.validator.fieldMap
const engine = fieldMap.engine

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
  engine.volumeInLiter.validator.validate(val, carDetailStore.entity, ['client-put', 'client-post'])
  engine.powerPsVolumeDependency.validator.validate(carDetailStore.entity.engine.volumeInLiter, carDetailStore.entity)
}
function validatePower(val) {
  engine.powerPs.validator.validate(val, carDetailStore.entity, ['client-put', 'client-post'])
  engine.powerPsVolumeDependency.validator.validate(carDetailStore.entity.engine.powerPs, carDetailStore.entity)
}
</script>

<template>
  <div class="p-2.5">
    <form @submit.prevent="carDetailStore.save">
      <AntFormGroup>
        <AntFormGroup :direction="ui.Direction.row">
          <AntTextInput
            v-model="carDetailStore.entity.engine.type"
            :label="engine.type.readableName"
            :skeleton="carDetailStore.skeleton"
            :disabled="carDetailStore.formDisabled"
            :errors="engine.type.validator.getErrors()"
            @validate="val => engine.type.validator.validate(val, carDetailStore.entity, ['client-put', 'client-post'])"
          />

          <AntUnitInput
            v-model="carDetailStore.entity.engine.volumeInLiter"
            unit="Liter"
            :label="engine.volumeInLiter.readableName"
            :skeleton="carDetailStore.skeleton"
            :disabled="carDetailStore.formDisabled"
            :errors="volumeInLiterErrors"
            @validate="validateVolume"
          />
        </AntFormGroup>

        <AntFormGroup :direction="ui.Direction.row">
          <AntUnitInput
            v-model="carDetailStore.entity.engine.powerPs"
            unit="ps"
            :label="engine.powerPs.readableName"
            :skeleton="carDetailStore.skeleton"
            :disabled="carDetailStore.formDisabled"
            description="If volume is less than 3 liter, power must be less than 200 ps."
            :errors="powerPsErrors"
            @validate="validatePower"
          />

          <div class="w-full" />
        </AntFormGroup>
      </AntFormGroup>
    </form>
  </div>
</template>
