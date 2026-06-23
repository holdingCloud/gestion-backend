-- AlterEnum: Add SUPER_ADMIN value
-- Must run in its own transaction before the new value can be used
ALTER TYPE "typePosition" ADD VALUE 'SUPER_ADMIN';
