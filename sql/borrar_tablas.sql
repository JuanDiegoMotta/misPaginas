-- Seleccionar la base de datos
USE tfg;

-- Deshabilitar temporalmente las restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;

-- Generar y ejecutar las sentencias DROP TABLE para cada tabla en la base de datos
SET @tables = NULL;
SELECT GROUP_CONCAT('`', table_name, '`') INTO @tables
FROM information_schema.tables 
WHERE table_schema = 'tfg';

SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);
PREPARE stmt FROM @tables;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Habilitar nuevamente las restricciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
