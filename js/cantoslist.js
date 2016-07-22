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
				'<span class="titulo">'+canto.nome+'</span>'+
				'<span class="conteudo">'+canto.conteudo+'</span></a></li>');
		});
		$('#cantoslist').listview('refresh');
	});
}