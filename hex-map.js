//console.log = function() {};

terrain=["grassland",
         "hills",
         "mountains",
         "water",
         "desert"];
feature=["river","forrest"];

function Map($cont) {
    this.nMatrix=[ [-1,0],[0,-1],[1,-1],[-1,1],[0,1],[1,0] ];
    this.$cont = $cont;
    this.$cont.height(this.$cont.width()/7*3);
    this.$canv = $('<div class="canvas"></div>');
    this.$cont.append(this.$canv);
    this.flat = false;
    this.terrain = [];
    this.size = 25;
    this.width = 10;
    this.height = 10;
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
{   if(this.flat) this.$cont.addClass('flat');
    else this.$cont.removeClass('flat');
    this.$canv.detach();
    for(var q=0; q<this.terrain.length; q++)
    {   for(var r=0; r<this.terrain[q].length; r++)
        {   var $hex = this.prepareHex({q:q,r:r});
            this.$canv.append($hex);
        }
    }
    this.$cont.append(this.$canv);
    this.move(center);
}
Map.prototype.prepareHex = function(pos)
{   var q = pos.q;
    var r = pos.r;
    if(this.terrain[q][r])
    {   var type=this.terrain[q][r].type;
        var feature=this.terrain[q][r].feature;
        var $hex = $('<div data-q="'+q+'" data-r="'+r+'" class="hex type-'+type+' q'+q+' r'+r+'"></div>');
        if(feature)
        {   $hex.append($('<div class="feature feature-'+feature+'"></div>'));
        }
        var $span = $('<span>'+q+','+r+'</span>');
        $hex.append($span);
        var sq = this.hexToSquare({q:q,r:r});
        //console.log([sq,{left:sq.x,top:sq.y}]);
        $hex.css({left:sq.x,top:sq.y});
        return $hex;
    }
}
Map.prototype.reRenderHex = function(pos)
{   var q = pos.q;
    var r = pos.r;
    var $hex = $('.map .hex.q'+q+'.r'+r);
    var type=this.terrain[q][r].type;
    var feature=this.terrain[q][r].feature;
    $hex.removeClass();
    $hex.addClass('hex type-'+type+' q'+q+' r'+r);
    var $fea=$hex.find('.feature');
    if(feature)
    {   if(!$fea.length)
        {   $fea = $('<div></div>');
            $hex.prepend($fea);
        }
        $fea.removeClass();
        $fea.addClass('feature feature-'+feature);
    }
    else
    {   $fea.remove();
    }
}
Map.prototype.move = function(center)
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
                       feature = "forrest";
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
    if(this.terrain[hex.q][hex.r].feature=="forrest") ret=ret*2;
    if(this.terrain[hex.q][hex.r].feature=="river") ret=ret*1.2;
    return ret;
}
Map.prototype.getNeighbors = function(hex,visited)
{   var ret=[];
    if(!visited)
    {   for(var n=0; n<this.nMatrix.length; n++)
        {   ret.push({q:hex.q+this.nMatrix[n][0],r:hex.r+this.nMatrix[n][1]});
        }
        return ret;
    }
    else    /* dont return neighbors which have better route */
    {   for(var n=0; n<this.nMatrix.length; n++)
        {   var nq = hex.q+this.nMatrix[n][0];
            var nr = hex.r+this.nMatrix[n][1];
            if(this.terrain[nq] && this.terrain[nq][nr] && (!this.terrain[nq][nr].visited || this.terrain[nq][nr].visited < visited))
            {   ret.push({q:nq,r:nr});
            }
        }
        return ret;
        
    }
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
    {   //if(!hex) break;
        var nb = this.getNeighbors(hex,hex.moves);
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

visited = false;

function movement($hex) 
{
    if(!visited)    
        {   map.$cont.addClass('dark');
            visited = map.getRange($hex.data('q'),$hex.data('r'),11);
            for(var i=0; i<visited.length; i++)
            {   //console.log('.hex.q'+visited[i].q+'.r'+visited[i].r);
                $('.hex.q'+visited[i].q+'.r'+visited[i].r).addClass('lit');
                //$('.hex.q'+visited[i].q+'.r'+visited[i].r).append('<span class="movement">'+map.terrain[visited[i].q][visited[i].r].visited.toFixed(2)+'</span>');
            }
            return false;
        }
        for(var i=0; i<visited.length; i++)
        {   //console.log('.hex.q'+visited[i].q+'.r'+visited[i].r);
            map.$cont.removeClass('dark');
            delete map.terrain[visited[i].q][visited[i].r].visited;
            delete map.terrain[visited[i].q][visited[i].r].parent;
        }
        $('.lit').removeClass('lit');
        $('.movement').remove();
        visited = false;
        return false;
}
        
function createTerrainSelectBox() 
{   var $tsb = $('<div class="tsb flat"></div>');
    
    console.log(terrain);
    for(var i=0; i<terrain.length; i++)
    {   console.log(terrain[i]);
        var $hex = $('<div data-terrain="'+terrain[i]+'" class="hex type-'+terrain[i]+'"></div>');
        $tsb.append($hex);
    }
    
    for(var i=0; i<feature.length; i++)
    {   console.log(feature[i]);
        var $hex = $('<div data-feature="'+feature[i]+'" class="hex"></div>');
        $hex.append($('<div class="feature feature-'+feature[i]+'"></div>'));
        $tsb.append($hex);
    }
    return $tsb;
}

function draw_terrain($hex)
{   console.log($hex);
    var ter = $('.tsb .active').data('terrain');
    var fea = $('.tsb .active').data('feature');
    var q = $hex.data('q');
    var r = $hex.data('r');
    if(ter) 
    {   map.terrain[q][r]={type:ter,feature:0};
    }
    if(fea)
    {   map.terrain[q][r]={type:map.terrain[q][r].type,feature:fea};
    }
    map.reRenderHex({q:q,r:r});
}

function select_terrain($hex)
{   if($hex.hasClass('active'))
    {   $hex.removeClass('active');
        current_click_function = movement;
        return false;
    }
    $('.tsb .hex').removeClass('active');
    $hex.addClass('active');
    current_click_function = draw_terrain;
}
        
$(function() {
    map = new Map($('.map'));
    map.flat=true;
    w = 60;
    h = 60;
    map.generate(w,h);
    //map.terrain=[[null,null,null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0}],[null,null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},null],[null,null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},null],[null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},null,null],[null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null],[null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null],[null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null],[null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null,null],[null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null,null],[null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null,null,null]];
    map.render({q:w/2,r:h+1});
    
    $('body').prepend(createTerrainSelectBox());
    
    $('.map .hex').on('contextmenu',function() {
        map.move({q:$(this).data('q'),r:$(this).data('r')});
        return false;
    });
    
    $('.map .hex').on('mouseover',function() {
        $('.path').removeClass('path');
        var parent = map.terrain[$(this).data('q')][$(this).data('r')].parent;
        while(parent) {
            $('.hex.q'+parent.q+'.r'+parent.r).addClass('path');
        
            parent = map.terrain[parent.q][parent.r].parent;
        }
    });
    
    current_click_function = movement;
    
    $('.map .hex').on('click',function() { current_click_function($(this)); } );
    
    $('.tsb .hex').on('click', function() { select_terrain($(this)); } );
    
    glob_queue = true;
    $button = $('<div class="button">Queue</div>');
    $button.on('click',function() 
    {   console.log('trigger');
        if(glob_queue)
        {   glob_queue = false;
            $this.html('Stack');
        }
        else
        {   glob_queue = true;
            $this.html('Queue');
            
        }
    });
    $('.map').after($button);
    
    $button = $('<div class="button">Dump Terrain</div>');
    $button.on('click',function() 
    {   $('.dump').remove();
        $dump = $('<div class="dump"></div>');
        $dump.html(JSON.stringify(map.terrain));
        $(this).after($dump);
    });
    $('.map').after($button);
});
