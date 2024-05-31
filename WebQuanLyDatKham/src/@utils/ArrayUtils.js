
import _ from 'lodash';

export const replaceObjectAtIndex = (items, object, index) => {
    const ret = items.slice(0);
    ret[index] = object;
    return ret;
}
export const moveObjectToFirst = (items, object) => {
    var sortedItems = _.sortBy(items, function (item) {
        return item._id === object._id ? 0 : 1;
    });
    return sortedItems;
}