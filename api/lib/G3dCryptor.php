<?php

class G3dCryptor {
	public $err = null;
	public function crypt($str) {
		$salt = $this->newSalt(32);
		$hashed = hash('SHA512', $str.$salt);
		return array('hashed' => $hashed, 'salt' => $salt);
	}
	public function compare($str, $hashed, $salt) {
		return ($hashed == hash('SHA512', $str.$salt));
	}
	public function unitTest() {
		$hash_pair = $this->crypt('Hello');
		$result = $this->compare('Hello', $hash_pair['hashed'], $hash_pair['salt']);
		if($result) {
			echo 'G3dCryptor::unitTest() Pass.<br />';
		} else {
			echo 'G3dCryptor::unitTest() Fail.<br />';
		}
		return $result;
	}
	public function newSalt($len = 32) {
		$shaker = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789-_';
		$salt = '';
		for($i = 0; $i < $len; ++$i) {
			$salt .= $shaker[mt_rand(0, strlen($shaker) - 1)];
		}
		return $salt;
	}
}
?>
