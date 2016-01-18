// Counting tests
describe('Reductio count distinct', function () {
    var group;
    var filterDim;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', group: 'one', bar: 1 },
            { foo: 'two', group: 'two', bar: 2 },
            { foo: 'two', group: 'two', bar: 3 },
            { foo: 'one', group: 'three', bar: 1 },
            { foo: 'one', group: 'three', bar: 5 },
            { foo: 'two', group: 'one', bar: 2 }
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        filterDim = data.dimension(function(d) { return d.group; });

        var reducer = reductio()
                .countDistinct(function(d){ return d.group;})
                .sum(function (d) { return d.bar; })
                .avg(true);

        reducer(group);
    });

    it('grouping have the right counts', function () {
        var values = {};
        group.all().forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].count).toEqual(2);
        expect(values['two'].count).toEqual(2);
    });

    it('properly tracks values', function () {
        var values = {};
        group.all().forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].countList).toEqual(['one', 'three']);
        expect(values['two'].countList).toEqual(['one', 'two']);

        filterDim.filter('one');

        expect(values['one'].countList).toEqual(['one']);
        expect(values['two'].countList).toEqual(['one']);

        filterDim.filter('three');

        expect(values['one'].countList).toEqual(['three']);
        expect(values['two'].countList).toEqual([]);

        filterDim.filterAll();

        expect(values['one'].countList).toEqual(['one', 'three']);
        expect(values['two'].countList).toEqual(['one', 'two']);
    });

    it('works properly with average', function () {
        var values = {};
        group.all().forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].avg).toEqual(3.5);
        expect(values['two'].avg).toEqual(3.5);

        filterDim.filter('one');

        expect(values['one'].avg).toEqual(1);
        expect(values['two'].avg).toEqual(2);

        filterDim.filter('three');

        expect(values['one'].avg).toEqual(6);
        expect(values['two'].avg).toEqual(0);
    });
});
