var $ = function(id){
	return document.getElementById(id);
},
sparql = new SPARQLWrapper("http://dbpedia.org/sparql"),
results = [];
function getInfo(movie){
	name = name.replace(/\s/g, "_");
	var command = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
					+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
					+ "PREFIX dbo: <http://dbpedia.org/ontology/>"
					+ "PREFIX dbp: <http://dbpedia.org/property/>"
					+ "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
					+ "SELECT ?link ?link_r ?label ?label_r ?title ?title_r ?director_name ?abstract ?starring_name ?gross  "
					+ "WHERE { "
					+ "?movie rdf:type dbo:Film."
					+ "?movie foaf:name ?title ."
					+ "FILTER(REGEX(?title, '" + movie + "'))."
					+ "?movie dbo:director ?director."
					+ "?director foaf:name ?director_name."
					+ "?movie dbo:starring ?starring."
					+ "?movie foaf:isPrimaryTopicOf ?link."
					+ "?movie rdfs:label ?label."
					+ "FILTER(LANG(?label)='zh')."
					+ "?movie dbo:abstract ?abstract."
					+ "?movie dbo:gross ?gross ."
					+ "FILTER(LANG(?abstract)='en')."
					+ "?starring foaf:name ?starring_name."
					+ "FILTER(LANG(?starring_name)='en')."
					+ "?movie_r dbo:director ?director."
					+ "?movie_r foaf:name ?title_r."
					+ "FILTER(?movie_r != ?movie)."
					+ "?movie_r foaf:isPrimaryTopicOf ?link_r."
					+ "} "
					+ "LIMIT 20";
					
		sparql.setQuery(command);
		sparql.query(function(json){
			showInfo((eval("(" + json + ")")).results.bindings);
		});
}

function showInfo(results){
	var text = "";
	if(results.length !== 0){
		text += "<div>" + "名称：" + results[0].label.value + " " + "<a href=" + results[0].link.value + ">查看详情</a>" + "</div>";
 		text += "<div>" + "导演：" + results[0].director_name.value + "</div>";
		text += "<div>" + "主演：" + results[0].starring_name.value + " & " + results[2].starring_name.value + "</div>";
		text += "<div>" + "票房：" + results[0].gross.value + "</div>";
		text += "<div>" + "简介：" + results[0].abstract.value + "</div>";
		text += "<div>" + "&nbsp" + "</div>" ;
		text += "<div>" + "推荐：" + results[0].title_r.value + " " + "<a href=" + results[0].link_r.value + ">查看详情</a>" + "</div>";

		$("result").innerHTML = text;
		console.log(results);

	}else{
		$("result").innerHTML = "没有收录该出版物的相关信息！";
	}
	
}