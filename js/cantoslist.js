$('#cantosListPage').bind('pagecreate', function(event) {
	$.getJSON('cantos.json', function(data) {
		
		$.each(data, function(index, canto) {
		var categ = '';
		if(canto.categ === '1'){
			categ = 'white';
		}else if(canto.categ === '2'){
			categ = 'blue';
		}else if(canto.categ === '3'){
			categ = 'green';
		}else if(canto.categ === '4'){
			categ = 'beige';
		}
		
		$('#cantoslist').append(
			'<li><a  class="linha" href="html/'+canto.html+'.HTML" >' +
			'<img class="categoria_img" src="img/dot'+categ+'.png" />'+          
			canto.nome +
			'<span class="conteudo">'+canto.conteudo+'</span></a></li>');
		});
		
		$('#cantoslist').listview('refresh');
	});
});


var size = 9;
var pagina = "";

$(document).bind('pageshow', function(event) {
	size = 9;
	$('#html_canto').css({
        'min-height': document.body.scrollHeight+'px'
    });
});

function zoomMais() {
	size++;
	$('#html_canto').css({
        'font-size': size+'px'
    });
};
function zoomMenos() {
	if (size > 9)
	size--;
	$('#html_canto').css({
        'font-size': size+'px'
    });
};

function autScrl() {
	pagina = window.location.href;
	var inicial = window.pageYOffset;
	window.scrollTo(0, document.body.scrollHeight);
	descer(window.pageYOffset);
	window.scrollTo(0, inicial);
};
function descer(i) {
	if ( window.location.href === pagina ){
		setTimeout(function () { 
			var pos = window.pageYOffset;
			pos++;
			if (pos < i) {
				window.scrollTo(0, pos);
				descer(i);
			}
		},500);
	}
}

var escalaTmp = ["zerofiller", "@01", "@02", "@03", "@04", "@05", "@06", "@07", "@08","@09", "@10", "@11", "@12" ];
var escala = ["zerofiller", "Do", "Do#", "Re", "Mib", "Mi", "Fa", "Fa#", "Sol", "Sol#","La", "Sib", "Si", "Do", "Do#", "Re", "Mib", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "Sib", "Si" ];
var transVisible = 0;
function showTrans(){
	if (transVisible == 0 ){
		transVisible++;
		$('#transDialog').css({'display': 'initial' });	
		$('#transDialog').css({'margin-top' : 10 + window.pageYOffset+'px' });	
	}else {
		transVisible--;
		$('#transDialog').css({'display': 'none' });	
	}
}
function transpor(numero){
	var pri = 99;
	var dif = 0;
	var lines = document.getElementById('html_canto').innerHTML.split('\n');
	var newHtml = '';
	
	for(var i=0;i<lines.length;i++){
		if (lines[i].includes('FF0000')){
			if (!lines[i].includes('<h2>')) {
			for(var z=0;z<8;z++) {//repete 8x pra caso tenha notas repetidas na mesma linha
				lines[i] = lines[i].replace("Do#", escalaTmp[2]).replace("Fa#", escalaTmp[7]).replace("Sol#", escalaTmp[9]);
				for(var j = 0;j < escalaTmp.length;j++) {
					lines[i] = lines[i].replace(escala[j], escalaTmp[j]);
				}
			}
			
			// Lógica para descobrir a primeira nota:
			if (pri == 99) {
				var x = "@";
				for(var j = 0; j< lines[i].length;j++) {
					if (lines[i].charAt(j) == x.charAt(0)) {
						pri = lines[i].substring(j + 1, j + 3);
						// dif = quantas casas vai subir ou descer
						dif = Math.abs(numero - pri);
						break;
					}
				}
			}
			if ((pri > numero) && !(dif == 0)) {
				for (var j = 12; j > 0; j--) {
					for(var z=0;z<15;z++) {	lines[i] = lines[i].replace(escalaTmp[j], escala[j + 12 - dif]); }
				}
			}
			if ((pri < numero) && !(dif == 0)) {
				for (var j = 0; j < escalaTmp.length; j++) {
					for(var z=0;z<15;z++) { lines[i] = lines[i].replace(escalaTmp[j], escala[j + dif]);}
				}
			}
			if (pri - numero == 0) {
				for (var j = 0; j < escalaTmp.length; j++) {
					for(var z=0;z<15;z++) {lines[i] = lines[i].replace(escalaTmp[j], escala[j]);}
				}
			}
			
			}
		}	
		newHtml = newHtml + '\n' + lines[i];		
	}
	document.getElementById('html_canto').innerHTML = newHtml;
	showTrans();
}
