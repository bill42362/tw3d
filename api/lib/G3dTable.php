<?php
class G3dTable {
	public $err = Array();
	public $tableName = null;
	public $columns = null;
	public $primaryKeyNames = null;
	protected $allData = null;
	protected $createTable = 'CREATE TABLE IF NOT EXISTS "_TABLE_NAME_" (
		_COLUMNS_
		PRIMARY KEY (_PRIMARY_KEY_NAMES_)
	)';
	protected $dropTable = 'DROP TABLE IF EXISTS "_TABLE_NAME_"';
	protected $truncateTable = 'TRUNCATE "_TABLE_NAME_"';
	protected $getAllDataByPrimaryKey = 'SELECT * FROM "_TABLE_NAME_" WHERE _PRIMARY_KEY_NAMES_ = :_PRIMARY_KEY_NAMES_';
	protected $stmtOfGetAllDataByPrimaryKey = null;

	public function setupCommands($tableName, $columns, $primaryKeyNames) {
		$this->tableName = $tableName;
		$this->columns = $columns;
		$this->primaryKeyNames = $primaryKeyNames;
		$patterns = Array();
		array_push($patterns, '/_TABLE_NAME_/u');
		array_push($patterns, '/_COLUMNS_/u');
		array_push($patterns, '/_PRIMARY_KEY_NAMES_/u');
		$columnString = '';
		if(is_array($columns)) {
			if(is_array($columns[0])) {
				foreach($columns as $c) {
					$columnString .= '"'.$c[0].'" '.$c[1].', ';
				}
			} else {
				$columnString .= '"'.$columns[0].'" '.$columns[1].',';
			}
		} else {
			array_push($this->err, 'Need column info in argument 2.');
			return false;
		}
		$primaryKeyNameString = '';
		if(is_array($primaryKeyNames)) {
			foreach($primaryKeyNames as $p) {
				$primaryKeyNameString .= '"'.$p.'", ';
			}
			$primaryKeyNameString = preg_replace('/, $/', '', $primaryKeyNameString);
		} else {
			array_push($this->err, 'Need column info in argument 3.');
			return false;
		}
		$replacements = Array();
		array_push($replacements, $tableName);
		array_push($replacements, $columnString);
		array_push($replacements, $primaryKeyNameString);
		$this->createTable = preg_replace($patterns, $replacements, $this->createTable);
		$this->dropTable = preg_replace($patterns, $replacements, $this->dropTable);
		$this->truncateTable = preg_replace($patterns, $replacements, $this->truncateTable);
		$this->getAllDataByPrimaryKey = preg_replace($patterns, $replacements, $this->getAllDataByPrimaryKey);
		return $this;
	}
	public function getDataByPrimaryKey($column, $primaryKey, $keyType, $pdo) {
		if(!$this->allData) {
			$this->allData = $this->getAllDataByPrimaryKey($primaryKey, $keyType, $pdo);
		}
		return $this->allData["$column"];
	}
	public function createTable($pdo) {
		$pdo->exec($this->createTable);
		array_push($this->err, $pdo->errorInfo());
		return $pdo->errorInfo();
	}
	public function truncate($pdo) {
		$pdo->exec($this->truncateTable);
		array_push($this->err, $pdo->errorInfo());
		return $pdo->errorInfo();
	}
	public function drop($pdo) {
		$pdo->exec($this->dropTable);
		array_push($this->err, $pdo->errorInfo());
		return $pdo->errorInfo();
	}
	public function unitTest($pdo) {
		array_push($this->err, $pdo->errorInfo());
		return $pdo->errorInfo();
	}
	protected function getAllDataByPrimaryKey($primaryKey, $keyType, $pdo) {
		if(!$this->allData) {
			if(!$this->stmtOfGetAllDataByPrimaryKey) {
				$this->stmtOfGetAllDataByPrimaryKey
					= $pdo->prepare($this->getAllDataByPrimaryKey);
			}
			$stmt = $this->stmtOfGetAllDataByPrimaryKey;
			$stmt->bindParam(':'.$this->primaryKeyName, $primaryKey, $keyType);
			$stmt->execute();
			$this->allData = $stmt->fetch(PDO::FETCH_ASSOC);
			array_push($this->err, $pdo->errorInfo());
		}
		return $this->allData;
	}
	protected function tableExists($pdo) {
		$table_exists = false;
		$checkTable = '
			SELECT EXISTS(
				SELECT 1 
				FROM pg_catalog.pg_class c
				WHERE c.relname = \''.$this->tableName.'\'
				AND c.relkind = \'r\'
			);
		';
		$stmt = $pdo->prepare($checkTable);
		$stmt->execute();
		$result = $stmt->fetch();
		$table_exists = $result['exists'];
		return $table_exists;
	}
}
// vim: dict+=~/.vim/dict/php.dict
?>
