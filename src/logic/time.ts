import dayjs from "dayjs";
import UTC from "dayjs/plugin/utc";
import calendar from "dayjs/plugin/calendar";
import { computed } from "@vue/reactivity";

dayjs.extend(UTC);
dayjs.extend(calendar);

export const convertDate = (date: number) => {
  return dayjs.unix(date || 0).calendar();
};

export const useDate = (date: number) => computed(() => convertDate(date));
