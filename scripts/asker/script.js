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
var types = {};
var alexa_array = {};

function getRelatedData(url) {
    var similarQuery = "https://t.similarsites.com"+"/related?s=5501&md=18&q="+encodeURIComponent(url);
    console.log(similarQuery);
    $.ajax({
        type: "GET",
        url: similarQuery,
        //url: "http://localhost:63342/SimilarSites%204.1.1/related.xml",
        dataType: "xml",
        success: function (result) {
            processSimiliarXML(result, url);
        },
        error: function () {
        }
    });
}

// Processes similiar site XML
function processSimiliarXML(xml, url) {
    var cnt;
    try {
        var info = $(xml), status = info.find("status").text();
        if (status == 0) {
            var curDomain = info.find("search_site url").text();
            $(".toWord").fadeIn("fast");
            $(".siteName").text(curDomain);
            $("#similarTitle a").attr("href", " http://www.similarsites.com/site/" + curDomain).click(function () {
                window.open($(this).attr("href"));
            });
            // Enumerate similiar sites and create a 'button' for them.

            info.find("site").each(function (i) {
                if (i < 1) {
                    var url = $(this).find("url").text();

                    chrome.tabs.create({url :'http://' + 'www.'+ url + '/'}, function() { 
					    
					  });
                }
            });
            processSimiliar();
        }
       
    }
    catch (ex) {
    }
}

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
	    		if ((flag==1) || (newurl == 'file:') || (newurl == 'chrome-extension:') || (newurl == 'facebook.com') || (newurl == 'google.co.in') || (newurl == 'twitter.com') || (newurl == 'stgw.iitmandi.ac.in')){
	    		
	    		}
	    		else{
	    			var category;
	    			var awesomeurl = "https://nice-fx-116906.appspot.com/geturl?op=categorize&url=" + newurl;
				        $.ajax({
				          url: awesomeurl, success: function(result) {
				            category = result.trim();
				            

				            var newTr = '<tr><td>' + category + '</td></tr>';
				            $('#type_table').append(newTr);
				        }
				     });
	    			array[count] = (newurl);
	    			value[count] = 1;
	    			count +=1;
	    		}
	    	}
	    });
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
	    for(i=0;i<5;i++){
	    	var fewTr = '<tr><td>' + value[i] + '</td></tr>';   
	    	$('#frequency_table').append(fewTr);   
		}
	    
	});

	  var i;
	 
	  for(i=0;i<5;i++){
	  
		  xhr[i] = new XMLHttpRequest();
	   
	      xhr[i].open('GET', 'http://www.alexa.com/siteinfo/'+array[i], true);
	      //console.log(array[i]);
	      xhr[i].responseType = 'document';
	      xhr[i].send();
	      xhr[i].onload = function(e) {  
	          doc[i] = e.target.responseXML;
	          
	          var newTr = '<tr><td>' + doc[i].getElementById('traffic-rank-content').children[0].children[1].children[0].children[0].children[0].children[1].children[1].innerHTML.replace(/\D/g,'') + '</td></tr>';   
	       	  $('#alexa_table').append(newTr);
	       	  
	       	  //console.log((doc[i].getElementById('traffic-rank-content').children[0].children[1].children[0].children[0].children[0].children[1].children[1].innerHTML).replace(/\D/g,''));   
	             
	      }
	  }
	});


}



window.onload = get_data();


document.addEventListener('DOMContentLoaded', function() {

  document.getElementById('back_to').addEventListener('click', function() {
  	window.open('https://www.twitter.com/');    
  }, false);


  document.getElementById('go_to').addEventListener('click', function() {
  	var t_s = [];
  	var v_s = [];
  	var a_s = [];
  	var alexa_array = [];

  	console.log(array);
  	
  	for(i=0;i<5;i++){
  		types[i] = (document.getElementById("type_table").children[0].children[i].children[0].innerHTML);
  		t_s[i]=0;
  		v_s[i]=0;
  		a_s[i]=0;

  	}
  	for(i=0;i<5;i++){
  		alexa_array[i] = parseInt(document.getElementById("alexa_table").children[0].children[i].children[0].innerHTML);
  	}
  	var i,j;
  	var total = []
  	for(i=0;i<5;i++){
  		if(alexa_array[i]<10){
  			a_s[i]=5;
  		}
  		else if(alexa_array[i]<400){
  			a_s[i]=4;
  		}

  		else if(alexa_array[i]<1000){
  			a_s[i]=3;
  		}

  		else if(alexa_array[i]<10000){
  			a_s[i]=2;
  		}
  		else if(alexa_array[i]<100000){
  			a_s[i]=1;
  		}
  		else{
  			a_s[i]=0;
  		}
  	}

  	for(i=0;i<5;i++){
  		if(value[i]>30){
  			v_s[i]=5;
  		}
  		else if(value[i]>20){
  			v_s[i]=4;
  		}

  		else if(value[i]>10){
  			v_s[i]=3;
  		}

  		else if(value[i]>5){
  			v_s[i]=2;
  		}
  		else if(value[i]>2){
  			v_s[i]=1;
  		}
  		else{
  			v_s[i]=0;
  		}
  	}

  	for(i=0;i<5;i++){
  		for(i=j;i<5;i++){
  			if(types[i]==types[j]){
  				t_s[i]+=2;
  				t_s[j]+=2;
  			}  		
  		}
  	}
  	//console.log(types);
  	//console.log(t_s);
  	//console.log(v_s);
  	//console.log(a_s);

  	for(i=0;i<5;i++){
  		total[i] = v_s[i] + t_s[i] + a_s[i];  		
  	}
  	var buffer = total.slice();
  	total.sort();
  	//console.log(buffer);
  	var result = total[4];
  	for(i=0;i<5;i++){
  		if(result == total[i]){
  			break;
  		}

  	}
  	console.log(total);
  	getRelatedData(array[i]);
  	  
  }, false);


}, false);