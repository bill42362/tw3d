<?php
require_once('G3dVillageTable.php');
class G3dGidList {
	public $err = null;

	public function getCountyLists($pdo) {
		$village = new G3dVillageTable();
		return $village->getGidsGroupedByCounty($pdo);
	}
	public function getTownLists($pdo) {
		$village = new G3dVillageTable();
		return $village->getGidsGroupedByTown($pdo);
	}
	public function getLegireaLists($pdo) {
		$village = new G3dVillageTable();
		return $village->getGidsGroupedByLegirea($pdo);
	}
	public function getListByRegionIds($county_id, $town_id, $pdo) {
		$list = array();
		if($town_id) {
			$village = new G3dVillageTable();
			$list = $village->getGidsByTownId($town_id, $pdo);
		} else if($county_id) {
			$village = new G3dVillageTable();
			$list = $village->getGidsByCountyId($county_id, $pdo);
		}
		return $list;
	}
}
?>
