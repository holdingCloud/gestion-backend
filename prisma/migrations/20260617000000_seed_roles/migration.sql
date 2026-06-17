INSERT INTO "Roles" (type, "createdAt", "updatedAt")
VALUES
  ('ADMINISTRADOR', NOW(), NOW()),
  ('REPARTIDOR',    NOW(), NOW()),
  ('COMUN',         NOW(), NOW())
ON CONFLICT (type) DO NOTHING;
