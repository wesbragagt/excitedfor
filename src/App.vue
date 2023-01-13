<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { getCountdownTowards } from './lib/time';
import { startCase } from 'lodash-es';

function useInterval({ callback = () => {}, seconds = 1 }) {
  const interval = ref();

  onMounted(() => {
    interval.value = setInterval(callback, seconds);
  });

  onUnmounted(() => {
    clearInterval(interval.value);
  });
}

export default defineComponent({
  name: 'App',
  setup() {
    const query: { event?: string; date?: string } = window.location.search
      .substring(1)
      .split('&')
      .reduce((acc, str) => {
        const [key, value] = str.split('=');
        return { ...acc, [key]: value };
      }, {});

    const eventName = query?.event ? query.event : 'vacation';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const targetDate = query?.date ? query.date : tomorrow.toISOString();

    const countdown = ref(getCountdownTowards(targetDate));

    try {
      useInterval({
        callback: () => {
          countdown.value = getCountdownTowards(targetDate);
        },
      });
    } catch (error) {}

    const startCountdown = ref(false);
    watch(startCountdown, (started) => {
      if (started) {
      }
    });

    const titleInput = ref(eventName);
    const dateInput = ref(targetDate);

    watch([titleInput, dateInput], (values) => {
      if (values.length) {
        const [title, date] = values;
        const url = new URL(window.location.href);
        url.searchParams.set('event', title);
        url.searchParams.set('date', date);
        window.history.pushState({}, '', url);
      }
    });

    const todaysDate = () => {
      const today = new Date();
      let dd: string | number = today.getDate();
      let mm: string | number = today.getMonth() + 1; //January is 0!
      let yyyy: string | number = today.getFullYear();

      if (dd < 10) {
        dd = '0' + dd;
      }

      if (mm < 10) {
        mm = '0' + mm;
      }

      return yyyy + '-' + mm + '-' + dd;
    };

    const display = reactive({
      title: startCase(`Excited for ${titleInput.value}`),
    });

    const handleSubmit = () => {
      window.location.reload();
    };

    return {
      eventName,
      countdown,
      startCase,
      display,
      titleInput,
      dateInput,
      todaysDate,
      handleSubmit,
    };
  },
});
</script>

<template>
  <h1>{{ display.title }}</h1>
  <form @submit.prevent="handleSubmit" class="controls">
    <input type="text" placeholder="Insert event name" v-model="titleInput" />
    <input
      type="date"
      placeholder="YYYY-MM-DD"
      :min="todaysDate()"
      v-model="dateInput"
    />
    <button type="submit">Start</button>
  </form>
  <div class="time">
    <template v-for="(value, key) of countdown" :key="key">
      <h4>{{ value + ' ' + startCase(key) }}</h4>
    </template>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.time {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}
.image {
  border-radius: 5%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  width: 95vw;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
</style>
