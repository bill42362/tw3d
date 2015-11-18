<?php
require_once('lib/G3dDatabase.php');
require_once('lib/G3dIO.php');
require_once('lib/G3dCountyTable.php');

$conf_file_path = $_SERVER['DOCUMENT_ROOT'].'/../gis3d.conf';
	
$io = new G3dIO();
$db = new G3dDatabase();
$db->setupDatabaseByConfFile($conf_file_path);
$county = new G3dCountyTable();

$db->connect();
$set = $io->get('get', 'set');
$id = $io->get('get', 'id');
$fineness = $io->get('get', 'fineness');
if(NULL == $set) {
	if(NULL != $id) {
		if(512 == $fineness) {
			$data = $county->getModel3d512ById($id, $db->pdo);
			if(NULL == $data[0]->model) {
				$data = $county->getGeomById($id, $fineness, $db->pdo);
			}
		} else {
			$data = $county->getGeomById($id, $fineness, $db->pdo);
		}
	} else {
		$data = $county->getCentroids($db->pdo);
	}
} else if(512 == $fineness) {
	$model_string = json_encode($io->get('post', 'model'));
	$data = $county->updateModel3d512ById($id, $model_string, $db->pdo);
}

$db->disconnect();
$io->setJson('data', $data);
$io->setJson('DatabaseError', $db->err);
$io->printJson();
?>
