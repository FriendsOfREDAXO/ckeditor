CKEDITOR.replaceClass = '';


//CKEDITOR LINKMAP/MEDIAPOOL CONNECT
function rex_ckeditor_get_link_from_linkmap() {
  var linkMap = openLinkMap();

  $(linkMap).on('rex:selectLink', function (e, linkurl, linktext) {
    e.preventDefault();
    linkMap.close();

    jQuery('.rex-url input').val(linkurl);
    jQuery('.rex-protocol option:last').prop('selected', true);
  });
}

function rex_ckeditor_get_link_from_mediapool() {
  var mediapool = openMediaPool('ckeditor_medialink');

  $(mediapool).on('rex:selectMedia', function (e, filename) {
    e.preventDefault();
    mediapool.close();

    jQuery('.rex-url input').val("/media/" + filename);
    jQuery('.rex-protocol option:last').prop('selected', true); // only for link dialog
  });
}


//CKEDITOR MBLOCK / GRIDBLOCK COMPAT
$(document).on('rex:ready', function (e, container) {

	container.find('.ckeditor').each(function(){
		
		//init only new editor instances
		ckid = $(this).attr('id');
		instance = CKEDITOR.instances[ckid];

		if (!instance) {
			rex_ckeditor_init($(this));
		}
	});
  
  
	// dialog changes
	CKEDITOR.on('dialogDefinition', function(ev) {
	var dialogName 	= ev.data.name;
	var dialogTabs 	= ev.data.definition;
	
	
	// Scroll-Up Fix
	dialogObj	= ev.data.definition.dialog;
		dialogObj.on('show', function(){ jQuery('html').addClass('cke_dialog_open'); });
		dialogObj.on('hide', function(){ jQuery('html').removeClass('cke_dialog_open'); });
	

    // Plugin image ///////////////////////////////////////////////////////
    if (dialogName == 'image') {
      var infoTab = dialogTabs.getContents('info');
      var urlField = infoTab.get('txtUrl');
      urlField['className'] = 'rex-url';

      infoTab.remove('htmlPreview');
      infoTab.remove('medialink');
      infoTab.add({
        type: 'button',
        id: 'medialink',
        label: 'Medienpool Link',
        align: 'center',
        style: 'display:inline-block; position: absolute; right: 23px; top: 116px;',
        onClick: function () {
          rex_ckeditor_get_link_from_mediapool();
        }
      });
    } //endif

    // Plugin link /////////////////////////////////////////////////////////
    if (dialogName == 'link') {

      // auf das Tab 'info' bezogen
      var infoTab = dialogTabs.getContents('info');
      // Entfernen da nicht kompatibel mit Email Obfuscator
      infoTab.remove('emailSubject');
      infoTab.remove('emailBody');
      var linkType = infoTab.get('linkType');
      linkType['items'] = [ // unwichtig - nur Reihenfolge geändert
        ['URL', 'url'], //###lang
        ['E-Mail', 'email'], //###lang
        ['Anker in diesem Block', 'anchor'] //###lang
      ];
      var protocol = infoTab.get('protocol');
      protocol['className'] = 'rex-protocol';
      protocol['items'] = [
        ['http://\u200E', 'http://'],
        ['https://\u200E', 'https://'],
        ['<andere>', ''] //###lang
      ];
      var url = infoTab.get('url');
      url['className'] = 'rex-url';
      url['onKeyUp'] = function () {
        this.allowOnChange = false;
        var protocolCmb = this.getDialog().getContentElement('info', 'protocol'),
          url = this.getValue(),
          urlOnChangeProtocol = /^(http|https):\/\/(?=.)/i,
          urlOnChangeTestOther = /^((redaxo|files)|[#\/\.\?])/i;
        var protocol = urlOnChangeProtocol.exec(url);
        if (protocol) {
          this.setValue(url.substr(protocol[0].length));
          protocolCmb.setValue(protocol[0].toLowerCase());
        } else if (urlOnChangeTestOther.test(url))
          protocolCmb.setValue('');
        this.allowOnChange = true;
      };
      infoTab.remove('urlOptions');
      infoTab.add({
        type: 'vbox',
        id: 'urlOptions',
        children: [{
          type: 'hbox',
          widths: ['25%', '75%'],
          children: [{
            id: 'protocol',
            type: 'select',
            className: 'rex-protocol',
            label: 'Protokoll', //###lang
            'default': 'http://',
            items: [
              // Force 'ltr' for protocol names in BIDI. (#5433)
              ['http://\u200E', 'http://'],
              ['https://\u200E', 'https://'],
              ['<andere>', ''] //###lang
            ],
            setup: function (data) {
              if (data.url)
                this.setValue(data.url.protocol || '');
            },
            commit: function (data) {
              if (!data.url)
                data.url = {};

              data.url.protocol = this.getValue();
            }
          }, {
            type: 'text',
            id: 'url',
            label: 'URL', //###lang
            required: true,
            className: 'rex-url',
            onLoad: function () {
              this.allowOnChange = true;
            },
            onKeyUp: function () {
              this.allowOnChange = false;
              var protocolCmb = this.getDialog().getContentElement('info', 'protocol'),
                url = this.getValue(),
                urlOnChangeProtocol = /^(http|https):\/\/(?=.)/i,
                urlOnChangeTestOther = /^((redaxo|files)|[#\/\.\?])/i;

              var protocol = urlOnChangeProtocol.exec(url);
              if (protocol) {
                this.setValue(url.substr(protocol[0].length));
                protocolCmb.setValue(protocol[0].toLowerCase());
              } else if (urlOnChangeTestOther.test(url))
                protocolCmb.setValue('');

              this.allowOnChange = true;
            },
            onChange: function () {
              if (this.allowOnChange) // Dont't call on dialog load.
                this.onKeyUp();
            },
            validate: function () {
              var dialog = this.getDialog();

              if (dialog.getContentElement('info', 'linkType') && dialog.getValueOf('info', 'linkType') != 'url')
                return true;

              if ((/javascript\:/).test(this.getValue())) {
                alert('ungültiger Wert'); //###lang
                return false;
              }

              if (this.getDialog().fakeObj) // Edit Anchor.
                return true;

              var func = CKEDITOR.dialog.validate.notEmpty('URL fehlt'); //###lang
              return func.apply(this);
            },
            setup: function (data) {
              this.allowOnChange = false;
              if (data.url)
                this.setValue(data.url.url);
              this.allowOnChange = true;

            },
            commit: function (data) {
              // IE will not trigger the onChange event if the mouse has been used
              // to carry all the operations #4724
              this.onChange();

              if (!data.url)
                data.url = {};

              data.url.url = this.getValue();
              this.allowOnChange = false;
            }
          }],
          setup: function (data) {
            if (!this.getDialog().getContentElement('info', 'linkType'))
              this.getElement().show();
          }
        }, {
          type: 'button',
          id: 'internallink',
          label: 'Interner Link',
          style: 'float : right;',
          onClick: function () {
            rex_ckeditor_get_link_from_linkmap();

          }
        }, {
          type: 'button',
          id: 'medialink',
          label: 'Medienpool Link',
          style: 'float : right;',
          onClick: function () {
            rex_ckeditor_get_link_from_mediapool();
          }
        }]
      });
      // auf das Tab 'target' bezogen
      var targetTab = dialogTabs.getContents('target');
      var linkTargetType = targetTab.get('linkTargetType');
      linkTargetType['items'] = [
        ['normal', 'notSet'],
        ['neues Fenster', '_blank']
      ];
    } //endif
  }); // end dialogDefinition
});

function rex_ckeditor_init(element) {
  if (!element.next().hasClass('ckeditor')) {

    let unique_id = 'ckeditor' + Math.random().toString(16).slice(2);
    element.attr('id', unique_id);
	
	
    // set config object
    if (element.attr('data-ckeditor-profile') && element.attr('data-ckeditor-profile') in ckProfiles) {
      currentProfileName = element.attr('data-ckeditor-profile');
    } else {
      currentProfileName = ckDefaultProfileName;
    }

    currentEditorConfig = ckProfiles[currentProfileName];

    // add smart strip class
    if (ckSmartStripSettings[currentProfileName] === 1) {
      element.addClass('ckeditor-smartstrip');
    }

    // overwrite height if necessary
    if (element.attr('data-ckeditor-height')) {
      currentEditorConfig.height = element.attr('data-ckeditor-height');
    }

    // make sure rex_help is available otherwise js error       
    if (ckRexHelpPluginAvailable) {
      currentEditorConfig.extraPlugins = currentEditorConfig.extraPlugins + ',rex_help';
    } else {
      currentEditorConfig.extraPlugins = currentEditorConfig.extraPlugins.replace(/rex_help/g, '');
    }
	

    // init editor
    editor = document.getElementById(unique_id);
    CKEDITOR.replace(editor, currentEditorConfig);
	

    // smart strip/
    $('form').submit(function () {
      if ($('.ckeditor-smartstrip').length) {
        var data = CKEDITOR.instances[unique_id].getData();
        var doDataUpdate = false;

        // replace &nbsp;
        if (data.indexOf("&nbsp;") != -1) {
          data = data.replace(/&nbsp;/g, "  ");
          doDataUpdate = true;
        }

        // replace multiple <br>s with a single one
        if (data.indexOf("<br />\n<br />") != -1 || data.indexOf("<br />\r\n<br />") != -1 || data.indexOf("<br /><br />") != -1) {
          data = data.replace(/(<br\s*\/?>\s*)+/igm, "<br />\n");
          doDataUpdate = true;
        }

        // replace leading <br>s
        if (data.match(/(<(?!br)(\w)[^>]*>)(\s*<br\s*\/?>\s*)+/igm)) {
          data = data.replace(/(<(?!br)(\w)[^>]*>)(\s*<br\s*\/?>\s*)+/igm, '$1');
          doDataUpdate = true;
        }

        // replace trailing <br>s
        if (data.match(/(\s*<br\s*\/?>\s*)+(<\/(?!br)(\w)>)/igm)) {
          data = data.replace(/(\s*<br\s*\/?>\s*)+(<\/(?!br)(\w)>)/igm, '$2');
          doDataUpdate = true;
        }

        // replace empty paragraphs
        if (data.match(/(<p[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>)/igm)) {
          data = data.replace(/(<p[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/p>)/igm, '');
          doDataUpdate = true;
        }

        if (doDataUpdate) {
          CKEDITOR.instances[unique_id].setData(data);
        }

        return true;
      }

    });
  }
}

$(document).on('rex:change', function (e, container) {	
 	container.parent('div').find('textarea.ckeditor').each(function(){
 		let ed = $(this).next('.cke');		
 		if (ed.length > 0) {
 			let id = $(ed).attr('id').replace('cke_', '');	
 						
 			CKEDITOR.instances[id].destroy();
 			rex_ckeditor_init($(this));
 		}
 	})
});