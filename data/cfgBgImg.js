/*======================= loading background-image ========================*/

function loadImg(path,dest,prop,cf)
{
	var imgDest=document.getElementById(dest);

	if(!path||path=="") {
		imgDest.innerHTML="";
		return 0;
	}
		

	var imgCon,imgBg,imgBgR,imgBgP;
	var newBg,imgRep="repeat";
	if(!cf) cf=0;

	switch(parseInt(prop)) {
	    case 0:
		imgBg ="<span style='background-image:url("+path+");";
		imgBgS="background-repeat:no-repeat;";		
		imgBgP="background-position:center;";
		break;
	    case 1:
		imgBg ="<span style='background-image:url("+path+");";
		imgBgS="background-repeat:repeat;";
		imgBgP=null;
		break;
	    case 2:
		imgBg ="<img src='"+path+"' style='";
		imgBgS=null;
		imgBgP=null;
		break;
	    default:
		return 0;
	}
	imgCon= imgBg;
	if(imgBgS) imgCon += imgBgS;	
	if(imgBgP) imgCon += imgBgP;	
	imgCon += "width:" + (imgDest.style.pixelWidth-cf) + "px;";
	imgCon += "height:" + (imgDest.style.pixelHeight-cf) + "px;'>";

	imgDest.innerHTML=imgCon;
}

function check_upload(value) { 	// Da stimmt was nicht 
	var regex = /(gif|jpg|jpeg|png|bmp)$/i;
	var result = regex.test(value);
	if(result == 0){
		alert("Die Datei ist kein unterstütztes Bild-Format.");
	//	alert("Die ausgewählte Datei muss im\n  - bmp\n  - gif\n  - jpg/jpeg\n  - png\nFormat vorliegen.");
		return 0;
	}
	return 1;
}
