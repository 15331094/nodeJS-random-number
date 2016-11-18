$(document).ready(function() {
	var count = 0;
	var expression = "";
	$("#get").click(function() {
		expression = "addend";
		$.post("/server.js", expression + $("#screen").val(), function(data) {
			$("#screen").val(data);
		});
	});
	$("#calculate").click(function() {
		expression = "calculate";
		$.post("/server.js", expression + $("#screen").val(), function(data) {
			if(data != "") $("#screen").val($("#screen").val().substring(0, $("#screen").val().length) + "=" + data);
		});	
	});
	$("#clear").click(function() {
		expression = "clear";
		if($("#screen").val() == "") alert("Nothing to clear or save");
		else {
			$.post("/server.js", expression + $("#screen").val(), function(data) {
				$("#screen").val("");
			});	
		}

	});
	$("#show").click(function() {
		expression = "show";
		$.post("/server.js", expression, function(data) {
			alert(data);
			//$("#box").val(data);
			//alert("lala");
		});			
	});
	$("#search").click(function() {
		expression = "search";
		if($("#screen").val() == "") alert("Please input the expression");
		else {
			$.post("/server.js", expression + $("#screen").val(), function(data) {
				alert(data);
			});	
		}
		
	});
	$("#clean").click(function() {
		expression = "clean";
		$.post("/server.js", expression, function(data) {
			//alert(data);
		});	

	});

});