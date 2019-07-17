<?php

$content = '
<p id="logo"><a target="_blank" href="http://ckeditor.com"><img class="img-responsive" src="' . $this->getAssetsUrl('logo.png') . '" width="340" height="116" alt="" /></a></p>
<br />
<ul>
	<li><a class="extern" target="_blank" href="http://ckeditor.com/">' . rex_i18n::msg('ckeditor_main_demo') . ' <i class="fa fa-external-link"></i></a></li>
	<li><a class="extern" target="_blank" href="http://ckeditor.com/addons/plugins/all">' . rex_i18n::msg('ckeditor_main_plugins') . ' <i class="fa fa-external-link"></i></a></li>
	<li><a class="extern" target="_blank" href="http://docs.ckeditor.com/">' . rex_i18n::msg('ckeditor_main_docs') . ' <i class="fa fa-external-link"></i></a></li>
</ul>';

$fragment = new rex_fragment();
$fragment->setVar('title', $this->i18n('main_title'), false);
$fragment->setVar('body', $content, false);
echo $fragment->parse('core/page/section.php');
