<?php
require_once('G3dTable.php');
class G3dDataTable {
	public $err = Array();
	protected $table = null;
	protected $getDataByIds = "
		SELECT wrap_id, gid, data
		FROM data
		WHERE wrap_id = :wrap_id AND gid = :gid
	";
	protected $getDatasById = "
		SELECT gid AS id, data
		FROM data
		WHERE wrap_id = :wrap_id
	";
	protected $getSumByIds = "
		SELECT wrap_id, sum(data)
		FROM data
		WHERE wrap_id = :wrap_id AND gid = ANY (:gids)
		GROUP BY wrap_id
	";
	protected $insertDataByIds = '
		INSERT INTO data (wrap_id, gid, data)
		VALUES (:wrap_id, :gid, :data)
		RETURNING data
	';
	protected $updateDataByIds = '
		UPDATE data SET data = :data
		WHERE wrap_id = :wrap_id AND gid = :gid
	';
	private $stmtOfGetDataByIds = null;
	private $stmtOfGetDatasById = null;
	private $stmtOfGetSumByIds = null;
	private $stmtOfInsertDataByIds = null;
	private $stmtOfUpdateDataByIds = null;
	function __construct() {
		$this->table = new G3dTable();
		$this->table->setupCommands('data', [
			['wrap_id', 'uuid'],
			['gid', 'character varying'],
			['data', 'double precision']
		], ['wrap_id', 'gid']);
		return $this;
	}
	public function getDataByIds($wrapId, $gId, $pdo) {
		if(!$this->stmtOfGetDataByIds) {
			$this->stmtOfGetDataByIds = $pdo->prepare($this->getDataByIds);
		}
		$stmt = $this->stmtOfGetDataByIds;
		$stmt->bindParam(':wrap_id', $wrapId);
		$stmt->bindParam(':gid', $gId);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_OBJ);
		$data = null;
		if($result && (0 < count($result)) && is_numeric($result[0]->data)) {
			$data = $result[0]->data;
		}
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function getDatasById($wrapId, $pdo) {
		if(!$this->stmtOfGetDatasById) {
			$this->stmtOfGetDatasById = $pdo->prepare($this->getDatasById);
		}
		$stmt = $this->stmtOfGetDatasById;
		$stmt->bindParam(':wrap_id', $wrapId);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $result;
	}
	public function getSumByIds($wrapId, $gIds, $pdo) {
		if(!$this->stmtOfGetSumByIds) {
			$this->stmtOfGetSumByIds = $pdo->prepare($this->getSumByIds);
		}
		$stmt = $this->stmtOfGetSumByIds;
		$stmt->bindParam(':wrap_id', $wrapId);
		$stmt->bindParam(':gids', $gIds);
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		$sum = 0;
		if($result) {
			$sum = $result->sum;
		}
		return $sum;
	}
	public function setDataByIds($wrapId, $gId, $data, $pdo) {
		if(!$this->stmtOfInsertDataByIds) {
			$this->stmtOfInsertDataByIds = $pdo->prepare($this->insertDataByIds);
		}
		$insertStmt = $this->stmtOfInsertDataByIds;
		$insertStmt->bindParam(':wrap_id', $wrapId);
		$insertStmt->bindParam(':gid', $gId);
		$insertStmt->bindParam(':data', $data);
		$insertStmt->execute();
		$result = $insertStmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		if(0 == count($result)) {
			if(!$this->stmtOfUpdateDataByIds) {
				$this->stmtOfUpdateDataByIds = $pdo->prepare($this->updateDataByIds);
			}
			$updateStmt = $this->stmtOfUpdateDataByIds;
			$updateStmt->bindParam(':wrap_id', $wrapId);
			$updateStmt->bindParam(':gid', $gId);
			$updateStmt->bindParam(':data', $data);
			$updateStmt->execute();
			$result = $updateStmt->fetchAll(PDO::FETCH_OBJ);
		}
		array_push($this->err, $this->table->err);
		return $result;
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
