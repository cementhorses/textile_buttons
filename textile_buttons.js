function getNoLines(element) {
  var hardlines = element.value.split('\n');
  var total = hardlines.length;
  for (var i = 0, len = hardlines.length; i < len; i++) {
    total += Math.max(Math.round(hardlines[i].length / element.cols), 1) - 1;
  }
  return total;
}

function expandoCheck(element) {
  var lines = getNoLines(element);
  var aMaxSetting = parseInt(element.rows) * 0.9;
  var aMinSetting = parseInt(element.rows) * 0.6;
    
  if (((lines > aMaxSetting) || (lines < aMinSetting)) && lines > 16)
    element.rows = '' + (parseInt(getNoLines(element)) + 6);
}

function insertTextile(field, prefix, suffix) {   
  var selection;
  field = $(field);
  field.focus();
  
  // IE preliminary support
  if (document.selection) {
    selection = document.selection.createRange();
    var selectionText = (selection.text == '') ? 'enter text':selection.text;
    
	if (prefix.match(/\n[*]/) || prefix.match(/\n1[.]/)) {
		selectionText = selectionText.replace(/(\r\n|\n)/g, prefix);
		var duplicate = selection.duplicate();
		duplicate.moveStart('character', -1);
		prefix = (duplicate.text.match(/^(\r\n|\n)/)) ? prefix.replace(/(\r\n|\n)/, ''):prefix;
	}

    selection.text = prefix + selectionText + suffix;
  }
  
  // The rest
  if (field.selectionStart || field.selectionStart == '0') {
    var startSelection = field.selectionStart;
    var endSelection = field.selectionEnd;
    var selectionLength = endSelection - startSelection;
    var preSelection = field.value.substring(0, startSelection)
    var postSelection = field.value.substring(endSelection, field.value.length);
      
    if (typeof(selection) == 'undefined')
      selection = field.value.substring(startSelection, endSelection);
    
    if (prefix[0] == '\n' && prefix[prefix.length] != ' ' && preSelection[preSelection.length] != '\n' && !prefix.match(/\n[*]/) && !prefix.match(/\n1[.]/)) {
      var continuation;
      for(i = preSelection.length; (i >= 0 && preSelection[i] != '\n'); i--) {
        if(preSelection[i] == prefix[1]) {
          var newLineCheck = i - 1
          if(newLineCheck == 0 || preSelection[newLineCheck] == '\n')
            continuation = true;
        }
      }
      if (!continuation)
        prefix = '\n' + prefix;
    } else if (prefix.match(/\n[*]/) || prefix.match(/\n1[.]/)) {
		selection = selection.replace(/(\r\n|\n)/g, prefix);
		if (preSelection.substring(preSelection.length, 1).match(/(\r\n|\n)/)) {
			prefix = prefix.replace(/\n/, '');
		}
	}
        
    if (startSelection == endSelection) {
      var insertText = 'enter text'
      field.value = preSelection + prefix + insertText + suffix + postSelection;
      var startPoint = preSelection.length + prefix.length;
      var endPoint = preSelection.length + prefix.length + insertText.length;
    } else {
     field.value = preSelection + prefix + selection + suffix + postSelection;
     var startPoint = preSelection.length + prefix.length + selectionLength + suffix.length;
     var endPoint = startPoint;
    }
    
    field.blur(); field.focus(); // Reload preview
    field.setSelectionRange(startPoint, endPoint);
  }
}

function insertTextileLink(field, external) {
  var linkUrl = prompt('Please enter the address:', 'http://');
  if (linkUrl == null)
    return;
  else if (external)
    insertTextile(field, '<a href="' + linkUrl + '" target="_blank">', '</a>');
  else
    insertTextile(field, '"', '":' + linkUrl);
}