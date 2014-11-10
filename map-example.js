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
    
    for(var i=0; i<map.terrains.length; i++)
    {   console.log(map.terrains[i]);
        var $hex = $('<div data-terrain="'+map.terrains[i]+'" class="hex type-'+map.terrains[i]+'"></div>');
        $tsb.append($hex);
    }
    
    for(var i=0; i<map.features.length; i++)
    {   console.log(map.features[i]);
        var $hex = $('<div data-feature="'+map.features[i]+'" class="hex"></div>');
        $hex.append($('<div class="feature feature-'+map.features[i]+'"></div>'));
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
    w = 15;
    h = 9;
    map.generate(w,h);
    //map.terrain=[[null,null,null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0}],[null,null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},null],[null,null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},null],[null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},null,null],[null,null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null],[null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null],[null,null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null],[null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null,null],[null,null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null,null],[null,null,null,null,null,{"type":"grassland","feature":0,"visited":0,"parent":null},{"type":"desert","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"water","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},{"type":"grassland","feature":0},null,null,null,null,null]];
    map.render(map.getCenter());
    
    
    $('body').prepend(createTerrainSelectBox());
    
    $('.map .hex').on('contextmenu',function() {
        map.moveCenter({q:$(this).data('q'),r:$(this).data('r')});
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