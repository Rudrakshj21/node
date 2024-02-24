module.exports = function findProductById(objectsArray, targetId) {
  // console.log(objectsArray, targetId);
  const product = objectsArray.filter((object) => {
    return object.id === targetId;
  });
  // console.log(product);
  return product;
};
