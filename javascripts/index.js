var factions = [];
var types = [];
var packs = [];
var cards = [];
var loadStatus = {
	factions: false,
	types: false,
	packs: false,
	cards: false
}
var query = {
	factions: [],
	types: [],
	packs: [],
	cards: []
}

var cardPool = [];
var cardPoolIndex = 0;

var packResults = [];

$.ajax({
	type: "GET",
	url: "https://netrunnerdb.com/api/2.0/public/factions",
	dataType: "json",
	success: function(data){
		factions = data.data;
		loadStatus.factions = true;
		checkStatus()
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
		loadStatus.types = true;
		checkStatus()
	},
	error: function(xhr, type){
		alert("Types Error! " + type.toUpperCase())
	}
})

$.ajax({
	type: "GET",
	url: "https://netrunnerdb.com/api/2.0/public/packs",
	dataType: "json",
	success: function(data){
		data.data.forEach(function(pack){
			if (pack.date_release) {
				packs.push(pack)
			}
		})
		loadStatus.packs = true;
		checkStatus()
	},
	error: function(xhr, type){
		alert("Packs Error! " + type.toUpperCase())
	}
})

$.ajax({
	type: "GET",
	url: "https://netrunnerdb.com/api/2.0/public/cards",
	dataType: "json",
	context: $("body"),
	success: function(data){
		cards = data.data;
		loadStatus.cards = true;
		checkStatus()
	},
	error: function(xhr, type){
		alert("Cards Error! " + type)
	}
})

function checkStatus(){
	for (var key in loadStatus) {
		if (!loadStatus[key]) {
			return false
		}
	}
	renderMenu()
}

function renderMenu(){
	$("<div>").attr("id", "toggleMenu").appendTo($("#menu")).addClass("row");
	$("<button>").appendTo($("#toggleMenu")).attr("id", "factionsExpand").text("Factions").addClass("four columns");
	$("<button>").appendTo($("#toggleMenu")).attr("id", "typesExpand").text("Card Types").addClass("four columns");
	$("<button>").appendTo($("#toggleMenu")).attr("id", "packsExpand").text("Card Packs").addClass("four columns");
	
	$("<div>").appendTo($("#menu")).addClass("options").attr("id", "factions");
	factions.forEach(function(faction){
		$("<button>")
			.appendTo($("#factions"))
			.addClass("faction")
			.text(faction.name)
			.attr("id", faction.code)
			.attr("style", "color:#" + faction.color)
	})
	$("#factions").toggle();
	
	$("<div>").appendTo($("#menu")).addClass("options").attr("id", "types");
	types.forEach(function(type){
		$("<button>")
			.appendTo($("#types"))
			.addClass("type")
			.text(type.name)
			.attr("id", type.code)
	})
	$("#types").toggle();
	
	$("<div>").appendTo($("#menu")).addClass("options").attr("id", "packs");
	packs.forEach(function(pack){
		pack.voteCount = 0;
		$("<button>")
			.appendTo($("#packs"))
			.addClass("pack button-primary")
			.text(pack.name)
			.attr("id", pack.code)
	})
	$("#packs").toggle();
	
	var target;
	cards.forEach(function(card){
		if (card.code == "08062") {
			target = card
		}
	})
	$("<div>")
		.prependTo($(".container"))
		.addClass("row")
		.attr("id", "header");
	$("<img>")
		.prependTo($("#header"))
		.attr("src", "https://netrunnerdb.com/bundles/netrunnerdbcards/images/cards/en/" + target.code + ".png")
		.attr("id", target.code)
		.addClass(target.faction_code)
		.addClass("four columns")
		.addClass("card u-max-full-width");
	$("<h2>")
		.insertAfter($(".card"))
		.text(target.flavor);
	$("<button>").insertBefore($("#menu"))
		.attr("id", "submit")
		.attr("type", "submit")
		.text("Submit")
		.addClass("twelve columns")
		
}

