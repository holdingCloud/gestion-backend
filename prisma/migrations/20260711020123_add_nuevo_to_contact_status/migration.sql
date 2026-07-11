-- AlterEnum
-- Se agrega el valor 'NUEVO' en su propia migración: Postgres no permite
-- usar un valor de enum recién agregado dentro de la misma transacción que lo crea.
ALTER TYPE "ContactStatus" ADD VALUE 'NUEVO';
