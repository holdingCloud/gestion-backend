-- Cambiar Roles.type de enum typePosition a VARCHAR(50)
-- El USING castea el valor del enum a su representación de texto
ALTER TABLE "Roles" ALTER COLUMN "type" TYPE VARCHAR(50) USING "type"::text;
