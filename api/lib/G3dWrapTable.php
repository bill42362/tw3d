<?php
require_once('G3dTable.php');
class G3dWrapTable {
	public $err = Array();
	protected $table = null;
	protected $getWraps = "
		SELECT wrap_id, email, title, description, formula, updated, read
		FROM wrap
		WHERE blocked_till < now()
	";
	protected $getWrapById= "
		SELECT
			wrap_id, title, description, image, formula,
			extract(epoch from updated) AS updated
		FROM wrap
		WHERE blocked_till < now() AND wrap_id = :wrap_id
	";
	protected $createWrap = '
		INSERT INTO wrap (
			wrap_id, email, title, description, image, formula,
			access_id, created, updated, blocked_till
		)
		VALUES (
			:wrap_id, :email, :title, :description, :image, :formula,
			:access_id, now(), now(), now()
		)
		RETURNING wrap_id
	';
	protected $updateWrapById = '
		UPDATE wrap SET
			(title, description, image, formula, updated)
			= (:title, :description, :image, :formula, now())
		WHERE wrap_id = :wrap_id AND access_id = :access_id
	';
	protected $renewUpdatedTimeById = '
		UPDATE wrap SET (updated) = (now())
		WHERE wrap_id = :wrap_id
	';
	protected $renewReadTimeById = '
		UPDATE wrap SET (read) = (now())
		WHERE wrap_id = :wrap_id
	';
	private $stmtOfGetWraps = null;
	private $stmtOfGetWrapById = null;
	private $stmtOfCreateWrap = null;
	private $stmtOfUpdateWrapById = null;
	private $stmtOfRenewUpdatedTimeById = null;
	private $stmtOfRenewReadTimeById = null;
	function __construct() {
		$this->table = new G3dTable();
		$this->table->setupCommands('wrap', [
			['wrap_id', 'uuid'],
			['email', 'character varying'],
			['title', 'text'],
			['description', 'text'],
			['image', 'text'],
			['formula', 'character varying'],
			['access_id', 'uuid'],
			['blocked_till', 'timestamptz'],
			['created', 'timestamptz'],
			['updated', 'timestamptz'],
			['read', 'timestamptz']
		], ['wrap_id']);
		return $this;
	}
	public function getWraps($pdo) {
		if(!$this->stmtOfGetWraps) {
			$this->stmtOfGetWraps = $pdo->prepare($this->getWraps);
		}
		$stmt = $this->stmtOfGetWraps;
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $data;
	}
	public function getWrapById($id, $pdo) {
		if(!$this->stmtOfGetWrapById) {
			$this->stmtOfGetWrapById = $pdo->prepare($this->getWrapById);
		}
		$stmt = $this->stmtOfGetWrapById;
		$stmt->bindParam(':wrap_id', $id);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_OBJ);
		$wrap = null;
		if($result && (0 < count($result))) {
			$wrap = $result[0];
		}
		array_push($this->err, $this->table->err);
		return $wrap;
	}
	public function createWrap($email, $title, $description, $image, $formula, $pdo) {
		if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			return NULL;
		}
		if(!$this->stmtOfCreateWrap) {
			$this->stmtOfCreateWrap = $pdo->prepare($this->createWrap);
		}
		$stmt = $this->stmtOfCreateWrap;
		$wrap_id = trim(strtolower(shell_exec('uuidgen;')));
		$access_id = trim(strtolower(shell_exec('uuidgen;')));
		$stmt->bindParam(':wrap_id', $wrap_id);
		$stmt->bindParam(':access_id', $access_id);
		$stmt->bindParam(':email', $email);
		$stmt->bindParam(':title', $title);
		$stmt->bindParam(':description', $description);
		$stmt->bindParam(':image', $image);
		$stmt->bindParam(':formula', $formula);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_OBJ);
		$wrap_id = null;
		if($result && (0 < count($result)) && is_string($result[0]->wrap_id)) {
			$wrap_id = $result[0]->wrap_id;
		}
		array_push($this->err, $this->table->err);
		return array('wrap_id' => $wrap_id, 'access_id' => $access_id);
	}
	public function updateWrapById($id, $access_id, $title, $description, $image, $formula, $pdo) {
		if(!$this->stmtOfUpdateWrapById) {
			$this->stmtOfUpdateWrapById = $pdo->prepare($this->updateWrapById);
		}
		$stmt = $this->stmtOfUpdateWrapById;
		$stmt->bindParam(':wrap_id', $id);
		$stmt->bindParam(':access_id', $access_id);
		$stmt->bindParam(':title', $title);
		$stmt->bindParam(':description', $description);
		$stmt->bindParam(':image', $image);
		$stmt->bindParam(':formula', $formula);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $result;
	}
	public function renewUpdatedTimeById($id, $pdo) {
		if(!$this->stmtOfRenewUpdatedTimeById) {
			$this->stmtOfRenewUpdatedTimeById = $pdo->prepare($this->renewUpdatedTimeById);
		}
		$stmt = $this->stmtOfRenewUpdatedTimeById;
		$stmt->bindParam(':wrap_id', $id);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_OBJ);
		array_push($this->err, $this->table->err);
		return $result;
	}
	public function renewReadTimeById($id, $pdo) {
		if(!$this->stmtOfRenewReadTimeById) {
			$this->stmtOfRenewReadTimeById = $pdo->prepare($this->renewReadTimeById);
		}
		$stmt = $this->stmtOfRenewReadTimeById;
		$stmt->bindParam(':wrap_id', $id);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_OBJ);
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
