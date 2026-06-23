-- Insert SUPER_ADMIN role
INSERT INTO "Roles" (type, "createdAt", "updatedAt")
VALUES ('SUPER_ADMIN', NOW(), NOW())
ON CONFLICT (type) DO NOTHING;

-- Assign all modules to SUPER_ADMIN
INSERT INTO "RolModulo" ("rolId", modulo, "createdAt")
SELECT r.id, m.modulo, NOW()
FROM "Roles" r
CROSS JOIN (
  VALUES
    ('CLIENTES'::"Modulo"),
    ('INVENTARIO'::"Modulo"),
    ('VENTAS'::"Modulo"),
    ('PROVEEDORES'::"Modulo"),
    ('COMPRAS'::"Modulo"),
    ('CUENTAS'::"Modulo"),
    ('RRHH'::"Modulo"),
    ('REPORTES'::"Modulo")
) AS m(modulo)
WHERE r.type = 'SUPER_ADMIN'
ON CONFLICT ("rolId", modulo) DO NOTHING;

-- REPARTIDOR: dejar solo VENTAS (eliminar CLIENTES e INVENTARIO)
DELETE FROM "RolModulo"
WHERE "rolId" = (SELECT id FROM "Roles" WHERE type = 'REPARTIDOR')
  AND modulo IN ('CLIENTES'::"Modulo", 'INVENTARIO'::"Modulo");
