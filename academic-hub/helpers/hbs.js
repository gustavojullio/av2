// academic-hub/helpers/hbs.js

const moment = require('moment');

module.exports = {
  formatDate: function (date, format) {
    // Se o formato não for fornecido, use 'DD/MM/YYYY' como padrão.
    const newFormat = (typeof format === 'string') ? format : 'DD/MM/YYYY';
    return moment(date).utc().format(newFormat);
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' ';
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(' '));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + '...';
    }
    return str;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
};