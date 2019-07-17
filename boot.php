<?php
if (rex::isBackend() && rex::getUser() instanceof rex_user) {
	if ($this->getConfig('patches_applied') == 0) {
		// apply patches
		rex_ckeditor::applyPatches();

		$this->setConfig('patches_applied', 1);
	}

	if (!file_exists(rex_ckeditor::getAbsoluteProfileJSFile())) {
		rex_ckeditor::writeProfileJSFile();
	}
	
	rex_view::addJsFile($this->getAssetsUrl('vendor/ckeditor.js'));
	rex_view::addJsFile(rex_ckeditor::getRelativeProfileJSFile());
	rex_view::addJsFile($this->getAssetsUrl('redaxo.js'));
	rex_view::addCssFile($this->getAssetsUrl('backend.css'));

	rex_extension::register('CACHE_DELETED', function () {
		rex_ckeditor::writeProfileJSFile();
	});

	rex_extension::register('BACKUP_AFTER_DB_IMPORT', function () {
		rex_ckeditor::writeProfileJSFile();
	});
}


