import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
// Import your language translation files
import translation from "zod-i18n-map/locales/es/zod.json";

i18next.init({
  lng: "es",
  resources: {
    es: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

export { z };

export const getZodFields = <T extends z.ZodTypeAny>(schema: T): any => {
  // make sure schema is not null or undefined
  if (schema === null || schema === undefined) return [];
  // check if schema is nullable or optional
  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional) {
    return getZodFields(schema.unwrap());
  }
  if (schema instanceof z.ZodEffects) return getZodFields(schema._def.schema);
  // check if schema is an array
  if (schema instanceof z.ZodArray) return getZodFields(schema.element);
  // check if schema is an object
  if (schema instanceof z.ZodObject) {
    return schema.shape;
  }
  // return empty array
  return [];
};