$("body").on("click", "#factionsExpand", function(e){
	e.preventDefault();
	$("#types").hide().removeClass("button-primary");
	$("#packs").hide().removeClass("button-primary");
	$("#factions").toggle()
})

$("body").on("click", "#typesExpand", function(e){
	e.preventDefault();
	$("#factions").hide().removeClass("button-primary");
	$("#packs").hide().removeClass("button-primary");
	$("#types").toggle()
})

$("body").on("click", "#packsExpand", function(e){
	e.preventDefault();
	$("#factions").hide();
	$("#types").hide();
	$("#packs").toggle()
})

$("body").on("click", "#menu .options button", function(e){
	e.preventDefault();
	$(this).toggleClass("button-primary")
})

$("body").on("click", "#submit", function(e){
	e.preventDefault();
	$(".faction").each(function(){
		if ($(this).hasClass("button-primary")){
			query.factions.push($(this).attr("id"))
		}
	})
	$(".type").each(function(){
		if ($(this).hasClass("button-primary")){
			query.types.push($(this).attr("id"))
		}
	})
	$(".pack").each(function(){
		if ($(this).hasClass("button-primary")){
			query.packs.push($(this).attr("id"))
		}
	})
	
	$("#submit").toggle();
	$("#menu").toggle();

	cards.forEach(function(card){
		if(
		query.factions.indexOf(card.faction_code) != -1 &&
		query.types.indexOf(card.type_code) != -1 &&
		query.packs.indexOf(card.pack_code) != -1) {
			cardPool.push(card)	
		}
	});
	
	$("<div>").insertAfter("#menu").attr("id", "selector").addClass("row");
	
	$("<img>")
		.appendTo("#selector")
		.attr("src", "https://netrunnerdb.com/bundles/netrunnerdbcards/images/cards/en/" + cardPool[cardPoolIndex].code + ".png")
		.addClass("four columns")
		.attr("id", "currentCard")
	$("<div>")
		.insertBefore("#currentCard")
		.addClass("two columns")
		.html("<span style='color:white'>empty space</span>")
	$("<img>")
		.insertBefore("#currentCard")
		.attr("src", "./images/like.png")
		.attr("id", "like")
		.addClass("two columns")
	$("<img>")
		.insertAfter("#currentCard")
		.attr("src", "./images/dislike.png")
		.attr("id", "dislike")
		.addClass("two columns")
	$("<div>")
		.insertAfter("#dislike")
		.addClass("two columns")
		.html("<span style='color:white'>empty space</span>")
})

$("body").on("click", "#like", function(e){
	var currentCard = cardPool[cardPoolIndex];
	for (var i = 0; i < packs.length; i++) {
		if (packs[i].code == currentCard.pack_code) {
			packs[i].voteCount ++
		}
	}
	cardPoolIndex ++;
	if (cardPoolIndex > cardPool.length - 1){
		renderResults()
	} else {
		$("#currentCard").attr("src", "https://netrunnerdb.com/bundles/netrunnerdbcards/images/cards/en/" + cardPool[cardPoolIndex].code + ".png");
	}
})

$("body").on("click", "#dislike", function(e){
	cardPoolIndex ++;
	if (cardPoolIndex > cardPool.length - 1){
		renderResults()
	} else {
		$("#currentCard").attr("src", "https://netrunnerdb.com/bundles/netrunnerdbcards/images/cards/en/" + cardPool[cardPoolIndex].code + ".png")
	}
})

function renderResults(){
	packs.forEach(function(pack){
		if (pack.voteCount > 0) {
			packResults.push(pack)
		}
	});
	packResults.sort(function(a, b){
		return b.voteCount - a.voteCount
	});
	$("#selector").toggle();
	$("<ol>")
		.insertAfter("#selector")
		.attr("id", "results")
	packResults.forEach(function(pack){
		$("<li>")
			.appendTo("#results")
			.html(pack.name + ": " + pack.voteCount)
	})
}