-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: residuos
-- ------------------------------------------------------
-- Server version	5.6.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `destinatario`
--

DROP TABLE IF EXISTS `destinatario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `destinatario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) DEFAULT NULL,
  `ine` varchar(45) DEFAULT NULL,
  `domicilio` varchar(150) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinatario`
--

LOCK TABLES `destinatario` WRITE;
/*!40000 ALTER TABLE `destinatario` DISABLE KEYS */;
INSERT INTO `destinatario` VALUES (3,'Basurero','841643154312','Av. Industrial','6641587456');
/*!40000 ALTER TABLE `destinatario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generador`
--

DROP TABLE IF EXISTS `generador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `generador` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `razonSocial` varchar(100) DEFAULT NULL,
  `domicilio` varchar(150) DEFAULT NULL,
  `codigoPostal` varchar(45) DEFAULT NULL,
  `municipio` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `nra` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generador`
--

LOCK TABLES `generador` WRITE;
/*!40000 ALTER TABLE `generador` DISABLE KEYS */;
INSERT INTO `generador` VALUES (3,'Haima','Calle 11','123456','Tijuana','Baja California','6641234567','12345641654');
/*!40000 ALTER TABLE `generador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manifiesto`
--

DROP TABLE IF EXISTS `manifiesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manifiesto` (
  `identificador` int(11) NOT NULL AUTO_INCREMENT,
  `registroBC` varchar(45) DEFAULT NULL,
  `noManifiesto` int(11) DEFAULT NULL,
  `pagina` int(11) DEFAULT NULL,
  `idGenerador` int(11) DEFAULT NULL,
  `instruccionesEspeciales` text,
  `nombreResponsableGenerador` varchar(150) DEFAULT NULL,
  `idTransportista` int(11) DEFAULT NULL,
  `nombreTransportista` varchar(150) DEFAULT NULL,
  `cargoTransportista` varchar(45) DEFAULT NULL,
  `fechaEmbarque` date DEFAULT NULL,
  `ruta` text,
  `tipoVehiculo` varchar(45) DEFAULT NULL,
  `placa` varchar(45) DEFAULT NULL,
  `idDestinatario` int(11) DEFAULT NULL,
  `observaciones` text,
  `nombreDestinatario` varchar(150) DEFAULT NULL,
  `cargoDestinatario` varchar(45) DEFAULT NULL,
  `fechaRecepcion` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`identificador`),
  KEY `manifiesto_generador_idx` (`idGenerador`),
  KEY `manifiesto_transportista_idx` (`idTransportista`),
  KEY `manifiesto_destinatario_idx` (`idDestinatario`),
  KEY `manifiesto_user_idx` (`created_by`),
  CONSTRAINT `manifiesto_destinatario` FOREIGN KEY (`idDestinatario`) REFERENCES `destinatario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `manifiesto_generador` FOREIGN KEY (`idGenerador`) REFERENCES `generador` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `manifiesto_transportista` FOREIGN KEY (`idTransportista`) REFERENCES `transportista` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `manifiesto_user` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manifiesto`
--

LOCK TABLES `manifiesto` WRITE;
/*!40000 ALTER TABLE `manifiesto` DISABLE KEYS */;
INSERT INTO `manifiesto` VALUES (1,NULL,1,NULL,3,'Ninguna','Marisol Mendoza Jacobo',3,'Hector Mendoza Jacobo','Chofer','2016-04-19','Tijuana-ensenada','Trailer','vhd-12-15',3,NULL,'Rufino Radilla','CEO','2016-04-19','2016-04-19 00:22:27','2016-04-19 00:34:07',19);
/*!40000 ALTER TABLE `manifiesto` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `residuos`.`manifiesto_AFTER_INSERT` AFTER INSERT ON `manifiesto` FOR EACH ROW
BEGIN
	DECLARE currentManifest INT(11);
	SELECT value INTO currentManifest from meta_data where id = 3;
	set currentManifest = currentManifest + 1;
	UPDATE meta_data SET value=currentManifest WHERE id=3;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `manifiesto_has_residuos`
--

DROP TABLE IF EXISTS `manifiesto_has_residuos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manifiesto_has_residuos` (
  `idManifiesto` int(11) NOT NULL,
  `idResiduo` int(11) DEFAULT NULL,
  `cantidadContenedor` int(11) DEFAULT NULL,
  `tipoContenedor` varchar(45) DEFAULT NULL,
  `cantidadUnidad` int(11) DEFAULT NULL,
  `unidad` varchar(45) DEFAULT NULL,
  `destino` varchar(5) DEFAULT NULL,
  KEY `manifiesto_residuos_idx` (`idManifiesto`),
  KEY `residuos_manifiesto_idx` (`idResiduo`),
  CONSTRAINT `manifiesto_residuos` FOREIGN KEY (`idManifiesto`) REFERENCES `manifiesto` (`identificador`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `residuos_manifiesto` FOREIGN KEY (`idResiduo`) REFERENCES `tiporesiduo` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manifiesto_has_residuos`
