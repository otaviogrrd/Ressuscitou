var cantos = [];
var url = '';
var size = 9;
var pagina = "";
var transVisible = 0;
var menuVisible = 0;

var isPlaying = false;
var timeControler = 0;
var myaudio = new Audio();
var strUrl = '';
var tentativas = 0;

$('#cantosListPage').bind('pagecreate', function(event) {
	$.getJSON('cantos.json', function(data) {
		$.each(data, function(index, canto) {
			cantos.push(canto);			
		});			
	});
	showMenu();
});

function showMenu(){
	if (menuVisible == 0 ){
		menuVisible++;
		$('#menu').css({'display': 'initial' });	
		$('#list').css({'display': 'none' });
		$('#menulit').css({'display': 'none' });	
		$('#homeBack').css({'display': 'none' });		
	}else {
		menuVisible--;
		$('#menu').css({'display': 'none' });	
		$('#list').css({'display': 'initial' });
		$('#homeBack').css({'display': 'initial' });	
	}
}

function showLiturgico(){
	menuVisible--;
	$('#menu').css({'display': 'none' });	
	$('#menulit').css({'display': 'initial' });		
	$('#homeBack').css({'display': 'initial' });
}

function setCantosList(cat) {		
	$('#cantoslist').empty();
	for(var i = 0; i < cantos.length ; i++){
		var canto = cantos[i];
		if(canto.categ == cat || cat == '0'){	
			addCanto(canto);
		}
	}	
	$('#cantoslist').listview('refresh');
	showMenu();
}

function setCantosLit(lit) {		
	$('#cantoslist').empty();
	for(var i = 0; i < cantos.length ; i++){
		var canto = cantos[i];
		var adiciona = '';
		switch(lit) {
		    	case 'PAZ'           :if ( canto.PAZ            == 'true' ){ adiciona = 'true';}break;
		    	case 'NATAL'         :if ( canto.NATAL          == 'true' ){ adiciona = 'true';}break;
		    	case 'PASCOA'        :if ( canto.PASCOA         == 'true' ){ adiciona = 'true';}break;
		    	case 'FINAL'         :if ( canto.FINAL          == 'true' ){ adiciona = 'true';}break;
		    	case 'COMUNHAO'      :if ( canto.COMUNHAO       == 'true' ){ adiciona = 'true';}break;
		    	case 'ADVENTO'       :if ( canto.ADVENTO        == 'true' ){ adiciona = 'true';}break;
		    	case 'LAUVESP'       :if ( canto.LAUVESP        == 'true' ){ adiciona = 'true';}break;
		    	case 'ENTRADA' 	     :if ( canto.ENTRADA        == 'true' ){ adiciona = 'true';}break;
		    	case 'QUARESMA'      :if ( canto.QUARESMA       == 'true' ){ adiciona = 'true';}break;
		    	case 'FRACAOPAO'     :if ( canto.FRACAOPAO      == 'true' ){ adiciona = 'true';}break;
		    	case 'PENTECOSTES'   :if ( canto.PENTECOSTES    == 'true' ){ adiciona = 'true';}break;
		    	case 'CANTOSVIRGEM'  :if ( canto.CANTOSVIRGEM   == 'true' ){ adiciona = 'true';}break;
		    	case 'CANTOSCRIANCAS':if ( canto.CANTOSCRIANCAS == 'true' ){ adiciona = 'true';}break;
		    	default: adiciona = '';
		}
	   	if ( adiciona == 'true' ){
	    		addCanto(canto);	    	
	    	}
	}	
	$('#cantoslist').listview('refresh');
	$('#list').css({'display': 'initial' });
	$('#menulit').css({'display': 'none' });
}

function addCanto(canto){
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
		'<li><a class="linha" onclick="setUrl(\''+canto.url+'\')"' +
		'href="html/'+canto.html+'.HTML" >' +
		'<img class="categoria_img" src="img/dot'+categ+'.png" />'+      
		canto.nome +    
		'<span class="conteudo"'+canto.url+'</span>'+          
		'<span class="conteudo">'+canto.conteudo+'</span></a></li>'
	);
}

$(document).bind('pageshow', function(event) {
	if (url != '')
		$('#start').css({'display': 'block' });	
				
	//reset variables
	transVisible = 0; 
	size = 9;
	$('#html_canto').css({
        'min-height': document.body.scrollHeight+'px'
    });	
});

