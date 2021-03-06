function networkx(){
	var width = 1000,
		height = 600,
		fill = d3.scale.category20();

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		//.attr("class","svgmargin")
		.attr("id","svg4");

	var force = d3.layout.force()
		.gravity(.15)//保证图形慢慢像中心靠拢的向心力
		.distance(100)
		.charge(-100)
		.size([width, height]);//图形限定的范围

	d3.json("/static/bootstrap/data/githubRec.json", function(json) {
		force.nodes(json.nodes)
			.links(json.links)
			.start();

		var link = svg.selectAll(".link")
			.data(json.links)
			.enter().append("line")
			.attr("class", "link")
			.on("mouseover",function(d){
				//显示连接线上的文字
				var x1 = d3.select(this).attr("x1");
				var x2 = d3.select(this).attr("x2");
				var y1 = d3.select(this).attr("y1");
				var y2 = d3.select(this).attr("y2");
				var absx = Math.abs(x1-x2)/2;
				var absy = Math.abs(y1-y2)/2;
				var xPosition;
				var yPosition
				if(x1 > x2)
					xPosition = parseFloat(x2 + absx) + 20;
				else
					xPosition = parseFloat(x1 + absx) + 20;
				if(y1 > y2)
					yPosition = parseFloat(y2 + absy) + 20;
				else
					yPosition = parseFloat(y1 + absy) + 20;
				svg.append("text")
					.attr("id", "linktip")
					.attr("x", xPosition)
					.attr("y", yPosition)
					.attr("text-anchor", "middle")
					.attr("font-family", "sans-serif")
					.attr("font-size", "30px")
					.attr("font-weight", "bold")
					.attr("fill", "black")
					.text(d.source.id + "-->" + d.target.id);
				console.log("link in");
//                    console.log(d);
			})
			.on("mouseout", function() {
				// 删除提示条
				d3.select("#linktip").remove();
				console.log("link out");
			});

		var color = d3.scale.category10();

		var drag = force.drag()
			.on("dragstart",function(d,i){
				//拖拽之后固定位置
				d.fixed = true;
				console.log("drag status：start");
			})
			.on("dragend",function(d,i){
				console.log("drag status：stop");
			})
			.on("drag",function(d,i){
				console.log("drag status：ing");
			});

		var node = svg.selectAll(".node")
			.data(json.nodes)
			.enter().append("g")
			.attr("class", "node")
			.on("click", function() {
				//单击节点刷新图
			})
			.on("dblclick",function(d,i){
				//双击节点释放固定位置
				d.fixed = false;
			})
			.on("mouseover",function(d,i){
				//鼠标移过提示节点用户信息
			})
			.on("mouseout",function(d,i){
				//鼠标移除隐去节点提示文字
			})
			.call(drag);

		node.append("circle")
			.attr("r", 8)
//                .style("fill", function(d) { return color(1); })
			.style("fill", function(d,i) { return color(i); })
			.append("title")
			.text(function(d) {
				//返回每个节点用户信息
				return "用户信息：" + d.id;
			});

		node.append("text")
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function(d) { return d.id });
		var img_w = 8;
		var img_h = 8;
		force.on("tick", function() {
			//限制节点跑出svg范围，但是有很多单一节点需要处理
//            json.nodes.forEach(function(d,i){
//                d.x = d.x - img_w/2 < 0     ? img_w/2 : d.x ;
//                d.x = d.x + img_w/2 > width ? width - img_w/2 : d.x ;
//                d.y = d.y - img_h/2 < 0      ? img_h/2 : d.y ;
//                d.y = d.y + img_h/2 > height ? height - img_h/2 : d.y ;
//            });

			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });
			node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		});

	});
}
