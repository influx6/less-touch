var Node=function(name,data,modtime,status,next,prev){
	this.name = name;
	this.data = data;
	this.modtime = modtime;
	this.next = next;
	this.previous = prev;
};

var NodeList=function(){
     this.current=undefined;
     this.first=undefined;
     this.last=undefined;
     this.length=0;
};

NodeList.prototype.add = function(name,data,ctime){
     if( this.length <= 0){
      this.first = new Node(name,data,ctime);
      this.current = this.first;
      this.last = this.current;
      this.length += 1;
     }else{
      var tmp = this.current;
      this.current = new Node(name,data,ctime);
      this.current.previous = tmp;
      tmp.next = this.current;
    
      this.last = this.current;
      this.last.previous = this.current.previous;
       this.length += 1; 
  	} 
};

NodeList.prototype.each = function(callback,scope){
    var p = this.first;
  for(var i =0; i < this.length;i++){
    callback.call(scope,p,i);
    p = p.next;
  }
}

exports.Node = { 'Node':Node, 'List':NodeList};
