// set up SVG for D3
var width = 800,
	height = 600,
	colors = d3.scale.category10();

var svg = d3.select('body')
	.append('svg')
	.attr('oncontextmenu', 'return false;')
	.attr('width', width)
	.attr('height', height);

//var obj = JSON.parse('{ "URLs": {"www.google.com": {"edges": ["www.zzz.com"], "found": false, "title": "title0"}, "www.zzz.com": { "edges": [], "found": false, "title": "title1" }}, "cookie": "graph 3", "start": "0"}');
//var obj = JSON.parse('{"start": "0", "cookie": "test7903", "URLs": {"0": {"found": true, "edges": ["1"], "title": "title0"}, "1": {"found": false, "edges": ["0"], "title": "title1"}, "2": {"found": false, "edges": ["0"], "title": "title2"}, "3": {"found": false, "edges": ["2", "1"], "title": "title3"}, "4": {"found": false, "edges": [], "title": "title4"}}}');
var obj = JSON.parse(document.getElementById("script").getAttribute("jsonObj"));

var keyWordFound = false


urls = Object.keys(obj["URLs"]);

//console.log(urls);

var nodes = [
],
	lastNodeId = 0,
	links = [
	];

for (var x = 0; x < urls.length; x++){
	var i = { id: urls[x], reflexive: false, keyword: obj['URLs'][urls[x]]['found'], title: obj["URLs"][urls[x]]['title']};
	//if (x != 0) {
	//	i["reflexive"] = true;
	//}

	nodes.push(i);
	//console.log(nodes);
}

for (var i = 0; i < urls.length; i++) {
	for (var j = 0; j < obj["URLs"][urls[i]]["edges"].length; j++) {
		var y = urls.indexOf(obj["URLs"][urls[i]]["edges"][j]);
		//console.log(y);
		
		var k = {
			source: nodes[i], target: nodes[y] , left: false, right: true
		};
		if (k["source"] != k["target"]) {
			links.push(k);
		}
		//links.push(k);
		//console.log(links);
		//console.log(k);
	}
}

// init D3 force layout
var force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.size([width, height])
	.linkDistance(150)
	.charge(-500)
	.on('tick', tick)

// define arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
	.attr('id', 'end-arrow')
	.attr('viewBox', '0 -5 10 10')
	.attr('refX', 6)
	.attr('markerWidth', 3)
	.attr('markerHeight', 3)
	.attr('orient', 'auto')
	.append('svg:path')
	.attr('d', 'M0,-5L10,0L0,5')
	.attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
	.attr('id', 'start-arrow')
	.attr('viewBox', '0 -5 10 10')
	.attr('refX', 4)
	.attr('markerWidth', 3)
	.attr('markerHeight', 3)
	.attr('orient', 'auto')
	.append('svg:path')
	.attr('d', 'M10,-5L0,0L10,5')
	.attr('fill', '#000');


// handles to link and node element groups
var path = svg.append('svg:g').selectAll('path'),
	circle = svg.append('svg:g').selectAll('g');

// mouse event vars
var selected_node = null,
	selected_link = null,
	mousedown_link = null,
	mousedown_node = null,
	mouseup_node = null;

function resetMouseVars() {
	mousedown_node = null;
	mouseup_node = null;
	mousedown_link = null;
}

// update force layout (called automatically each iteration)
function tick() {
	// draw directed edges with proper padding from node centers
	path.attr('d', function (d) {
		var deltaX = d.target.x - d.source.x,
			deltaY = d.target.y - d.source.y,
			dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
			normX = deltaX / dist,
			normY = deltaY / dist,
			sourcePadding = d.left ? 17 : 12,
			targetPadding = d.right ? 17 : 12,
			sourceX = d.source.x + (sourcePadding * normX),
			sourceY = d.source.y + (sourcePadding * normY),
			targetX = d.target.x - (targetPadding * normX),
			targetY = d.target.y - (targetPadding * normY);
		return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
	});

	circle.attr('transform', function (d) {
		return 'translate(' + d.x + ',' + d.y + ')';
	});
}

// update graph (called when needed)
function restart() {
	// path (link) group
	path = path.data(links);

	// update existing links
	path.classed('selected', function (d) { return d === selected_link; })
		.style('marker-start', function (d) { return d.left ? 'url(#start-arrow)' : ''; })
		.style('marker-end', function (d) { return d.right ? 'url(#end-arrow)' : ''; });


	// add new links
	path.enter().append('svg:path')
		.attr('class', 'link')
		.classed('selected', function (d) { return d === selected_link; })
		.style('marker-start', function (d) { return d.left ? 'url(#start-arrow)' : ''; })
		.style('marker-end', function (d) { return d.right ? 'url(#end-arrow)' : ''; })
		.on('mousedown', function (d) {
			if (d3.event.ctrlKey) return;

			// select link
			mousedown_link = d;
			if (mousedown_link === selected_link) selected_link = null;
			else selected_link = mousedown_link;
			selected_node = null;
			restart();
		});

	circle = circle.data(nodes, function (d) { return d.id; });
	

	// add new nodes
	var g = circle.enter().append('svg:g');

	g.append('svg:circle')
		.attr('class', 'node')
		.attr('r', 12)
		//		.style('fill', function (d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
		.style('fill', function (d) { return (d.keyword) ? "red" : "lightGreen"; })	//change node color if keyword is found red is true
		.style('stroke', "black")
		.classed('reflexive', function (d) { return d.reflexive; })

	// show node IDs
	g.append('svg:text')
		.attr('x', 0)
		.attr('y', 4)
		.attr('class', 'id')
		.text(function (d) { return d.id; });

	g.append('svg:text')
		.attr('x', 10)
		.attr('y', 14)
		.attr('class', 'title')
		.text(function (d) { console.log(d); return d.title; });
		

	// remove old nodes
	circle.exit().remove();

	// set the graph in motion
	force.start();
}


function mouseup() {
	if (mousedown_node) {
		// hide drag line
		drag_line
			.classed('hidden', true)
			.style('marker-end', '');
	}

	// because :active only works in WebKit?
	svg.classed('active', false);

	// clear mouse event vars
	resetMouseVars();
}


// only respond once per keydown
var lastKeyDown = -1;

function keydown() {
	d3.event.preventDefault();

	if (lastKeyDown !== -1) return;
	lastKeyDown = d3.event.keyCode;

	// ctrl
	if (d3.event.keyCode === 17) {
		circle.call(force.drag);
		svg.classed('ctrl', true);
	}

	if (!selected_node && !selected_link) return;
}

function keyup() {
	lastKeyDown = -1;

	// ctrl
	if (d3.event.keyCode === 17) {
		circle
			.on('mousedown.drag', null)
			.on('touchstart.drag', null);
		svg.classed('ctrl', false);
	}
}

d3.select(window)
	.on('keydown', keydown)
	.on('keyup', keyup);
restart();