//console.log = function() {};

function Map($cont) {
    this.neighborMatrix=[ [-1,0],[0,-1],[1,-1],[-1,1],[0,1],[1,0] ];

    //default values
    this.flat = false;
    this.terrain = [];
    this.size = 25;
    this.width = 10;
    this.height = 10;
    this.terrains=["grassland",
         "hills",
         "mountains",
         "water",
         "desert"];

    this.features=["river","forest"];
    this.flatClassName = 'flat';
    
    if($cont instanceof jQuery)
    {   this.$cont = $cont; 
    }
    else
    {   if($cont.flat) this.flat = true;
        if($cont.size) this.size = $cont.size;
        if($cont.width) this.width = $cont.width;
        if($cont.height) this.height = $cont.height;
        if($cont.terrain) this.terrain = $cont.terrain;
        if($cont.terrains) this.terrains = $cont.terrains;
        if($cont.features) this.features = $cont.features;
    }
    this.$canv = $('<div class="hex-map-canvas"></div>');
    this.$cont.append(this.$canv);
    
    this.$cont.height(this.$cont.width()/7*3);

}
Map.prototype.hexToSquare = function(hex) 
{   var q = hex.q;
    var r = hex.r;
    if(this.flat)
    {   var x = this.size * 3/2 * q
        var y = this.size * Math.sqrt(3) * (r + q/2)
    }
    else
    {   var x = this.size * Math.sqrt(3) * (q + r/2)
        var y = this.size * 3/2 * r
    }
    return {x:x,y:y};
}
Map.prototype.render = function(center)
{   if(this.flat) this.$cont.addClass(this.flatClassName);
    else this.$cont.removeClass(this.flatClassName);
    this.$canv.detach();
    for(var q=0; q<this.terrain.length; q++)
    {   for(var r=0; r<this.terrain[q].length; r++)
        {   var $hex = this.prepareHex({q:q,r:r});
            this.$canv.append($hex);
        }
    }
    this.$cont.append(this.$canv);
    this.moveCenter(center);
}
Map.prototype.prepareHexClass = function(pos)
{   var q = pos.q;
    var r = pos.r;
    var type=this.terrain[q][r].type;
    return 'hex type-'+type+' q'+q+' r'+r;
}
Map.prototype.prepareFeatureClass = function(pos)
{   var q = pos.q;
    var r = pos.r;
    var feature=this.terrain[q][r].feature;
    if(feature)
        return 'feature feature-'+feature;
    else return null;
}
Map.prototype.prepareHex = function(pos)
{   var q = pos.q;
    var r = pos.r;
    if(this.terrain[q][r])
    {   var type=this.terrain[q][r].type;
        var feature=this.prepareFeatureClass(pos);
        var $hex = $('<div data-q="'+q+'" data-r="'+r+'" class="'+this.prepareHexClass(pos)+'"></div>');
        if(feature)
        {   $hex.append($('<div class="'+feature+'"></div>'));
        }
        var $span = $('<span>'+q+','+r+'</span>');
        $hex.append($span);
        var sq = this.hexToSquare({q:q,r:r});
        $hex.css({left:sq.x,top:sq.y});
        return $hex;
    }
}
Map.prototype.selectHex = function(pos)
{   var q = pos.q;
    var r = pos.r;
    return this.$cont.find('.hex.q'+q+'.r'+r);
}
Map.prototype.reRenderHex = function(pos)
{   var q = pos.q;
    var r = pos.r;
    var $hex = this.selectHex(pos);
    var type=this.terrain[q][r].type;
    var feature=this.terrain[q][r].feature;
    $hex.removeClass();
    $hex.addClass(this.prepareHexClass(pos));
    var $fea=$hex.find('.feature');
    if(feature)
    {   if(!$fea.length)
        {   $fea = $('<div></div>');
            $hex.prepend($fea);
        }
        $fea.removeClass();
        $fea.addClass(this.prepareFeatureClass(pos));
    }
    else
    {   $fea.remove();
    }
}
Map.prototype.moveCenter = function(center)
{   
    var x,y;
    if(this.flat)
    {   q = center.q;
        r = center.r;
        var sq = this.hexToSquare({q:q,r:r});
        x = -this.size;
        y = -this.size * Math.sqrt(3);
    }
    else
    {   q = center.q;
        r = center.r;
        var sq = this.hexToSquare({q:q,r:r});
        x = -this.size * Math.sqrt(3);
        y = -this.size;
    }
    x = x-sq.x+this.$cont.width()/2;
    y = y-sq.y+this.$cont.height()/2;
    console.log([center,q,r,sq,x,y]);
    this.$canv.css({left:x, top: y});
}
Map.prototype.generate = function(w,h)
{   var width=w;
    var height=h;
    if(this.flat)
    {   height = height * 2;
    }
    else
    {   width = width * 2;
    }
    this.width = width;
    this.height = height;
    for(var q=0; q<width; q++)
    {   this.terrain[q]=[];
        for(var r=0; r<height; r++)
        {   
            if(this.flat && (r<Math.floor((height-q)/2) || r>=Math.floor(height-q/2)) ||
                !this.flat && (q<Math.floor((width-r)/2) || q>=Math.floor(width-r/2)) )
            {   this.terrain[q][r]=null;
                continue;
            }
            var type,feature;
            var n = rnd(12);
            switch (n) 
            {
                case 0:
                case 1:
                case 2:
                    type = "grassland";
                    break;
                case 3:
                case 4:
                   type = "hills";
                    break;
                case 5:
                case 6:
                   type = "mountains";
                   break;
                case 7:
                   type = "water";
                   break;
                case 8:
                    type = "desert";
                   break;
                case 9:
                case 10:
                case 11:
                case 12:
                    type = "grassland";
                    break;
            }
            n = rnd(5);
            if(type!="water" && type!="desert")
            {   switch (n) 
                {   case 0:
                    case 1:
                    case 2:
                        feature = 0;
                       break;
                    case 3:
                       feature = "forest";
                       break;
                    case 4:
                        feature = "river";
                       break;
                }
            }
            else feature = 0;
            this.terrain[q][r]={type:type,feature:feature};
        }
    }
    
}
Map.prototype.getMovementCost = function(hex)
{   
    if(!this.terrain[hex.q] || !this.terrain[hex.q][hex.r]) return 100;
    var ret = 1
    if(this.terrain[hex.q][hex.r].type=="mountains") ret= 3;
    if(this.terrain[hex.q][hex.r].type=="hills") ret= 2;
    if(this.terrain[hex.q][hex.r].type=="desert") ret= 2.5;
    if(this.terrain[hex.q][hex.r].type=="water") ret= 100;
    if(this.terrain[hex.q][hex.r].feature=="forest") ret=ret*2;
    if(this.terrain[hex.q][hex.r].feature=="river") ret=ret*1.2;
    return ret;
}
Map.prototype.getNeighbors = function(hex,visited)
{   var ret=[];
    if(!visited)
    {   for(var n=0; n<this.neighborMatrix.length; n++)
        {   ret.push({q:hex.q+this.neighborMatrix[n][0],r:hex.r+this.neighborMatrix[n][1]});
        }
        return ret;
    }
    else    /* dont return neighbors which have better route */
    {   for(var n=0; n<this.neighborMatrix.length; n++)
        {   var nq = hex.q+this.neighborMatrix[n][0];
            var nr = hex.r+this.neighborMatrix[n][1];
            if(this.terrain[nq] && this.terrain[nq][nr] && (!this.terrain[nq][nr].visited || this.terrain[nq][nr].visited < visited))
            {   ret.push({q:nq,r:nr});
            }
        }
        return ret;
        
    }
}

