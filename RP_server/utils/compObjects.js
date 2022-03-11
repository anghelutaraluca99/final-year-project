const _ = require('lodash');

module.exports = (object, base) => {
    function changes(object, base) {
		return _.transform(object, function(result, value, key) {
			if (!_.isEqual(value, base[key])) {
				result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
			}
		});
	}
	return changes(object, base);
}
// Source: https://gist.github.com/Yimiprod/7ee176597fef230d1451