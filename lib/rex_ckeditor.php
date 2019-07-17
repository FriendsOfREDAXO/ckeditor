<?php
class rex_ckeditor {
	const CKEDITOR_PROFILE_FILE = 'profiles.dyn.js';

	public static function applyPatches() {
		// anti flicker patch
		$contentsCSSFile = file_get_contents(rex_path::addonAssets('ckeditor', 'vendor/contents.css'));

		$regex = array(
		"`^([\t\s]+)`ism"=>'',
		"`^\/\*(.+?)\*\/`ism"=>"",
		"`([\n\A;]+)\/\*(.+?)\*\/`ism"=>"$1",
		"`([\n\A;\s]+)//(.+?)[\n\r]`ism"=>"$1\n",
		"`(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+`ism"=>"\n"
		);
		$buffer = preg_replace(array_keys($regex), $regex, $contentsCSSFile);
		$buffer = preg_replace("/[\r\n]+/", "\n", $buffer);
		$buffer = preg_replace("/\s+/", ' ', $buffer);
		$buffer = str_replace('"', '\'', $buffer);
		$buffer = str_replace('font-size: 12px;', 'font-size: 13px !important; line-height: 1.6;', $buffer);

		$jsFile = rex_path::addonAssets('ckeditor', 'vendor/ckeditor.js');
		$ckjs = file_get_contents($jsFile);
		//$ckjs = str_replace('a.push("html{cursor:text;*cursor:auto}");', 'a.push("html{cursor:text;*cursor:auto}body{font-family: sans-serif, Arial, Verdana;font-size:13px !important;color: #333;background-color: #fff;margin: 20px;line-height: 1.6em;}a{color: #0782C1;font-weight:normal;}ol,ul,dl {*margin-right: 0px; padding: 0 40px; }h1,h2,h3,h4,h5,h6 { font-weight: normal; line-height: 1.2em;}");', $ckjs);

		// margin for images
		$buffer = 'img { margin: 0 0 10px 0; } img[style*=\'left\'] { margin-right: 15px; } img[style*=\'right\'] { margin-left: 15px; }' . $buffer;

		// table 100% width
		$buffer = 'table { width: 100%; }' . $buffer;

		$ckjs = str_replace('a.push("html{cursor:text;*cursor:auto}");', 'a.push("html{cursor:text;*cursor:auto}' . $buffer . '");', $ckjs);
		file_put_contents($jsFile, $ckjs);

		// copy extra plugins
		rex_dir::copy(rex_path::addon('ckeditor', 'install/plugins'), rex_path::addonAssets('ckeditor', 'vendor/plugins'));

		// copy extra plugins from project addon
		$extraPluginsPath = rex_path::addon('project', 'install/ckeditor/plugins');

		if (file_exists($extraPluginsPath)) {
			rex_dir::copy($extraPluginsPath, rex_path::addonAssets('ckeditor', 'vendor/plugins'));
		}

		// write profile file
		rex_ckeditor::writeProfileJSFile();
	}

	public static function writeProfileJSFile() {
		$profileFile = self::getAbsoluteProfileJSFile();

		$sql = rex_sql::factory();
		$result = $sql->setQuery("SELECT `name`, `jscode`, `smartstrip` FROM `" . rex::getTablePrefix() . "ckeditor_profiles` ORDER BY `id` ASC")->getArray();

		$jsCode = "
			/* THIS FILE IS CREATE DYNAMICALLY BY rex_ckeditor::writeProfileJSFile() PHP METHOD. DON'T TOUCH! */

			var ckDefaultProfileName = '';
			var ckProfiles = {};
			var ckSmartStripSettings = {};
			var ckRexHelpPluginAvailable = true;" . PHP_EOL . PHP_EOL;

		foreach ($result as $row) {
			$jsCode .= "ckProfiles['" . $row['name'] . "'] = " . $row['jscode'] . ";" . PHP_EOL . PHP_EOL;
			$jsCode .= "ckSmartStripSettings['" . $row['name'] . "'] = " . $row['smartstrip'] . ";". PHP_EOL . PHP_EOL;
		}

		if (isset($result[0])) {
			$ckDefaultProfileName = $result[0]['name'];
		} else {
			$ckDefaultProfileName = '';
		}

		$jsCode .= "ckDefaultProfileName = '" . $ckDefaultProfileName . "';". PHP_EOL . PHP_EOL;

		$rexHelpPluginFile = rex_path::addonAssets('ckeditor') . 'vendor/plugins/rex_help/plugin.js';

		if (!file_exists($rexHelpPluginFile)) {
			// try to copy extra plugins again
			rex_dir::copy(rex_path::addon('ckeditor', 'install/plugins'), rex_path::addonAssets('ckeditor', 'vendor/plugins'));
		}

		if (file_exists($rexHelpPluginFile)) { // if user updates assets without reinstall missing rex_help plugin will create js error
			$jsCode .= "ckRexHelpPluginAvailable = true;". PHP_EOL . PHP_EOL;
		} else {
			$jsCode .= "ckRexHelpPluginAvailable = false;". PHP_EOL . PHP_EOL;
		}

		if (file_put_contents($profileFile, $jsCode) === false) {
			throw new Exception('File "' . $profileFile . '" could not be written! Check if server permissions are set correctly.');
		}
	}

	public static function getProfiles() {
		$sql = rex_sql::factory();
		$result = $sql->setQuery("SELECT id, name FROM " . rex::getTablePrefix() . "ckeditor_profiles ");

		$profiles = [];
		for($i = 0; $i < $result->getRows(); $i++) {
			$profiles[$result->getValue("id")] = $result->getValue("name");
			$result->next();
		}
		return $profiles;
	}
	
	public static function getRelativeProfileJSFile() {
		return rex_url::addonAssets('ckeditor', self::CKEDITOR_PROFILE_FILE);
	}

	public static function getAbsoluteProfileJSFile() {
		return rex_path::addonAssets('ckeditor', self::CKEDITOR_PROFILE_FILE);		
	}

	public static function replaceImageTags($html, $mediaType) {
		return preg_replace_callback("/(<img[^>]*src *= *[\"']?)([^\"']*)/i", function($matches) use ($mediaType) {
			$mediaFile = basename($matches[2]);
			
			if (method_exists('rexx','getManagedMediaFile')) {
				$src = rexx::getManagedMediaFile($mediaFile, $mediaType);
			} else {
				$src = '/index.php?rex_media_type=' . $mediaType . '&amp;rex_media_file=' . $mediaFile;
			}

			return $matches[1] . $src;
		}, $html);
	}
	
	public static function insertProfile ($name, $description = '', $jscode = '', $smartstrip = '1') {
		$sql = rex_sql::factory();
		$sql->setTable(rex::getTablePrefix().'ckeditor_profiles');
		$sql->setValue('name', $name);
		$sql->setValue('description', $description);
		$sql->setValue('jscode', $jscode);
		$sql->setValue('smartstrip', $smartstrip);
		
		try {
			$sql->insert();
			return $sql->getLastId();
		} catch (rex_sql_exception $e) {
			return $e->getMessage();
		}
		rex_ckeditor::writeProfileJSFile();
	}

	public static function profileExists($name) {
		$sql = rex_sql::factory();
		$profile = $sql->setQuery("SELECT name FROM " . rex::getTablePrefix() . "ckeditor_profiles WHERE name = " . $sql->escape($name) . "")->getArray();
		unset($sql);

		if (!empty($profile)) {
			return true;
		} else {
			return false;
		}
	}
}
