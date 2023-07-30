export function unique<T>(array: T[], propertyName: keyof T): T[] {
  return array.filter(
    (element, index) =>
      array.findIndex(
        (currentElement) =>
          currentElement[propertyName] === element[propertyName]
      ) === index
  );
}
