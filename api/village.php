<?php
require_once('lib/G3dDatabase.php');
require_once('lib/G3dIO.php');
require_once('lib/G3dVillageTable.php');

$conf_file_path = $_SERVER['DOCUMENT_ROOT'].'/../gis3d.conf';
	
$io = new G3dIO();
$db = new G3dDatabase();
$db->setupDatabaseByConfFile($conf_file_path);
$village = new G3dVillageTable();

$db->connect();
$set = $io->get('get', 'set');
$id = $io->get('get', 'id');
$fineness = $io->get('get', 'fineness');
if(NULL == $set) {
	if(NULL != $id) {
		if(32 == $fineness) {
			$data = $village->getModel3d32ById($id, $db->pdo);
			if(NULL == $data[0]->model) {
				$data = $village->getGeomById($id, $fineness, $db->pdo);
			}
		} else {
			$data = $village->getGeomById($id, $fineness, $db->pdo);
		}
	} else {
		$data = $village->getCentroids($db->pdo);
	}
} else if(32 == $fineness) {
	$model_string = json_encode($io->get('post', 'model'));
	$data = $village->updateModel3d32ById($id, $model_string, $db->pdo);
}

$db->disconnect();
$io->setJson('data', $data);
$io->setJson('DatabaseError', $db->err);
$io->printJson();
?>
