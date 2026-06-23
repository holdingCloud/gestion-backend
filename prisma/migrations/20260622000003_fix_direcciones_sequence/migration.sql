-- La secuencia de Direcciones quedó desincronizada tras la carga masiva de datos del seed.
-- El MAX(id) en la tabla es 7903 pero la secuencia estaba en 3,
-- causando P2002 al intentar crear nuevas direcciones (IDs ya ocupados).
SELECT setval('"Direcciones_id_seq"', (SELECT MAX(id) FROM "Direcciones"));
