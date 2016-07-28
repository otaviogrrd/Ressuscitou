$('#cantosListPage').bind('pageinit', function(event) {
	getCantosList();
});

function getCantosList() {
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
}

var size = 9;
function zoomMais() {
		size++;
	$('#html_canto').css({
        'font-size': size+'px'
    });

};
function zoomMenos() {
	if (size > 1)
	size--;
	
	$('#html_canto').css({
        'font-size': size+'px'
    });

};

var pagina = "";
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

