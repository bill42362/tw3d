<?php
require_once('G3dCryptor.php');

//* TODO: http://stackoverflow.com/questions/8419332/proper-session-hijacking-prevention-in-php
//* TODO: http://www.sitepoint.com/notes-on-php-session-security/

class G3dIO {
	public $err = Array();
	private $json = Array();
	public function setJson($keys, $value) {
		if(is_array($keys)) {
			$ref = &$this->json;
			for($i = 0; $i < count($keys); ++$i) {
				if(!isset($ref[$keys[$i]])) {
					$ref[$keys[$i]] = Array();
				}
				$ref = &$ref[$keys[$i]];
			}
			array_push($ref, $value);
		} else {
			if(!isset($this->json[$keys])) {
				$this->json[$keys] = Array();
			}
			array_push($this->json[$keys], $value);
		}
		return true;
	}
	public function printJson($opt_options = null) {
		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($this->json, $opt_options);
		return false;
	}
	public function set($dest, $key, $value, $opt_processes = Array()) {
		$value = $this->process($value, $opt_processes);
		switch(strtolower($dest)) {
			case 'session':
				session_start();
				$_SESSION[$key] = $value;
				session_write_close();
				break;
			default:
				break;
		}
		return true;
	}
	public function get($source, $key, $opt_processes = Array()) {
		$result = null;
		switch(strtolower($source)) {
			case 'session':
				session_start();
				if(isset($_SESSION, $_SESSION[$key])) {
					$result = $_SESSION[$key];
				}
				session_write_close();
				break;
			case 'get':
				if(isset($_GET[$key])) {
					$result = $_GET[$key];
				}
				break;
			case 'post':
				// it's safe to overwrite the $_POST if the content-type is application/json
				// because the $_POST var will be empty
				$headers = getallheaders();
				$content_type = '';
				if(isset($headers['Content-type'])) {
					$content_type = $headers['Content-type'];
				} else if(isset($headers['Content-Type'])) {
					$content_type = $headers['Content-Type'];
				}
				if (preg_match("/application\/json/", $content_type)) {
					$_POST = json_decode(file_get_contents("php://input"), true);
				} else if (preg_match("/audio\/vnd\.wav/", $content_type)) {
					$_POST['data'] = Array();
					$_POST['data']['blob'] = file_get_contents("php://input");
					$name = explode('=', $content_type);
					$name = $name[1];
					$_POST['data']['name'] = $name;
				}
				if(isset($_POST[$key])) {
					$result = $_POST[$key];
				}
				break;
			case 'postorget':
				$result = $this->get('post', $key);
				if(!$result) {
					$result = $this->get('get', $key);
				}
				break;
			case 'server':
				if('ip' == strtolower($key)) {
					$result = $this->getClientIp();
				}
				break;
			default:
				break;
		}
		return $this->process($result, $opt_processes);
	}
	public function destroy($target) {
		switch(strtolower($target)) {
			case 'session':
				session_start();
				// Unset all of the session variables.
				$_SESSION = array();

				// If it's desired to kill the session, also delete the session cookie.
				// Note: This will destroy the session, and not just the session data!
				if (ini_get("session.use_cookies")) {
					$params = session_get_cookie_params();
					setcookie(session_name(), '', time() - 42000,
						$params["path"], $params["domain"],
						$params["secure"], $params["httponly"]
					);
				}

				// Finally, destroy the session.
				session_destroy();
				session_write_close();
				break;
			default: break;
		}
		return true;
	}
	public function process($value, $opt_processes = Array()) {
		if($value) {
			$cp = new G3dCryptor();
			for($i = 0; $i < count($opt_processes); ++$i) {
				switch(strtolower($opt_processes[$i])) {
					case 'md5':
						$value = hash('md5', $value);
						break;
					case 'crypt':
						$value = $cp->crypt($value);
						break;
					case 'addslashes':
						$value = addslashes($value);
						break;
					default:
						break;
				}
			}
		}
		return $value;
	}
	private function getClientIp() {
		foreach(array(
			'HTTP_CLIENT_IP',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_X_FORWARDED',
			'HTTP_X_CLUSTER_CLIENT_IP',
			'HTTP_FORWARDED_FOR',
			'HTTP_FORWARDED',
			'REMOTE_ADDR'
		) as $key) {
			if (array_key_exists($key, $_SERVER)) {
				$ip = explode(',', $_SERVER[$key]);
				$ip = trim($ip[0]);
				if((bool)filter_var(
					$ip,
					FILTER_VALIDATE_IP,
					FILTER_FLAG_NO_PRIV_RANGE
					// | FILTER_FLAG_NO_RES_RANGE
				)) {
					return $ip;
				}
			}
		}
		return null;
	}
}
?>
