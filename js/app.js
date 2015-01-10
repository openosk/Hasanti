var page=1;
var jokes="";
var action="getJokesByCategory";
var category=0;
  $(document).on('pageinit','#splash',function(){ // the .on() method does require jQuery 1.7 + but this will allow you to have the contained code only run when the #splash page is initialized.
      setTimeout(function(){
         $.mobile.changePage("#home", "fade");
      }, 2000);
  });
    function getJokesByCategory(cat_id,page=1){
      //alert('feed refreshed');
       //Show loading message
      $.mobile.loading( 'show', {
        text: 'Loading jokes...',
        textVisible: true,
        theme: 'a',
        html: ""
      });
      
      category=cat_id;
      action="getJokesByCategory";
      $.ajax({dataType: "json",url:"http://hasanti.tuxkiddos.com/api/categories/"+cat_id+"/jokes/?format=json&page="+page,success:function(result){      
          if(page==1){
              jokes="";
          }
          for(var i=0;i<result.results.length;i++){                            
              jokes+="<li>"+result.results[i].joke+"</li>";
          }
          if(result.next!=null){
            $('#loadMore').show();
          }else{            
            $('#loadMore').hide();
          }          
          if(page==1){
              $('#jokesListView').html(""); 
          }
          $('#jokesListView').html(jokes);       
          $.mobile.loading('hide');//hide the loading message
      },error:function(xhr,err){        
	         alert("Please check your internet connection.");
           //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
           //alert("responseText: "+xhr.responseText);
      }});
    }

    function refreshFeed(page=1){
      //alert('feed refreshed');
      //Show loading message
      $.mobile.loading( 'show', {
        text: 'Loading jokes...',
        textVisible: true,
        theme: 'a',
        html: ""
      });
      
      action="refreshFeed";
      $.ajax({dataType: "json",url:"http://hasanti.tuxkiddos.com/api/jokes/?format=json&page="+page,success:function(result){      
          if(page==1){
              jokes="";
          }
          for(var i=0;i<result.results.length;i++){              
              jokes+="<li>"+result.results[i].joke+"</li>";
          }
          if(result.next!=null){
            $('#loadMore').show();
          }else{            
            $('#loadMore').hide();
          }
         if(page==1){
          $('#jokesListView').html(""); 
         }
          $('#jokesListView').html(jokes);
          $.mobile.loading('hide');//hide the loading message

      },error:function(xhr,err){        
	   alert("Please check your internet connection.");
           //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
           //alert("responseText: "+xhr.responseText);
      }});
      
    }
    function refreshCategory(){            
      $.ajax({dataType: "json",url:"http://hasanti.tuxkiddos.com/api/categories/?format=json",success:function(result){      
          //var categories="<li data-role='list-divider' role='heading'>Categories</li>";
          var categories="";
          var languages="<li data-role='list-divider' role='heading'>Languages</li>";
          for(var i=0;i<result.length;i++){  
              var cid=result[i].id;    
               if(cid==13){
                 languages+="<li data-id='"+result[i].id+"'><a href='#'  data-id='"+result[i].id+"'>"+result[i].title+"</a></li>";
               }else if(cid==14){
                 languages+="<li data-id='"+result[i].id+"'><a href='#'  data-id='"+result[i].id+"'>"+result[i].title+"</a></li>";
               }else if(cid==15){      
                 languages+="<li data-id='"+result[i].id+"'><a href='#'  data-id='"+result[i].id+"'>"+result[i].title+"</a></li>";
               }else{
                  categories+="<li data-id='"+result[i].id+"'><a href='#'  data-id='"+result[i].id+"'>"+result[i].title+"</a></li>";
               }
          }
          $('#categoriesListView').html("");
          $('#categoriesListView').html(categories).promise().done(function(){
            $(this).listview("refresh");
            $(document).on("click","#categoriesListView li",function(event){                            
              getJokesByCategory($(this).attr('data-id'));
              $( "#myPanel" ).panel( "close" );
            });
          });

      },error:function(xhr,err){        
	   alert("Please check your internet connection.");
           //alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status);
           //alert("responseText: "+xhr.responseText);
      }});
    }
    $(document).ready(function() {
      // Refresh the feed on first load
      // (pretend we've written this function elsewhere)
      /*refreshFeed();
      refreshCategory();*/      
      $("#home").bind("pageshow", function(event, ui) {
        // Refresh the feed on subsequent page shows
        refreshFeed();
        refreshCategory();        
      });
    });

  $(document).on("click","#loadMore",function(event){
    page=page+1;
    //alert("action : "+action+" page: "+page);
    if(action=="refreshFeed"){
      refreshFeed(page);
    }else if(action=="getJokesByCategory"){
      getJokesByCategory(category,page);
    }else{
      page=page-1;
      alert("This was not supposed to happen");
    }
  });

