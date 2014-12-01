function pathTo(node){
    var curr = node,
        path = [];
    while(curr.parent) {
        path.push(curr);
        curr = curr.parent;
    }
    return path.reverse();
}

function getHeap(graph) {
    return new BinaryHeap(function(node) {
        return graph.getTerrain(node).f;
    });
}

var astar = {
    init: function(graph) {
        this.graph = graph;
		for(var q=0; q<graph.width; q++)
		{   for(var r=0; r<graph.height; r++)
			{
				var node = graph.terrain[q][r];
				if(!node) continue; //null node
				node.f = 0;
				node.g = 0;
				node.h = 0;
				node.visited = false;
				node.closed = false;
				node.parent = null;
			}
		}
    },
	pathTo: function(node){
		var curr = node,
			path = [];
		while(this.graph.getTerrain(curr).parent) {
			path.push(curr);
			curr = this.graph.getTerrain(curr).parent;
		}
		return path.reverse();
	},

    /**
    * Perform an A* Search on a graph given a start and end node.
    * @param {Graph} graph
    * @param {GridNode} start
    * @param {GridNode} end
    * @param {Object} [options]
    * @param {bool} [options.closest] Specifies whether to return the
               path to the closest node if the target is unreachable.
    * @param {Function} [options.heuristic] Heuristic function (see
    *          astar.heuristics).
    */
    search: function(graph, start, end, options) {
        //console.log([start,end]);
		astar.init(graph);

        options = options || {};
        var heuristic = options.heuristic || astar.heuristics.manhattan,
            closest = options.closest || false;

        var openHeap = getHeap(graph),
            closestNode = start; // set the start node to be the closest if required

        start.h = heuristic(start, end);

        openHeap.push(start);

		/*var iter = 0;
		var max_iter = 20;*/
		
        while(openHeap.size() > 0 /*&& iter < max_iter*/) {
			//iter++;
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

			//console.log(currentNode,[currentNode.q === end.q,currentNode.r === end.r],end);
			// End case -- result has been found, return the traced path.
            if(currentNode.q === end.q && currentNode.r === end.r) {
                console.log('done');
				return this.pathTo(currentNode);
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            graph.getTerrain(currentNode).closed = true;
			
            // Find all non closed neighbors for the current node.
            var neighbors = graph.getPathNeighbors(currentNode);
			//console.log(neighbors);

            for (var i = 0, il = neighbors.length; i < il; ++i) {
                var neighbor = neighbors[i];

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
				var gScore = graph.getTerrain(currentNode).g + graph.getMovementCost(neighbor),
                    beenVisited = graph.getTerrain(neighbor).visited;

                if (!beenVisited || gScore < graph.getTerrain(neighbor).g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
					var ter = graph.getTerrain(neighbor);
                    ter.visited = true;
                    ter.parent = currentNode;
                    ter.h = ter.h || graph.getDistance(neighbor, end);
                    ter.g = gScore;
                    ter.f = ter.g + ter.h;

                    if (closest) {
                        // If the neighbour is closer than the current closestNode or if it's equally close but has
                        // a cheaper path than the current closest node then it becomes the closest node
                        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                            closestNode = neighbor;
                        }
                    }

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        if (closest) {
            return this.pathTo(closestNode);
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    },
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    heuristics: {
        manhattan: function(pos0, pos1) {
            var d1 = Math.abs(pos1.x - pos0.x);
            var d2 = Math.abs(pos1.y - pos0.y);
            return d1 + d2;
        },
        diagonal: function(pos0, pos1) {
            var D = 1;
            var D2 = Math.sqrt(2);
            var d1 = Math.abs(pos1.x - pos0.x);
            var d2 = Math.abs(pos1.y - pos0.y);
            return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
        }
		
    }
};