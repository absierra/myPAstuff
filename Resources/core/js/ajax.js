function Ajax(target, fun) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      fun(this.responseText);
    }
  }
  xhr.open("GET",target,true);
  xhr.send();
}
