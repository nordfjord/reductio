var crossfilter = require('crossfilter');
var bisect = crossfilter.bisect.by(function(d) { return d; }).left;

var reductio_count_distinct = {
	add: function(a, prior, path) {
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
            var value = a(v);
			var i = bisect(path(p).countList, value, 0, path(p).countList.length);
			if (!path(p).countList[i] || path(p).countList[i] !== value) {
                path(p).countList.splice(i, 0, value);
				path(p).count = path(p).countList.length;
			}
			return p;
		};
	},
	remove: function(a, prior, path) {
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
            var value = a(v);
            var i = bisect(path(p).countList, value, 0, path(p).countList.length);
            if (path(p).countList[i] && path(p).countList[i] === value) {
                path(p).countList.splice(i, 1);
                path(p).count = path(p).countList.length;
            }
			return p;
		};
	},
	initial: function(prior, path) {
		return function (p) {
			if(prior) p = prior(p);
			path(p).count = 0;
            path(p).countList = [];
			return p;
		};
	}
};

module.exports = reductio_count_distinct;
