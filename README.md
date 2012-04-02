#  LESS-TOUCH 	v0.0.1

A simple timer based less file watcher,updates your css files accordingly;


##  Install:  
		 ```npm install less-touch -g ```
			
#   How To:
  
  ##  CommandLine:
	Just create a empty file called build_less or buildless or build-less in 
	your projects root directory with a corresponding json object map like below,
	the keys must be in lowercase as below:
		
		 ```{
			"less" : "./assets/less",
			
			"css" : "./assets/css",
	
			"timeout" : 3000
		}```
		
	Save,navigate to your projects roots and run **"less-touch"** in your terminal!

  ##  As a library: 
   	Simple require the less file after installation with NPM or after copying 
   	the less-touch.js,nodelib.js files  from the "/lib" folder into your project ,require them 
   	into your projects as follows
   	
   	```var fs = require('fs'),
	path = require('path'),
	less = require('less'),
	nodelib = require("./nodelib"),
	less_touch = require("./less-touch").LessTouch(fs,path,less,nodelib);
	
	settings =  {"less" : "path to your less files", 
		"css" : "path to save css files to", 
		"timeout" : "desired time out in milliseconds" 
		};
	
	eg settings = { "less" : "./assets/less",  
		"css" : "./assets/css",
		"timeout" : 3000 };```
	
	Then simple call the init function of the less-touch library.
	```less_touch.init(settings);```
