import {truncateText} from './truncateText';

test("truncateText('abv') returns abv", () => {
    expect(truncateText('abv')).toBe('abv');
});
expect(truncateText('abv')).toBe('abv');
test.each([
    [null, ''],
    [NaN, ''],
    [undefined, ''],
    ['', ''],
    [true, ''],
    [0, '0'],
    [10, '10'],
    [1122, '1122'],
    [112233, '1122...'],
    ['aabb', 'aabb'],
    ['aabbcc', 'aabb...'],
    ['aabbccdd', 'aabb...'],
    ['aabbccddee', 'aabb...'],
])('truncateText(%p, 4) returns %p', (a, expected) => {
    expect(truncateText(a,4)).toBe(expected);
});

