function getCookieVal(offset) {
  var endstr=document.cookie.indexOf (";", offset);
  if (endstr==-1) endstr=document.cookie.length;
  return unescape(document.cookie.substring(offset, endstr));
}
function GetCookie (name) {
  var arg=name+"=";
  var alen=arg.length;
  var clen=document.cookie.length;
  var i=0;
  while (i<clen) {
    var j=i+alen;
    if (document.cookie.substring(i, j)==arg) return getCookieVal (j);
    i=document.cookie.indexOf(" ",i)+1;
    if (i==0) break;
  }
  return null;
}

function Logout (){
  console.log("logout");
  document.cookie = "idUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";  
  document.location.href="./index.html";
}

function dateAujourdhui (){
  var date =  new Date();
  console.log(date + " / "+date.getDate());
  var dateString = "";
  if (date.getDate()<10) dateString = dateString+"0";
  dateString = dateString + date.getDate() + "/";
  var mois = date.getMonth()+1;
  if (mois<10) dateString = dateString+"0";
  dateString = dateString + mois + "/";
  dateString = dateString + date.getFullYear();
  
  return dateString;
}