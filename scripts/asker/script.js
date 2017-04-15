chrome.windows.getAll({populate:true},function(windows){
  windows.forEach(function(window){
    window.tabs.forEach(function(tab){
      if(tab.url == 'https://twitter.com/'){
      	chrome.tabs.remove(tab.id, function() { });
      }
    });
  });
});

var value = [];
var xhr = [];
var doc = [];
var array = {};

function get_data(){
	var count=0;
  	var i = 0;
    chrome.history.search({text: '', maxResults: 50}, function(data) {
	    data.forEach(function(page) {
	    	if(count==5){
	    		return;
	    	}
	    	else{
	    		var urlNoProtocol = page.url.replace(/^https?\:\/\//i, "");
	    		var newurl = urlNoProtocol.replace('www.', "");
	    		newurl = newurl.substring(0, newurl.indexOf('/'));
	    		var flag=0;
	    		for(i=0;i<count;i++){
	    			if(array[i]==newurl){
	    				flag=1;
	    				break;
	    			}

	    		}
	    		if ((flag==1) || (newurl == 'chrome-extension:') || (newurl == 'facebook.com') || (newurl == 'google.co.in')){
	    		
	    		}
	    		else{
	    			
	    			array[count] = (newurl);
	    			value[count] = 1;
	    			count +=1;
	    		}
	    	}
	    });
	  
	});

}

/*
function get_alexa(){
	get_data();
	console.log(array[0]);
	var i;
	/*for(i=0;i<2;i++){
	  
	  xhr[i] = new XMLHttpRequest();
   
      xhr[i].open('GET', 'http://www.alexa.com/siteinfo/'+array[i], true);
      //console.log(array[i]);
      xhr[i].responseType = 'document';
      xhr[i].send();
      xhr[i].onload = function(e) {  
          doc[i] = e.target.responseXML;
          
          value[i] = ((doc[i].getElementById('traffic-rank-content').children[0].children[1].children[0].children[0].children[0].children[1].children[1].innerHTML).replace(/\D/g,''));   
      
      }
	}

}*/

window.onload = get_data();


document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('back_to').addEventListener('click', function() {
  	window.open('https://www.twitter.com/');    
  }, false);


  document.getElementById('go_to').addEventListener('click', function() {
  	var i = 0;
    chrome.history.search({text: '', maxResults: 200}, function(data) {
	    data.forEach(function(page) {
	    	
    		var urlNoProtocol = page.url.replace(/^https?\:\/\//i, "");
    		var newurl = urlNoProtocol.replace('www.', "");
    		newurl = newurl.substring(0, newurl.indexOf('/'));
    		var flag=0;
    		for(i=0;i<5;i++){
    			if(array[i]==newurl){
    				value[i] +=1;
    			}

    		}
    		
	    });
	    console.log(value);  
	    console.log(array);
	});
  	
	/*for(i=0;i<2;i++){
	  
	  xhr[i] = new XMLHttpRequest();
   
      xhr[i].open('GET', 'http://www.alexa.com/siteinfo/'+array.i, true);
      console.log(array.i);
      xhr[i].responseType = 'document';
      xhr[i].send();
      xhr[i].onload = function(e) {  
          doc[i] = e.target.responseXML;
          
          value[i] = ((doc[i].getElementById('traffic-rank-content').children[0].children[1].children[0].children[0].children[0].children[1].children[1].innerHTML).replace(/\D/g,''));   
      
      }
	}*/


  }, false);

}, false);