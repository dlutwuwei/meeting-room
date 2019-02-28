
function generateOptions(length, include) {
    const arr = [];
    for (let value = 0; value < length; value++) {
        if (include(value)) {
            arr.push(value);
        }
    }
    return arr;
}

function getQuery(name, search = (window.location && window.location.search.substr(1))) {
    const queries = {};
    search && search.split('&').forEach((c) => {
        if (c === '') {
            return;
        }

        const [key, value = ''] = c.split('=');
        queries[decodeURIComponent(key)] = value === '' ? true : decodeURIComponent(value);
    });
    return name ? queries[name] : queries;
}

function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

function dispatchEvent(event, data) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(event, true, true);
    evt.data = data;
    document.dispatchEvent(evt);
}

export {
    generateOptions,
    getQuery,
    setCookie,
    getCookie,
    dispatchEvent
}

//定义函数
window.Clipboard = (function(window, document, navigator) {
    var textArea,
        copy;
  
    // 判断是不是ios端
    function isOS() {
      return navigator.userAgent.match(/ipad|iphone/i);
    }
    //创建文本元素
    function createTextArea(text) {
      textArea = document.createElement('textArea');
      textArea.value = text;
      document.body.appendChild(textArea);
    }
    //选择内容
    function selectText() {
      var range,
          selection;
  
      if (isOS()) {
        range = document.createRange();
        range.selectNodeContents(textArea);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
      }
    }
  
  //复制到剪贴板
    function copyToClipboard() {        
      try{
        if(document.execCommand("Copy")){
          alert("复制成功！");  
        }else{
          alert("复制失败！请手动复制！");
        }
      }catch(err){
        alert("复制错误！请手动复制！")
      }
      document.body.removeChild(textArea);
    }
  
    copy = function(text) {
      createTextArea(text);
      selectText();
      copyToClipboard();
    };
  
    return {
      copy: copy
    };
  })(window, document, navigator);
 