<?php
require_once('lib/G3dDatabase.php');
require_once('lib/G3dIO.php');
require_once('lib/G3dVillageTable.php');
require_once('lib/G3dWrapTable.php');
require_once('lib/G3dDataTable.php');
require_once('lib/G3dGidList.php');

$conf_file_path = $_SERVER['DOCUMENT_ROOT'].'/../gis3d.conf';
	
$io = new G3dIO();
$db = new G3dDatabase();
$db->setupDatabaseByConfFile($conf_file_path);
$wrap = new G3dWrapTable();

$db->connect();
$order = $io->get('postOrGet', 'order');
switch($order) {
	case 'update':
		$id = $io->get('postOrGet', 'wrapId');
		$gId = $io->get('postOrGet', 'gId');
		$county = $io->get('postOrGet', 'county');
		$town = $io->get('postOrGet', 'town');
		$village = $io->get('postOrGet', 'village');
		$data = $io->get('postOrGet', 'data');
		$villageTable = new G3dVillageTable();
		$id = $wrap->getWrapById($id, $db->pdo)->wrap_id;

		$village_gid = $villageTable->getVillageByGid($gId, $db->pdo);
		if($id && (null != $data)) {
			if(!$village_gid && $county && $town && $village) {
				$village_gid = $villageTable->getGidByNames(
					//TODO: $legirea
					$county, $town, $village, $db->pdo
				);
			}
			if($village_gid) {
				$dataTable = new G3dDataTable();
				$dataTable->setDataByIds($id, $village_gid, $data, $db->pdo);
				$wrap->renewUpdatedTimeById($id, $db->pdo);
			}
		}
		break;
	case 'get':
	default:
		$id = $io->get('postOrGet', 'wrapId');
		$lastTime = $io->get('postOrGet', 'lastTime');
		$wrapData = $wrap->getWrapById($id, $db->pdo);
		if($wrapData) {
			if($lastTime && ($lastTime > 1000*$wrapData->updated)) {
				$io->setJson('noChange', true);
			} else {
				$dataTable = new G3dDataTable();
				$gList = new G3dGidList();
				$countyLists = $gList->getCountyLists($db->pdo);
				for($i = 0; $i < count($countyLists); ++$i) {
					$countyLists[$i]->data = $dataTable->getSumByIds(
						$id, $countyLists[$i]->gids, $db->pdo
					);
					unset($countyLists[$i]->gids);
				}
				$townLists = $gList->getTownLists($db->pdo);
				for($i = 0; $i < count($townLists); ++$i) {
					$townLists[$i]->data = $dataTable->getSumByIds(
						$id, $townLists[$i]->gids, $db->pdo
					);
					unset($townLists[$i]->gids);
				}
				$legireaLists = $gList->getLegireaLists($db->pdo);
				for($i = 0; $i < count($legireaLists); ++$i) {
					$legireaLists[$i]->data = $dataTable->getSumByIds(
						$id, $legireaLists[$i]->gids, $db->pdo
					);
					unset($legireaLists[$i]->gids);
				}
				$villageSums = $dataTable->getDatasById($id, $db->pdo);
				$wrap->renewReadTimeById($id, $db->pdo);
				$list = [];
				$list['wrapId'] = $id;
				$list['county'] = $countyLists;
				$list['town'] = $townLists;
				$list['legirea'] = $legireaLists;
				$list['village'] = $villageSums;
				$io->setJson('list', $list);
			}
		}
		break;
}

$db->disconnect();
$io->setJson('DatabaseError', $db->err);
$io->printJson();
?>
