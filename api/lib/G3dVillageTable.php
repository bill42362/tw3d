<?php
require_once('G3dTable.php');
class G3dVillageTable {
	public $err = Array();
	protected $table = null;
	protected $getCentroids = '
		SELECT
			gid AS id,
			village_id, village AS name,
			legirea_id, legirea AS legirea_name,
			town_id, town AS town_name,
			county AS county_name, county_id AS county_id,
			ST_AsText(ST_Centroid(geom)) AS centroid,
			ST_XMin(geom) AS minX, ST_YMin(geom) AS minY,
			ST_XMax(geom) - ST_XMin(geom) AS width,
			ST_YMax(geom) - ST_YMin(geom) AS height
		FROM village
		WHERE county_id IS NOT NULL
		ORDER BY gid
	';
	protected $getCentroidsByTownId = '
		SELECT
			gid AS id,
			village_id, village AS name,
			town_id, town AS town_name,
			county AS county_name, county_id AS county_id,
			ST_AsText(ST_Centroid(geom)) AS centroid,
			ST_XMin(geom) AS minX, ST_YMin(geom) AS minY,
			ST_XMax(geom) - ST_XMin(geom) AS width,
			ST_YMax(geom) - ST_YMin(geom) AS height
		FROM village
		WHERE county_id IS NOT NULL AND town_id = :town_id
		ORDER BY gid
	';
	protected $getGidByNames = '
		SELECT gid AS id
		FROM village
		WHERE county = :county
			AND town = :town
			AND village = :village
	';
	protected $getGidsByTownId = '
		SELECT gid FROM village
		WHERE county_id IS NOT NULL AND town_id = :town_id
		ORDER BY gid
	';
	protected $getGidsGroupedByTown = '
		SELECT town_id AS id, array_agg(village.gid) AS gids
		FROM village
		WHERE county_id IS NOT NULL
		GROUP BY town_id
	';
	protected $getGidsGroupedByLegirea = '
		SELECT legirea_id AS id, array_agg(village.gid) AS gids
		FROM village
		WHERE county_id IS NOT NULL AND legirea_id IS NOT NULL
		GROUP BY legirea_id
	';
	protected $getGidsByCountyId = '
		SELECT gid FROM village
		WHERE county_id IS NOT NULL AND county_id = :county_id
		ORDER BY gid
	';
	protected $getGidsGroupedByCounty = '
		SELECT county_id AS id, array_agg(village.gid) AS gids
		FROM village
		WHERE county_id IS NOT NULL
		GROUP BY county_id
	';
	protected $getVillageByGid = '
		SELECT
			gid AS id,
			village_id, village AS name,
			town_id, town AS town_name,
			county AS county_name, county_id AS county_id
		FROM village
		WHERE county_id IS NOT NULL AND gid = :gid
	';
	protected $getGeomById = "
		SELECT
			gid AS id,
			village_id, village AS name,
			ST_NPoints(ST_SimplifyPreserveTopology(geom, :tolerance)) AS npoints,
			ST_AsGeoJSON(ST_SimplifyPreserveTopology(geom, :tolerance)) AS geom
		FROM village
		WHERE gid = :id
	";
	protected $getModel3d32ById = '
		SELECT 
			gid AS id,
			village_id, village AS name,
			model3d32 AS model
		FROM village
		WHERE gid = :id
	';
	protected $updateModel3d32ById = '
		UPDATE village
		SET (model3d32) = (:model)
		WHERE gid = :id
	';
	private $stmtOfGetCentroids = null;
	private $stmtOfGetCentroidsByTownId = null;
	private $stmtOfGetGidByNames = null;
	private $stmtOfGetGidsByTownId = null;
	private $stmtOfGetGidsGroupedByTown = null;
	private $stmtOfGetGidsGroupedByLegirea = null;
	private $stmtOfGetGidsByCountyId = null;
	private $stmtOfGetGidsGroupedByCounty = null;
	private $stmtOfGetVillageByGid = null;
	private $stmtOfGetGeomById = null;
	private $stmtOfUpdateModel3d32ById = null;
	private $stmtOfGetModel3d32ById = null;
	function __construct() {
		$this->table = new G3dTable();
		$this->table->setupCommands('village', [
			['gid', 'character varying'],
			['village', 'character varying'],
			['town', 'character varying'],
			['county', 'character varying'],
			['village_id', 'character varying'],
			['town_id', 'character varying'],
			['county_id', 'character varying'],
			['geom', 'USER-DEFINED']
		], ['gid']);
		return $this;
	}
	public function getCentroids($pdo) {
		if(!$this->stmtOfGetCentroids) {
			$this->stmtOfGetCentroids = $pdo->prepare($this->getCentroids);
		}
		$stmt = $this->stmtOfGetCentroids;
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function getCentroidsByTownId($town_id, $pdo) {
		if(!$this->stmtOfGetCentroidsByTownId) {
			$this->stmtOfGetCentroidsByTownId = $pdo->prepare($this->getCentroidsByTownId);
		}
		$stmt = $this->stmtOfGetCentroidsByTownId;
		$stmt->bindParam(':town_id', $town_id);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function getGidByNames($county, $town, $village, $pdo) {
		if(!$this->stmtOfGetGidByNames) {
			$this->stmtOfGetGidByNames = $pdo->prepare($this->getGidByNames);
		}
		$stmt = $this->stmtOfGetGidByNames;
		$stmt->bindParam(':county', $county);
		$stmt->bindParam(':town', $town);
		$stmt->bindParam(':village', $village);
		$stmt->execute();
		$data = $stmt->fetch(PDO::FETCH_OBJ);
		$id = null;
		if($data) {
			$id = $data->id;
		}
		array_push($this->err, $this->table->err);
		return $id;
	}
	public function getGidsByTownId($town_id, $pdo) {
		if(!$this->stmtOfGetGidsByTownId) {
			$this->stmtOfGetGidsByTownId = $pdo->prepare($this->getGidsByTownId);
		}
		$stmt = $this->stmtOfGetGidsByTownId;
		$stmt->bindParam(':town_id', $town_id);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$list = array();
		if(is_array($data) && (0 < count($data))) {
			for($i = 0; $i < count($data); ++$i) {
				$list[$i] = $data[$i]->gid;
			}
		}
		array_push($this->err, $this->table->err);
		return $list;
	}
	public function getGidsGroupedByTown($pdo) {
		if(!$this->stmtOfGetGidsGroupedByTown) {
			$this->stmtOfGetGidsGroupedByTown = $pdo->prepare($this->getGidsGroupedByTown);
		}
		$stmt = $this->stmtOfGetGidsGroupedByTown;
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function getGidsGroupedByLegirea($pdo) {
		if(!$this->stmtOfGetGidsGroupedByLegirea) {
			$this->stmtOfGetGidsGroupedByLegirea = $pdo->prepare($this->getGidsGroupedByLegirea);
		}
		$stmt = $this->stmtOfGetGidsGroupedByLegirea;
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function getGidsByCountyId($county_id, $pdo) {
		if(!$this->stmtOfGetGidsByCountyId) {
			$this->stmtOfGetGidsByCountyId = $pdo->prepare($this->getGidsByCountyId);
		}
		$stmt = $this->stmtOfGetGidsByCountyId;
		$stmt->bindParam(':county_id', $county_id);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$list = array();
		if(is_array($data) && (0 < count($data))) {
			for($i = 0; $i < count($data); ++$i) {
				$list[$i] = $data[$i]->gid;
			}
		}
		array_push($this->err, $this->table->err);
		return $list;
	}
	public function getGidsGroupedByCounty($pdo) {
		if(!$this->stmtOfGetGidsGroupedByCounty) {
			$this->stmtOfGetGidsGroupedByCounty = $pdo->prepare($this->getGidsGroupedByCounty);
		}
		$stmt = $this->stmtOfGetGidsGroupedByCounty;
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function getVillageByGid($gid, $pdo) {
		if(!$this->stmtOfGetVillageByGid) {
			$this->stmtOfGetVillageByGid = $pdo->prepare($this->getVillageByGid);
		}
		$stmt = $this->stmtOfGetVillageByGid;
		$stmt->bindParam(':gid', $gid);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_OBJ);
		$village_gid = null;
		if($result && (0 < count($result)) && is_string($result[0]->id)) {
			$village_gid = $result[0]->id;
		}
		array_push($this->err, $this->table->err);
		return $village_gid;
	}
	public function getGeomById($id, $fineness = 64, $pdo) {
		if(!$this->stmtOfGetGeomById) {
			$this->stmtOfGetGeomById = $pdo->prepare($this->getGeomById);
		}
		$stmt = $this->stmtOfGetGeomById;
		$stmt->bindParam(':id', $id);
		$exponent_min = 2;
		$exponent_max = 6;
		while(0.1 < ($exponent_max - $exponent_min)) {
			$mid = 0.5*($exponent_min + $exponent_max);
			$tolerance = pow(0.1, $mid);
			$stmt->bindParam(':tolerance', $tolerance);
			$stmt->execute();
			$data = $stmt->fetchAll(PDO::FETCH_OBJ);
			$npoints = $data[0]->npoints;
			if($fineness > $npoints) {
				$exponent_min = $mid;
			} else {
				$exponent_max = $mid;
			}
		}
		$tolerance = pow(0.1, $exponent_min);
		$stmt->bindParam(':tolerance', $tolerance);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function getModel3d32ById($id, $pdo) {
		if(!$this->stmtOfGetModel3d32ById) {
			$this->stmtOfGetModel3d32ById = $pdo->prepare($this->getModel3d32ById);
		}
		$stmt = $this->stmtOfGetModel3d32ById;
		$stmt->bindParam(':id', $id);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function updateModel3d32ById($id, $model, $pdo) {
		if(!$this->stmtOfUpdateModel3d32ById) {
			$this->stmtOfUpdateModel3d32ById = $pdo->prepare($this->updateModel3d32ById);
		}
		$stmt = $this->stmtOfUpdateModel3d32ById;
		$stmt->bindParam(':id', $id);
		$stmt->bindParam(':model', $model);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function createTable($pdo) {
		$err = $this->table->createTable($pdo);
		array_push($this->err, $err);
		return $err;
	}
	public function truncate($pdo) {
		$err = $this->table->truncate($pdo);
		array_push($this->err, $err);
		return $err;
	}
	public function drop($pdo) {
		$err = $this->table->drop($pdo);
		array_push($this->err, $err);
		return $err;
	}
	public function unitTest($pdo) {
		array_push($this->err, $pdo->errorInfo());
		return $pdo->errorInfo();
	}
}
// vim: dict+=~/.vim/dict/php.dict
?>
