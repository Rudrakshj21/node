module.exports = function replaceTemplate(object, template) {
  // console.log("object.......", object);
  // console.log("template....", template);
  // console.log(object.image, object.productName);
  let replaceTemplateWithObjectData = template.replace(
    /\{%IMAGE%\}/g,
    object.image
  ); //g flag for all lines
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%PRODUCT_NAME%\}/g,
    object.productName
  );
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%ID%\}/g,
    object.id
  );

  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%QUANTITY%\}/g,
    object.quantity
  );

  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%PRICE%\}/g,
    object.price
  );
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%NUTRIENTS%\}/g,
    object.nutrients
  );
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%FROM%\}/g,
    object.from
  );
  replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
    /\{%DESCRIPTION%\}/g,
    object.description
  );
  // if the product is not organic replace the class to 'not-organic'
  if (!object.organic)
    replaceTemplateWithObjectData = replaceTemplateWithObjectData.replace(
      /\{%NOT_ORGANIC%\}/gm,
      "not-organic"
    );
  // console.log(replaceTemplateWithObjectData);

  return replaceTemplateWithObjectData;
};