function setUrl(url) {
	this.url = url;
}
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
				posTrans();
			}
		},500);
	}
}
function showTrans(){
	if (transVisible == 0 ){
		transVisible++;
		posTrans();
	}else {
		transVisible--;
		$('#transDialog').css({'display': 'none' });	
	}
}

function posTrans(){
		$('#transDialog').css({'display': 'initial' });	
		$('#transDialog').css({'margin-top' : 10 + window.pageYOffset+'px' });	
}

var escalaTmp = ["zerofiller","@01","@02","@03","@04","@05","@06","@07","@08","@09","@10","@11","@12" ];
var escala = ["zerofiller","Do","Do#","Re","Mib","Mi","Fa","Fa#","Sol","Sol#","La","Sib","Si","Do","Do#","Re","Mib","Mi","Fa","Fa#","Sol","Sol#","La","Sib","Si" ];

function transpor(numero){
	var pri = 99;
	var dif = 0;
	var lines = document.getElementById('html_canto').innerHTML.split('\n');
	var newHtml = '';
	
	for(var i=1;i<lines.length;i++){
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

function startCont(){
	$('#music_controls').css({'display': 'block' });	
	$('#start').css({'display': 'none' });
	strUrl = "";
	originMp3();
}
function originMp3() {
	if (strUrl == "https://raw.githubusercontent.com/otaviogrrd/Ressuscitou_Android/master/audios/"+url) {
		strUrl = "http://www.cn.org.br/app_ressuscitou/"+url;
	}	
	if (strUrl == "http://www.cn.org.br/app_ressuscitou/"+url) {
		strUrl = "http://www.imaculadaconceicaodf.com.br/ressuscitou/mp3/"+url;
	}
	if (strUrl == "") {
		strUrl = "https://raw.githubusercontent.com/otaviogrrd/Ressuscitou_Android/master/audios/"+url
	}
	myaudio = new Audio(strUrl);
	html5audio.play();
}

function bttn1() {
		myaudio.currentTime = myaudio.currentTime - 2 ;
}
function bttn2() {
	if ( isPlaying ) {
		html5audio.pause();
	} else {
		html5audio.play();
	}
}
function bttn3() {
		html5audio.pause();
		html5audio.stop();
}
function bttn4() {
		myaudio.currentTime = myaudio.currentTime + 2 ;
}
var html5audio = {
	play: function(){
		myaudio.play();		
		myaudio.addEventListener("error", function() {
		if (tentativas < 3){
			originMp3();
			tentativas++;
		}else{
			if (window.confirm('Erro de conexão com o servidor\n Tentar novamente?')) {
				originMp3();
			}else{
				$('#music_controls').css({'display': 'none' });	
				$('#start').css({'display': 'block' });
			}
			tentativas = 0;
		}
		}, false);
		myaudio.addEventListener("waiting", function() {
			isPlaying = false;
		}, false);
		myaudio.addEventListener("progress", function() {
			//isPlaying = false;
		}, false);
		myaudio.addEventListener("playing", function() {
			isPlaying = true;
			startTempo();
			document.getElementById("imgBtt1").src = "../img/rwnd.png";
			document.getElementById("imgBtt2").src = "../img/paus.png";
		}, false);
		myaudio.addEventListener("ended", function() {
			html5audio.ended();
		}, false);
	},
	pause: function() {
		timeControler = 0;
		isPlaying = false;
		myaudio.pause();
		document.getElementById("imgBtt2").src = "../img/play.png";
	},
	stop: function() {
		timeControler = 0;
		myaudio.currentTime = 0;
	},
	ended: function() {
		timeControler = 0;
		isPlaying = false;
		document.getElementById("imgBtt2").src = "../img/play.png";	
	}
};

function startTempo() {
	if (timeControler == 0) {
		timeControler++;
		tempo();
	}
}
function tempo() {
		if ( !myaudio.ended && isPlaying ){
			setTimeout(function () {
				if ( myaudio.duration > 0){
					document.getElementById('progressbar').max = myaudio.duration;
				}
				if ( myaudio.currentTime > 0 ){
					document.getElementById('progressbar').value = myaudio.currentTime;
				}
				tempo();
			},500);
		}
}

function exit() {
	html5audio.pause();	
	document.location = "#cantosListPage";	
}
