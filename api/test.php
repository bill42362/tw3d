<?php
require_once('lib/G3dDatabase.php');
require_once('lib/G3dCryptor.php');
require_once('lib/G3dIO.php');
require_once('lib/G3dGidList.php');
require_once('lib/G3dDataTable.php');

$conf_file_path = $_SERVER['DOCUMENT_ROOT'].'/../gis3d.conf';
	
$cp = new G3dCryptor();
$io = new G3dIO();
$db = new G3dDatabase();
$db->setupDatabaseByConfFile($conf_file_path);
$gList = new G3dGidList();
$dataTable = new G3dDataTable();

$db->connect();

$list = $gList->getListByRegionIds(null, '10013010', $db->pdo);
$sum = $dataTable->getSumByIds('7273834f-6f3c-4620-8853-d6cf770d1a88', $list, $db->pdo);
$townLists = $gList->getTownLists($db->pdo);
$countyLists = $gList->getCountyLists($db->pdo);

$db->disconnect();

//$io->setJson('list', $list);
//$io->setJson('sum', $sum);
$io->setJson('countyLists', $countyLists);
$io->setJson('DatabaseError', $db->err);
$io->printJson();
?>
