var $ = function(id){
	return document.getElementById(id);
},
sparql = new SPARQLWrapper("http://dbpedia.org/sparql"),
results = [];
function getInfo(game){
	name = name.replace(/\s/g, "_");
	var command = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
					+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
					+ "PREFIX dbo: <http://dbpedia.org/ontology/>"
					+ "PREFIX dbp: <http://dbpedia.org/property/>"
					+ "PREFIX foaf: <http://xmlns.com/foaf/0.1/>"
					+ "SELECT ?game ?link ?title ?title_r ?label ?link_r ?abstract ?genre_name ?mode_name ?developer_name "
					+ "WHERE { "
					+ "?game rdf:type dbo:VideoGame."
					+ "?game foaf:isPrimaryTopicOf ?link."
					+ "?game foaf:name ?title."
					+ "FILTER(REGEX(?title, '" + game + "'))."
					+ "?game rdfs:label ?label."
					+ "FILTER(LANG(?label)='zh')."
					+ "?game dbo:genre ?genre."
					+ "?genre rdfs:label ?genre_name."
					+ "FILTER(LANG(?genre_name)='en')."
					+ "?game dbp:modes ?mode."
					+ "?mode rdfs:label ?mode_name."
					+ "FILTER(LANG(?mode_name)='en')."
					+ "?game dbo:developer ?developer."
					+ "?developer foaf:name ?developer_name."
					+ "?game dbo:abstract ?abstract."
					+ "FILTER(LANG(?abstract)='en')."
					+ "?game_r dbp:modes ?mode."
					+ "?game_r foaf:name ?title_r."
					+ "?game_r foaf:isPrimaryTopicOf ?link_r."
					+ "FILTER(REGEX(?title_r, 'Dr. Mario'))."
					+ "}";
					
		sparql.setQuery(command);
		sparql.query(function(json){
			showInfo((eval("(" + json + ")")).results.bindings);
		});
}

function showInfo(results){
	var text = "";
	if(results.length !== 0){
		text += "<div>" + "名称：" + results[0].label.value + " " + "<a href=" + results[0].link.value + ">查看详情</a>" + "</div>";
		text += "<div>" + "开发商：" + results[0].developer_name.value + "</div>";
		text += "<div>" + "类型：" + results[0].genre_name.value + " 和 " + results[2].genre_name.value + "</div>";
		text += "<div>" + "模式：" + results[0].mode_name.value + " 和 " + results[1].mode_name.value + "</div>";
		text += "<div>" + "简介：" + results[0].abstract.value + "</div>";
		text += "<div>" + "&nbsp" + "</div>" ;
		text += "<div>" + "推荐：" + results[0].title_r.value +  " " + "<a href=" + results[0].link_r.value + ">查看详情</a>" + "</div>";

		$("result").innerHTML = text;
		console.log(results);

	}else{
		$("result").innerHTML = "没有收录该出版物的相关信息！";
	}
	
}