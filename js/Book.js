var $ = function(id){
	return document.getElementById(id);
},
sparql = new SPARQLWrapper("http://dbpedia.org/sparql"),
results = [];

function getInfo(book){
	name = name.replace(/\s/g, " ");
	var command = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
					+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
					+ "PREFIX dbo: <http://dbpedia.org/ontology/>"
					+ "PREFIX dbp: <http://dbpedia.org/property/>"
					+ "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
					+ "SELECT ?book ?label ?abstract ?title_r ?link_r ?genre ?title ?authorname ?published ?link "
					+ "WHERE { "
					+ "?book rdf:type dbo:Book."
					+ "?book foaf:name ?title."
					+ "FILTER(REGEX(?title, '" + book + "'))."
					+ "?book dbo:author ?author."
					+ "?author foaf:name ?authorname."
					+ "?book rdfs:label ?label."
					+ "FILTER(LANG(?label)='zh')."
					+ "?book foaf:isPrimaryTopicOf ?link."
					+ "?book dbp:published ?published ."
					+ "?book dbo:abstract ?abstract."
					+ "FILTER(LANG(?abstract)='en')."
					+ "?book dbp:genre ?genre."
					+ "?book_r dbp:genre ?genre."
					+ "?book_r foaf:name ?title_r."
					+ "FILTER(?book_r != ?book)."
					+ "?book_r foaf:isPrimaryTopicOf ?link_r."
					+ "} "
					+ "ORDER BY ASC(?title_r)";
					
		sparql.setQuery(command);
		sparql.query(function(json){
			showInfo((eval("(" + json + ")")).results.bindings);
		});
}

function showInfo(results){
	var text = "";
	if(results.length !== 0){
		text += "<div>" + "名称：" + results[0].label.value + " " + "<a href=" + results[0].link.value + ">查看详情</a>" + "</div>";
		text += "<div>" + "作者：" + results[0].authorname.value + "</div>";
		text += "<div>" + "类型：" + results[0].genre.value + "</div>";
		text += "<div>" + "出版时间：" + results[0].published.value + "</div>";
		text += "<div>" + "简介：" + results[0].abstract.value + "</div>";
		text += "<div>" + "&nbsp" + "</div>" ;
		text += "<div>" + "推荐：" + results[0].title_r.value + " " + "<a href=" + results[0].link_r.value + ">查看详情</a>" + "</div>";
	
		$("result").innerHTML = text;
		console.log(results);

	}else{
		$("result").innerHTML = "没有查到该出版物的相关信息！";
	}
	
}
