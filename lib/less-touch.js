var LessTouch = (function(fs,path,less,node){
//setup variables
var node = node.Node,
less = less,
fs = fs,
path = path,
parser = new less.Parser,
gsettings,
less_folder_status,
timer;


var check_build_file = function(){
   var a = path.normalize(path.resolve(process.cwd(),"build-less")),
   b = path.normalize(path.resolve(process.cwd(),"build_less")),
   c = path.normalize(path.resolve(process.cwd(),"buildless"));
   var real;
   
   if(path.existsSync(a)){
     real = a;
   }
   else if(path.existsSync(b)){
    real = b;
   }
   else if(path.existsSync(c)){
      real = c;
   }else{
     console.log("build-less or build_less or buildless file not found!");
     return false;
   };
   
   gsettings = readBuild(real);
   console.log("Using Config: ",real);
   return true;
};



var readBuild = function(file){
  try{
     var struct = fs.readFileSync(file,'utf8');
     return JSON.parse(struct);
     return struct;
   }
   catch(e){
   	e.path = file;
   	e.message = "Error Parsing " + file + ": " + e.message;
       throw e;
       return false;
    }
};

var check_folder_status = function(folder,size, callback){
	if(fs.readdirSync(path.resolve(folder)).length <= size){
		return;
	}else{
		callback.call(this);
		return;
	}
};

var check_folder_state = function(less_dir,css_dir){
  
  var less_state = path.existsSync(less_dir);
  var css_state = path.existsSync(css_dir);
  
  if(less_state){
       if(!css_state){ fs.mkdir(path.normalize(css_dir)); return true;}
    	return true 
    	}else{
  	throw new Error("No such directory:" + less_dir); 
  	return false;
  }

}

var init_nodes = function(dir){
   var tmp = fs.readdirSync(dir);
   var tmplist = new node.List;
   for(var i = 0; i < tmp.length; i++){
     var c = path.resolve(dir,tmp[i]);
     if(c.match(/\.less$/)){
     var stat = fs.statSync(c);
     tmplist.add(tmp[i],c,stat['mtime']);
     }
   };
    return tmplist;
};

var begin_compile = function(list,css_dir,less_dir){
  list.each(function(o){
    var stat = fs.statSync(o.data);
    if(stat['mtime'] > o.modtime){
      update_css(o,css_dir);
      o.modtime = stat['mtime']
    }
  });
};

var save = function(filename,data){
  fs.writeFile(filename,data, function(err){
   if(err){ 
     console.log(err);
     throw err;
    }
  });
};

var update_css = function(o,css_dir){
   var data = fs.readFileSync(o.data).toString();
   var css,opath;
   parser.parse(data, function(err,tree){
     if(err){
         console.log(err.message,": ", err.extract);
        return;
      }
      css = tree.toCSS({compress:true});
      opath = path.resolve(css_dir,o.name.toString().replace(/less/,'css'));
      save(opath, css);
      console.log(o.name + " Updated!");
   });
   
};

var init_node_list = function(less_dir){
	return init_nodes(less_dir);
};

function start(less_dir,css_dir,time){
	var list = init_node_list(less_dir);
		
        var timeout = time;

	console.log('Updating every '+ timeout +"ms");
	console.log("------------------------------------");

	timer = setInterval(function(){ 
	    if(check_folder_state(less_dir,css_dir)){
	    	
	    	try{
	             check_folder_status(less_dir, list.length, function(){ 
	             	list = init_node_list(less_dir); 
	             	});
	            begin_compile(list,css_dir,less_dir); 	
		}
	      	catch(e){
	      	     list = init_node_list(less_dir); begin_compile(list,css_dir,less_dir); 	
	      	}
	   
	    }else{
	    	
	    	throw new Error("Error occured on checking less and css folders,ensure less directory exists!");
	    	 return;
	    }
	    
	 }, timeout);
};

function stop(){
	clearInterval(timer);
};

var init =  function(settings){
  start(path.resolve(settings.less),path.resolve(settings.css),settings.timeout);
};


var init_cmd = function(){
   if(check_build_file()){
   	start(path.resolve(gsettings.less),path.resolve(gsettings.css),gsettings.timeout);
   }
};

return {
	start:start,
	stop:stop,        
	init: init,
	init_cmd: init_cmd
}


});


module.exports.LessTouch = LessTouch;


