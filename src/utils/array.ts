import _ from "lodash";

export function hasDuplicates(array: string[]) {
  return _.uniq(array).length !== array.length;
}

export function hasDuplicatesObjects(array: any[]) {
  return _.uniqWith(array, _.isEqual).length !== array.length;
}
