var factions = [];
var types = [];
var packs = [];

$.ajax({
	type: "GET",
	url: "https://netrunnerdb.com/api/2.0/public/factions",
	dataType: "json",
	success: function(data){
		factions = data.data;
		$("<ol>").appendTo($("#menu")).addClass("factions four columns");
		factions.forEach(function(faction){
			$("<li>")
			.appendTo($("ol.factions"))
			.addClass("faction")
			.text(faction.name)
			.attr("id", faction.code)
			.attr("style", "color:#" + faction.color)
		})
	},
	error: function(xhr, type){
		alert("Factions Error! " + type.toUpperCase())
	}
})

$.ajax({
	type: "GET",
	url: "https://netrunnerdb.com/api/2.0/public/types",
	dataType: "json",
	success: function(data){
		types = data.data;
		$("<ol>").appendTo($("#menu")).addClass("types four columns");
		types.forEach(function(type){
			$("<li>")
			.appendTo($("ol.types"))
			.addClass("type")
			.text(type.name)
			.attr("id", type.code)
		})
	},
	error: function(xhr, type){
		alert("Factions Error! " + type.toUpperCase())
	}
})

$.ajax({
	type: "GET",
	url: "https://netrunnerdb.com/api/2.0/public/packs",
	dataType: "json",
	success: function(data){
		packs = data.data;
		$("<ol>").appendTo($("#menu")).addClass("packs four columns");
		packs.forEach(function(pack){
			$("<li>")
			.appendTo($("ol.packs"))
			.addClass("pack")
			.text(pack.name)
			.attr("id", pack.code)
		})
	},
	error: function(xhr, type){
		alert("Factions Error! " + type.toUpperCase())
	}
})

$("body").on("click", ".faction", function(){
	var style = $(this).attr("style");
	style += ";border:black solid 1px";
	$(this).attr("style", style)
})



$.ajax({
	type: "GET",
	url: "https://netrunnerdb.com/api/2.0/public/cards",
	dataType: "json",
	context: $("body"),
	success: function(data){
		var target = {code: 01001};
		data.data.forEach(function(card){
			if (card.code == "08062") {
				target = card
			}
		})
		$("<div>")
		.prependTo($(".container"))
		.addClass("row")
		.attr("id", "header")
		$("<img>")
		.prependTo($("#header"))
		.attr("src", "https://netrunnerdb.com/bundles/netrunnerdbcards/images/cards/en/" + target.code + ".png")
		.attr("id", target.code)
		.addClass(target.faction_code)
		.addClass("six columns")
		.addClass("card u-max-full-width");
		$("<h2>")
		.insertAfter($(".card"))
		.text(target.flavor)
	},
	error: function(xhr, type){
		alert("Ajax Error! " + type)
	}
})