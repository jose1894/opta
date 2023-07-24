import moment from 'moment';

export const formatDate = (dateString, format) => {
    const date = moment(dateString).format(format)
  return date; // custom date format
};

export const formatDateTime = (dateTimeString, format) => {
  return moment(dateTimeString).format(format); // custom date-time format
};

export const addPrefix = (prefix) => (value) => {
  return `${prefix} ${value}`; // add prefix to value
};

export const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

export const installGlobalFilters = (app) => {
  app.config.globalProperties.$filters = {
    formatDate,
    formatDateTime,
    addPrefix,
    pipe,
  };
};