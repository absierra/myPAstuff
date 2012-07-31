// Automatically attach a listener to the window onload, to convert the trees
//addEvent(window,"load",convertTrees);

// Utility function to add an event listener
//function addEvent(o,e,f){
//  if (o.addEventListener){ o.addEventListener(e,f,false); return true; }
//  else if (o.attachEvent){ return o.attachEvent("on"+e,f); }
//  else { return false; }
//}

// utility function to set a global variable if it is not already set
function setDefault(name,val) {
  if (typeof(window[name])=="undefined" || window[name]==null) {
    window[name]=val;
  }
}

// Full expands a tree with a given ID
function expandTree(treeId) {
  var ul = document.getElementById(treeId);
  if (ul == null) { return false; }
  expandCollapseList(ul,nodeOpenClass,null,null);
}

function alertTree() {
  alert("derp");
}

// Fully collapses a tree with a given ID
function collapseTree(treeId) {
  var ul = document.getElementById(treeId);
  if (ul == null) { return false; }
  expandCollapseList(ul,nodeClosedClass,nodeOpenClass,null,null);
}

// Expands enough nodes to expose an LI with a given ID
function expandToItem(treeId,itemId,nameId) {
  var ul = document.getElementById(treeId);
  if (ul == null) { return false; }
  var ret = expandCollapseList(ul,nodeOpenClass,nodeClosedClass,itemId,nameId);
  if (false) {
    var o = document.getElementByName(itemId);
    /*for (var i=0;i<o.length;i++) {
   	 if (o[i].scrollIntoView) {
   	   o[i].scrollIntoView(false);
   	 }
    }*/
    if (o.scrollIntoView) {
   	 o.scrollIntoView(false);
    }
  }
}

// Performs 4 functions:
// a) Expand all nodes
// b) Collapse all nodes
// c) Expand all nodes to reach a certain ID
// d) Expand all nodes to reach a certain name
function expandCollapseList(ul,cName,cNamePrev,itemId,itemName) {
  if (!ul.childNodes || ul.childNodes.length==0) { return false; }
  // Iterate LIs
  for (var itemi=0;itemi<ul.childNodes.length;itemi++) {
    var item = ul.childNodes[itemi];
    item = $(item);
    if (itemId!=null && item.id==itemId) { return true; }
    if (itemName!=null && item.hasClass(itemName)) { return true; }
    if (item.nodeName == "LI") {
      // Iterate things in this LI
      var subLists = false;
      for (var sitemi=0;sitemi<item.childNodes.length;sitemi++) {
        var sitem = item.childNodes[sitemi];
        if (sitem.nodeName=="UL") {
          subLists = true;
          var ret = expandCollapseList(sitem,cName,cNamePrev,itemId,itemName);
          if ((itemId!=null || itemName!=null) && ret) {
            item.removeClass(cNamePrev);
            item.addClass(cName);
            if (itemId!=null) { return true; }
          }
        }
      }
      if (subLists && itemId==null && itemName==null) {
        item.removeClass(cNamePrev);
        item.addClass(cName);
      }
    }
  }
  return true;
}

// Search the document for UL elements with the correct CLASS name, then process them
function convertTrees() {
  setDefault("treeClass","mktree");
  setDefault("nodeClosedClass","liClosed");
  setDefault("nodeOpenClass","liOpen");
  setDefault("nodeBulletClass","liBullet");
  setDefault("nodeLinkClass","bullet");
  setDefault("preProcessTrees",true);
  if (preProcessTrees) {
    if (!document.createElement) { return; } // Without createElement, we can't do anything
    var uls = document.getElementsByTagName("ul");
    if (uls==null) { return; }
    var uls_length = uls.length;
    //added
    $$('input[type=checkbox]').addEvent('click',markBox);
    for (var uli=0;uli<uls_length;uli++) {
      var ul=uls[uli];
      if (ul.nodeName=="UL" && $(ul).hasClass(treeClass)) {
        processList(ul);
      }
    }
  }
}

function treeNodeOnclick() {
  var node = this.parentNode;
  node = $(node);
  if ($(node).hasClass(nodeOpenClass)) {
  	node.removeClass(nodeOpenClass);
  	node.addClass(nodeClosedClass);
  }else {
  	node.removeClass(nodeClosedClass);
  	node.addClass(nodeOpenClass);
  }
  return false;
}
function retFalse() {
  return false;
}
// Process a UL tag and all its children, to convert to a tree
function processList(ul) {
  if (!ul.childNodes || ul.childNodes.length==0) { return; }
  // Iterate LIs
  var childNodesLength = ul.childNodes.length;
  for (var itemi=0;itemi<childNodesLength;itemi++) {
    var item = ul.childNodes[itemi];
    item = $(item);
    if (item.nodeName == "LI") {
      // Iterate things in this LI
      var subLists = false;
      var itemChildNodesLength = item.childNodes.length;
      for (var sitemi=0;sitemi<itemChildNodesLength;sitemi++) {
        var sitem = item.childNodes[sitemi];
        if (sitem.nodeName=="UL") {
          subLists = true;
          processList(sitem);
        }
      }
      var s= document.createElement("SPAN");
      var t= '\u00A0'; // &nbsp;
      s.className = nodeLinkClass;
      if (subLists) {
        // This LI has UL's in it, so it's a +/- node
        //if (item.className==null || item.className=="") {
        if (!item.hasClass(nodeClosedClass)) {
          item.addClass(nodeClosedClass);
        }
        // If it's just text, make the text work as the link also
        if (item.firstChild.nodeName=="#text") {
          t = t+item.firstChild.nodeValue;
          item.removeChild(item.firstChild);
        }
        s.onclick = treeNodeOnclick;
      }
      else {
        // No sublists, so it's just a bullet node
        item.addClass(nodeBulletClass);
        s.onclick = retFalse;
      }
      s.appendChild(document.createTextNode(t));
      item.insertBefore(s,item.firstChild);
    }
  }
}

function addButtons(divId, tree, level) {
	var div1 = document.getElementById(divId);
	var buttonnode= document.createElement('input');
	buttonnode.setAttribute('type','button');
	buttonnode.setAttribute('name',''+level);
	buttonnode.setAttribute('value','Expand to level '+level);
	buttonnode.onclick = function() {
		collapseTree(tree);
		expandToItem(tree, null ,level);
	};
	div1.appendChild(buttonnode);
}

function markBox() {
	var displayDiv = $('displayDiv');
	var parent = $(this).getParent();
	var toAdd = parent.getElements('[name=num]');
	var sum = 0;
	Array.each(toAdd, function(item, index) { sum = sum + Number.from(item.get('text')); });
	if (document.getElementById("DISPLAYDIV:"+parent.get('id')) == null) {
		var newData = new Element('p', {text: parent.get('id')+": "+sum, id: "DISPLAYDIV:"+parent.get('id')});
		displayDiv.adopt(newData);
	}else {
		$("DISPLAYDIV:"+parent.get('id')).destroy();
	}
}

function mooTest() {
	var foo = $('tree1');
	$(foo).addClass('TEST');
	return $(foo).hasClass('TEST');
}





