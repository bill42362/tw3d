<?php
require_once('G3dTable.php');
class G3dLegireaTable {
	public $err = Array();
	protected $table = null;
	protected $getCentroids = '
		SELECT
			legirea_id AS id,
			legirea AS name,
			county AS county_name,
			county_id AS county_id,
			ST_AsText(ST_Centroid(geom)) AS centroid,
			ST_XMin(geom) AS minX,
			ST_YMin(geom) AS minY,
			ST_XMax(geom) - ST_XMin(geom) AS width,
			ST_YMax(geom) - ST_YMin(geom) AS height
		FROM legirea
		WHERE county_id IS NOT NULL
		ORDER BY legirea_id
	';
	protected $getCentroidsByCountyId = '
		SELECT
			legirea_id AS id,
			legirea AS name,
			county AS county_name,
			county_id AS county_id,
			ST_AsText(ST_Centroid(geom)) AS centroid,
			ST_XMin(geom) AS minX,
			ST_YMin(geom) AS minY,
			ST_XMax(geom) - ST_XMin(geom) AS width,
			ST_YMax(geom) - ST_YMin(geom) AS height
		FROM legirea
		WHERE county_id IS NOT NULL AND county_id = :county_id
		ORDER BY legirea_id
	';
	protected $getGeomById = "
		SELECT
			legirea_id AS id,
			legirea AS name,
			ST_NPoints(ST_SimplifyPreserveTopology(geom, :tolerance)) AS npoints,
			ST_AsGeoJSON(ST_SimplifyPreserveTopology(geom, :tolerance)) AS geom
		FROM legirea
		WHERE legirea_id = :id
	";
	protected $getModel3d256ById = '
		SELECT legirea_id AS id, legirea AS name, model3d256 AS model
		FROM legirea
		WHERE legirea_id = :id
	';
	protected $updateModel3d256ById = '
		UPDATE legirea
		SET (model3d256) = (:model)
		WHERE legirea_id = :id
	';
	private $stmtOfGetCentroids = null;
	private $stmtOfGetCentroidsByCountyId = null;
	private $stmtOfGetGeomById = null;
	private $stmtOfUpdateModel3d256ById = null;
	private $stmtOfGetModel3d256ById = null;
	function __construct() {
		$this->table = new G3dTable();
		$this->table->setupCommands('legirea', [
			['legirea_id', 'character varying'],
			['legirea', 'character varying'],
			['county_id', 'character varying'],
			['county', 'character varying'],
			['geom', 'USER-DEFINED']
		], ['legirea_id']);
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
	public function getCentroidsByCountyId($county_id, $pdo) {
		if(!$this->stmtOfGetCentroidsByCountyId) {
			$this->stmtOfGetCentroidsByCountyId = $pdo->prepare($this->getCentroidsByCountyId);
		}
		$stmt = $this->stmtOfGetCentroidsByCountyId;
		$stmt->bindParam(':county_id', $county_id);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function getGeomById($id, $fineness, $pdo) {
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
	public function getModel3d256ById($id, $pdo) {
		if(!$this->stmtOfGetModel3d256ById) {
			$this->stmtOfGetModel3d256ById = $pdo->prepare($this->getModel3d256ById);
		}
		$stmt = $this->stmtOfGetModel3d256ById;
		$stmt->bindParam(':id', $id);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function updateModel3d256ById($id, $model, $pdo) {
		if(!$this->stmtOfUpdateModel3d256ById) {
			$this->stmtOfUpdateModel3d256ById = $pdo->prepare($this->updateModel3d256ById);
		}
		$stmt = $this->stmtOfUpdateModel3d256ById;
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
