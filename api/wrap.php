<?php
require_once('lib/G3dDatabase.php');
require_once('lib/G3dIO.php');
require_once('lib/G3dWrapTable.php');

$conf_file_path = $_SERVER['DOCUMENT_ROOT'].'/../gis3d.conf';
	
$io = new G3dIO();
$db = new G3dDatabase();
$db->setupDatabaseByConfFile($conf_file_path);
$wrap = new G3dWrapTable();

$db->connect();
$order = $io->get('postOrGet', 'order');
switch($order) {
	case 'create':
		$owner = 'bill42362';
		$owner_mail = $owner.'@gmail.com';
		$email = $io->get('postOrGet', 'email');
		$title = $io->get('postOrGet', 'title');
		$description = $io->get('postOrGet', 'description');
		$formula = $io->get('postOrGet', 'formula');
		$creationMeta = $wrap->createWrap($email, $title, $description, null, $formula, $db->pdo);
		$creation = $wrap->getWrapById($creationMeta['wrap_id'], $db->pdo);
		if($creation->wrap_id) {
			$message = array();
			$message[0] = "wrap_id: ".$creationMeta['wrap_id'];
			$message[1] = "access_id: ".$creationMeta['access_id'];
			$message[0] = "email: ".$email;
			$message[0] = "title: ".$creation->title;
			$message[0] = "description: ".$creation->description;
			$message[1] = "formula: ".$creation->formula;
			$subject = "Gis3d receipt";
			$headers = array();
			$headers[0] = "MIME-Version: 1.0";
			$headers[1] = "Content-type: text/plain; charset=utf-8";
			$headers[2] = "From: ".$owner." <".$owner."@".$owner.".net>";
			$headers[3] = "Reply-To: ".$owner." <".$owner_mail.">";
			$headers[4] = "Subject: {$subject}";
			$headers[5] = "X-Mailer: PHP/".phpversion();
			mail($email, $subject, implode("\r\n", $message), implode("\r\n", $headers));

			$subject = $email."'s Gis3d receipt";
			$message[2] = "email: ".$email;
			mail($owner_mail, $subject, implode("\r\n", $message), implode("\r\n", $headers));
			$io->setJson('wrapId', $creation->wrap_id);
		}
		break;
	case 'update':
		$id = $io->get('postOrGet', 'wrapId');
		$access_id = $io->get('postOrGet', 'accessId');
		$title = $io->get('postOrGet', 'title');
		$description = $io->get('postOrGet', 'description');
		$image = $io->get('postOrGet', 'image');
		$formula = $io->get('postOrGet', 'formula');
		if($id && $access_id) {
			$wrap_data = $wrap->getWrapById($id, $db->pdo);
			if(!$title) { $title = $wrap_data->title; }
			if(!$description) { $description = $wrap_data->description; }
			if(!$image) { $image = $wrap_data->image; }
			if(!$formula) { $formula = $wrap_data->formula; }
			$updateState = $wrap->updateWrapById(
				$id, $access_id, $title, $description, $image, $formula, $db->pdo
			);
		}
		$io->setJson('updateState', $updateState);
		break;
	default:
	case 'get':
		$wraps = $wrap->getWraps($db->pdo);
		$io->setJson('wraps', $wraps);
		break;
}

$db->disconnect();
$io->setJson('DatabaseError', $db->err);
$io->printJson();
?>
