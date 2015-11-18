<?php
require_once('lib/G3dDatabase.php');
require_once('lib/G3dIO.php');
require_once('lib/G3dLegireaTable.php');

$conf_file_path = $_SERVER['DOCUMENT_ROOT'].'/../gis3d.conf';
	
$io = new G3dIO();
$db = new G3dDatabase();
$db->setupDatabaseByConfFile($conf_file_path);
$legirea = new G3dLegireaTable();

$db->connect();
$set = $io->get('get', 'set');
$countyId = $io->get('get', 'countyId');
$id = $io->get('get', 'id');
$fineness = $io->get('get', 'fineness');
if(NULL == $set) {
	if(NULL != $id) {
		if(256 == $fineness) {
			$data = $legirea->getModel3d256ById($id, $db->pdo);
			if(NULL == $data[0]->model) {
				$data = $legirea->getGeomById($id, $fineness, $db->pdo);
			}
		} else {
			$data = $legirea->getGeomById($id, $fineness, $db->pdo);
		}
	} else if(NULL != $countyId) {
		$data = $legirea->getCentroidsByCountyId($countyId, $db->pdo);
	} else {
		$data = $legirea->getCentroids($db->pdo);
	}
} else if(256 == $fineness) {
	$model_string = json_encode($io->get('post', 'model'));
	$data = $legirea->updateModel3d256ById($id, $model_string, $db->pdo);
}

$db->disconnect();
$io->setJson('data', $data);
$io->setJson('DatabaseError', $db->err);
$io->printJson();
?>
