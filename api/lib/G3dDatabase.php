<?php

class G3dDatabase {
	public $err = null;
	public $pdo = null;
	protected $conf = null;
	protected $host = null;
	protected $dbnname = null;
	protected $dbuser = null;

	public function setupDatabaseByConfFile($conf_file_path) {
		$success = false;
		if(!$this->pdo) {
			$conf = $this->readConfFromConfFile($conf_file_path);
			$this->host = $this->getValueFromConf('DbHost', $conf); 
			$this->dbname = $this->getValueFromConf('DbName', $conf); 
			$this->dbuser = $this->getValueFromConf('DbUser', $conf); 
			$this->pdo = new PDO(
				'pgsql:'
				.'host='.$this->host.';'
				.'dbname='.$this->dbname.';'
				.'user='.$this->dbuser.';'
			);
			if($this->pdo){
				$success = true;
				$this->err = '';
			}else{
				$this->err = 'Settings are incorrect.';
			}
		} else {
			$this->err = 'Already Connected.';
		}
		return $success;
	}
	public function connect() {
		$connect_result = false;
		if($this->pdo){
			$connect_result = true;
			$this->err = '';
		}else{
			$this->err = 'Could not connect database.';
		}
		return $connect_result;
	}
	public function disconnect() {
		$this->err = 'PDO database cannot be disconnect.';
		return false;
	}

	private function readConfFromConfFile($conf_file_path) {
		$conf_file = fopen($conf_file_path, 'r');
		$conf = fread($conf_file, filesize($conf_file_path));
		fclose($conf_file);
		return $conf;
	}
	private function getValueFromConf($val_name, $conf) {
		$value_sentences = preg_grep('/^'.$val_name.'/', explode("\n", $conf));
		$value_sentence = array_pop($value_sentences);
		$value_pair = explode(' ', $value_sentence);
		$value = array_pop($value_pair);
		return $value;
	}
}
?>