Map.prototype.getPathNeighbors = function(hex)
{   var ret=[];
    for(var n=0; n<this.neighborMatrix.length; n++)
    {   var nq = hex.q+this.neighborMatrix[n][0];
        var nr = hex.r+this.neighborMatrix[n][1];
		if(this.terrain[nq] && this.terrain[nq][nr] && (!this.terrain[nq][nr].closed))
        {   ret.push({q:nq,r:nr});
        }
    }
    return ret;
}

Map.prototype.getTerrain = function(hex)
{
	return this.terrain[hex.q][hex.r];
}

Map.prototype.getDistance = function(hex1,hex2)
{   return (Math.abs(hex1.q - hex2.q) + Math.abs(hex1.r - hex2.r)
          + Math.abs(hex1.q + hex1.r - hex2.q - hex2.r)) / 2
}
Map.prototype.getRange=function(q,r,moves)
{   var end = false;
    var visited = [];
    var plain=0;
    var upd = 0;
    
    var search = new Queue();
    search.enqueue({q:q,r:r,moves:moves});
    
    if(moves>0)
    {   this.terrain[q][r].visited=moves;
        visited.push({q:q,r:r});
    }
    
    var hex = search.dequeue();
    
    while(hex)
    {   var nb = this.getNeighbors(hex,hex.moves);
        for(var i=0; i<nb.length; i++)
        {   var m = hex.moves-this.getMovementCost(nb[i]);
            if(m>=0)
            {   var nq = nb[i].q;
                var nr = nb[i].r;
                if(!this.terrain[nq][nr].visited || this.terrain[nq][nr].visited<m)
                {   this.terrain[nq][nr].visited=m;
                    this.terrain[nq][nr].parent=hex;
                    visited.push({q:nq,r:nr});
                    nb[i].moves=m;
                    search.enqueue(nb[i]);
                    upd++;
                }
                else
                {   plain++;
                }
            }
            else
            {   plain++;
            }
        }
        hex=search.dequeue();
    }
    return visited;
}
Map.prototype.getCenter = function()
{   //console.log({q:Math.floor(this.width/2),r:Math.floor(this.height/2)})
    if(this.flat)
    {   return {q:Math.floor(this.width/2),r:Math.floor(this.height/2)};
    }
    else return {q:Math.floor(this.width/2)+Math.floor(this.height*2/6),r:Math.floor(this.height/2)};
}