--

LOCK TABLES `manifiesto_has_residuos` WRITE;
/*!40000 ALTER TABLE `manifiesto_has_residuos` DISABLE KEYS */;
INSERT INTO `manifiesto_has_residuos` VALUES (1,10,1,'Caja',10,'Kilogramos','4d');
/*!40000 ALTER TABLE `manifiesto_has_residuos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_data`
--

DROP TABLE IF EXISTS `meta_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meta_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` varchar(45) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_data`
--

LOCK TABLES `meta_data` WRITE;
/*!40000 ALTER TABLE `meta_data` DISABLE KEYS */;
INSERT INTO `meta_data` VALUES (1,'manifestEnd',100),(2,'manifestStart',1),(3,'manifestCurrent',2);
/*!40000 ALTER TABLE `meta_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pdf`
--

DROP TABLE IF EXISTS `pdf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pdf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `string` longtext,
  `fileType` varchar(45) DEFAULT NULL,
  `idManifiesto` int(11) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`) KEY_BLOCK_SIZE=8,
  KEY `file_manifiesto_idx` (`idManifiesto`) KEY_BLOCK_SIZE=8,
  CONSTRAINT `file_manifiesto` FOREIGN KEY (`idManifiesto`) REFERENCES `manifiesto` (`identificador`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=16;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pdf`
--

LOCK TABLES `pdf` WRITE;
/*!40000 ALTER TABLE `pdf` DISABLE KEYS */;
/*!40000 ALTER TABLE `pdf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residuo_has_unidades`
--

DROP TABLE IF EXISTS `residuo_has_unidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `residuo_has_unidades` (
  `idResiduo` int(11) DEFAULT NULL,
  `idUnidad` int(11) DEFAULT NULL,
  KEY `residuo_has_unidad_unidad_idx` (`idUnidad`),
  KEY `residuo_has_unidad` (`idResiduo`),
  CONSTRAINT `residuo_has_unidad` FOREIGN KEY (`idResiduo`) REFERENCES `tiporesiduo` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `residuo_has_unidad_unidad` FOREIGN KEY (`idUnidad`) REFERENCES `unidad` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residuo_has_unidades`
--

LOCK TABLES `residuo_has_unidades` WRITE;
/*!40000 ALTER TABLE `residuo_has_unidades` DISABLE KEYS */;
INSERT INTO `residuo_has_unidades` VALUES (10,2),(11,1);
/*!40000 ALTER TABLE `residuo_has_unidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiporesiduo`
--

DROP TABLE IF EXISTS `tiporesiduo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tiporesiduo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiporesiduo`
--

LOCK TABLES `tiporesiduo` WRITE;
/*!40000 ALTER TABLE `tiporesiduo` DISABLE KEYS */;
INSERT INTO `tiporesiduo` VALUES (10,'Papel',1),(11,'Plástico',1);
/*!40000 ALTER TABLE `tiporesiduo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transportista`
--

DROP TABLE IF EXISTS `transportista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transportista` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) DEFAULT NULL,
  `sct` varchar(45) DEFAULT NULL,
  `domicilio` varchar(150) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `autorizacionSemarnat` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transportista`
--

LOCK TABLES `transportista` WRITE;
/*!40000 ALTER TABLE `transportista` DISABLE KEYS */;
INSERT INTO `transportista` VALUES (3,'Transportes de RPBI de Tijuana','12356420','Av. Estudiantes #209','6641593763',NULL);
/*!40000 ALTER TABLE `transportista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidad`
--

DROP TABLE IF EXISTS `unidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unidad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidad`
--

LOCK TABLES `unidad` WRITE;
/*!40000 ALTER TABLE `unidad` DISABLE KEYS */;
INSERT INTO `unidad` VALUES (1,'Litros'),(2,'Kilogramos');
/*!40000 ALTER TABLE `unidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(75) DEFAULT NULL,
  `lastname` varchar(75) DEFAULT NULL,
  `userLevel` int(11) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (19,'Hector','Mendoza Jacobo',1,'Hectorhammett','$2a$10$eXMlul6N7tSxb7DawDrG..iDQOQZorLFF4b8/MF5iTUKjzKXDAQb6','2016-03-17 03:09:43','2016-04-19 00:34:27',NULL),(20,'Rufino ','Radilla Camacho',2,'RRadilla','$2a$10$UjXuYh8t3aeTzIxy/TwIaeQuXVu8VDZLw5Lp87CIJeOXEdelJcI1u','2016-04-19 00:38:48','2016-04-19 00:38:48',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'residuos'
--

--
-- Dumping routines for database 'residuos'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-19 20:04:16
