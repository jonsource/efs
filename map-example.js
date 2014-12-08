visited = false;
$stack_to_move = false;

function range($hex) 
{
    if(!visited)    
        {   map.$cont.addClass('dark');
            visited = map.getRange($hex.data('q'),$hex.data('r'),11);
            for(var i=0; i<visited.length; i++)
            {   //console.log('.hex.q'+visited[i].q+'.r'+visited[i].r);
                $('.hex.q'+visited[i].q+'.r'+visited[i].r).addClass('lit');
                //$('.hex.q'+visited[i].q+'.r'+visited[i].r).append('<span class="movement">'+map.terrain[visited[i].q][visited[i].r].visited.toFixed(2)+'</span>');
            }
			$stack_to_move = $hex;
			return false;
        }
	return false;
}
function do_move($stack,$hex) {
	if(!$stack_to_move) return;
	if(!visited) return;
	var stack = $stack[0].efs_stack;
	
	var sequence = [{q:$hex.data('q'),r:$hex.data('r')}];
	var parent = map.terrain[$hex.data('q')][$hex.data('r')].parent;
    while(parent) {
		sequence.push({q:parent.q,r:parent.r});
        parent = map.terrain[parent.q][parent.r].parent;
    }

	var sq;
	var ease = {};
	for(var i=sequence.length-1; i>=0; i--)
	{	sq = map.hexToSquare(sequence[i]);
		ease.string="linear";
		if(i==0) ease.string = "linear";
		if(i==sequence.length-1) ease.string = "linear";
		
		$stack.animate({left:sq.x,top:sq.y},150,ease.string);
		
	}
		
	stack.q=$hex.data('q');
	stack.r=$hex.data('r');
	$stack.data('q',stack.q);
	$stack.data('r',stack.r);
	var sq = map.hexToSquare({q:stack.q,r:stack.r});
    $stack.css({left:sq.x,top:sq.y});
	
	//clear map
	for(var i=0; i<visited.length; i++)
	{   //console.log('.hex.q'+visited[i].q+'.r'+visited[i].r);
		map.$cont.removeClass('dark');
		delete map.terrain[visited[i].q][visited[i].r].visited;
		delete map.terrain[visited[i].q][visited[i].r].parent;
	}
	$stack_to_move = false;
	$('.lit').removeClass('lit');
	$('.movement').remove();
	visited = false;
}

path_start = null;
path_end = null;

function path($hex)
{
	if(!path_start)
	{	$hex.addClass('lit');
		path_start = {q:$hex.data('q'),r:$hex.data('r')};
		$('.lit').removeClass('lit');
		map.$cont.removeClass('dark');
		return;
	}
	path_end = {q:$hex.data('q'),r:$hex.data('r')};
	var options = {heuristic:map.getDistance};
	var path = astar.search(map, path_start, path_end, options);
	console.log(path);
	for(var i=0; i<path.length; i++)
	{   //console.log('.hex.q'+visited[i].q+'.r'+visited[i].r);
		map.$cont.addClass('dark');
		$('.hex.q'+path[i].q+'.r'+path[i].r).addClass('lit');
		//$('.hex.q'+visited[i].q+'.r'+visited[i].r).append('<span class="movement">'+map.terrain[visited[i].q][visited[i].r].visited.toFixed(2)+'</span>');
	}

	astar.init(map);
	
	path_start = null;
	path_end = null;
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
	map.stacks=[];
	stack1 = new Stack();
	stack1.Add(createUnit(0));
	stack1.q=10;
	stack1.r=10;
	map.stacks.push(stack1);
	
	stack2 = new Stack();
	stack2.Add(createUnit(1));
	stack2.q=8;
	stack2.r=8;
	map.stacks.push(stack2);
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
    
    //current_click_function = movement;
	current_click_function = range;
    
    $('.map .unit').on('click',function() { current_click_function($(this)); } );
	$('.map .hex').on('click',function() { do_move($stack_to_move,$(this)); } );
    
    $('.tsb .hex').on('click', function() { select_terrain($(this)); } );
    
    $button = $('<div class="button">Dump Terrain</div>');
    $button.on('click',function() 
    {   $('.dump').remove();
        $dump = $('<div class="dump"></div>');
        $dump.html(JSON.stringify(map.terrain));
        $(this).after($dump);
    });
    $('.map').after($button);
});