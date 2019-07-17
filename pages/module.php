<?php

$moduleInput = rex_file::get(rex_path::addon('ckeditor') . "module/input.php");
$moduleOutput = rex_file::get(rex_path::addon('ckeditor') . "module/output.php");

$content = '
<p class="headline">' . rex_i18n::msg('ckeditor_module_input') . '</p><pre class="rex-code"><code>' . rex_ckeditor_parsedown::highlight($moduleInput) . '</code></pre>
<br />
<p class="headline">' . rex_i18n::msg('ckeditor_module_output') . '</p><pre class="rex-code"><code>' . rex_ckeditor_parsedown::highlight($moduleOutput). '</code></pre>';

$fragment = new rex_fragment();
$fragment->setVar('title', $this->i18n('module'), false);
$fragment->setVar('body', $content, false);
echo $fragment->parse('core/page/section.php');
