<script setup lang="ts">
import {faCar, faHome} from '@fortawesome/free-solid-svg-icons';
import {defaultToken} from '../utils';

const navbarItems = [
  {
    label: 'Home',
    icon: faHome,
    to: '/'
  }, {
    label: 'Cars',
    icon: faCar,
    to: '/cockpit/cars'
  }, {
    label: 'Cars per tenant',
    icon: faCar,
    to: '/tenants/65b23bf98f24acdf2bdc6f7f/cars'
  }
]
</script>

<template>
  <AntNavLeftLayout
    :navbar-items="navbarItems"
    logo-route="/"
  >
    <template #logo-image>
      <img
        src="~/assets/logo.svg"
        class="w-full"
      >
    </template>

    <NuxtPage />

    <AntToaster />
    <AuthorizationModuleJWTHelper
      :default-token="defaultToken"
    />
  </AntNavLeftLayout>
</template>
