// Demofunction to change bg-color by moving slider
var rVal,gVal,bVal,cCol;

var wdwSets=window.dialogArguments;
var bgColor, gImgPath, gImgStyle; // Hintergrund
var gTxtPath, gTxtOflw, gTxtStyle, gSavStyle, gSavPath; // Textdaten
var gOpac=0,gShdw,gDelBlur,gDelGray; // Extras
var conf,ie=navigator.appVersion.charAt(22); // temporär

// Hintergrund
(wdwSets["bgCol"])? bgColor=wdwSets["bgCol"]: bgColor="#000000";
(wdwSets["bgImg"]!=0)? gImgPath=wdwSets["bgImg"]: gImgPath="";
(!isNaN(wdwSets["bgStyle"]))? gImgStyle=wdwSets["bgStyle"]: gImgStyle=0;

// Textdaten
(!isNaN(wdwSets["txtOflw"]))? gTxtOflw=wdwSets["txtOflw"]: gTxtOflw=0;
(!isNaN(wdwSets["txtStyle"]))? gTxtStyle=wdwSets["txtStyle"]: gTxtStyle=0;
(!isNaN(wdwSets["savStyle"]))? gSavStyle=wdwSets["savStyle"]: gSavStyle=0;
(typeof wdwSets["savPath"]!="undefined")? gSavPath=wdwSets["savPath"]: gSavPath="C:\\";

// Effekte
(!isNaN(wdwSets["menuShdw"]))? gShdw=wdwSets["menuShdw"]: gShdw=0; // 3D-Schatten
(!isNaN(wdwSets["delBlur"]))? gDelBlur=wdwSets["delBlur"]: gDelBlur=0; 
(!isNaN(wdwSets["delGray"]))? gDelGray=wdwSets["delGray"]: gDelGray=0; 
// Transparenz
if(wdwSets["menuOpac"]) gOpac=wdwSets["menuOpac"]; 

dialogWidth="390px";
if(ie>6) dialogHeight="396px"; //Ab IE7 wird Parameter anders intepretiert
else dialogHeight="420px"; // 60

function onOKclick()
{
    this.className="tdBorder";

    var backVal=new Array();
    backVal["bgCol"]=document.getElementById("colorPrvw").style.backgroundColor;
    backVal["bgImg"]=gImgPath;
    backVal["bgStyle"]=gImgStyle;

    if(gOpac<5) conf=confirm("Warnung!\nSie haben einen sehr hohen Wert für die Transparenz eingegeben. \nDies kann negative Auswirkungen auf die Erkennbarkeit des Kontextmenüs haben.\n\nWirklich übernehmen?");
    if(conf==0) backVal[3]=wdwSets[3];
    else backVal["menuOpac"]=100-parseInt(gOpac);

    backVal["menuShdw"]=gShdw;
    if(gDelBlur>0) gDelBlur=parseInt(document.getElementById("txtBlur").value);
    backVal["delBlur"]=gDelBlur;
    backVal["delGray"]=gDelGray;
    backVal["txtStyle"]=gTxtStyle; // Bearbeitungsmodus
    backVal["txtOflw"]=gTxtOflw; // Darstellung bei übergroßem Inhalt
    backVal["savStyle"]=parseInt(gSavStyle); // Speicherart der Daten
    gSavPath=document.getElementById("txtSavPath").value; // Speicherort der Daten
    if(gSavPath!="" && gSavPath!=0) {
        if(gSavPath.charAt(gSavPath.length-1)!="\\"&&gSavPath.charAt(gSavPath.length-1)!="/") {
            gSavPath+="\\";
        }
    } else {
        gSavPath="C:\\"
    }
    backVal["savPath"]=gSavPath;

    window.returnValue=backVal;
    window.close()
}

function initCfg()
{
    initBgCol(bgColor);
    document.getElementById('txtImgPath').value=gImgPath;
    document.getElementById('imgAtr'+gImgStyle).className="cmdDwn";
    document.getElementById('txtOflw'+gTxtOflw).className="cmdDwn";
    document.getElementById('txtAtr'+gTxtStyle).className="cmdDwn";
    loadImg(document.getElementById('txtImgPath').value,'imgPrvw',gImgStyle,2);
    
    // Anzeige der Cookiegröße
    document.getElementById('ckiSize').title=document.cookie.length+" Bytes belegt";
    document.getElementById('ckiSize').innerText=4096-document.cookie.length;
    if(4096-document.cookie.length<200) document.getElementById('ckiSize').style.color="#C00000";
    
    // Speicherart initialisieren
    document.getElementById('txtSav'+gSavStyle).className="cmdDwn";
    if(gSavStyle>1) document.getElementById('txtSav1').className="cmdDwn";
    document.getElementById('txtSavPath').value=gSavPath;
 
    // Transparenz Kontextmenü initialisieren
    document.getElementById('txtOpac').value=Number(gOpac);
    chgSld('sldOpac',document.getElementById('txtOpac'),100);

    // Effekte initialisieren
    if(gShdw>0) document.getElementById('chkShdw').className='cmdDwn';
    if(gDelGray>0) document.getElementById('chkDelGray').className='cmdDwn';
    if(gDelBlur>0) {
        document.getElementById('chkDelBlur').className='cmdDwn';
        document.getElementById("txtBlur").value=gDelBlur;
    }
}

function setDefault(src)
{
    src.className='cmdOvr';

    // Alle Checkboxen zurücksetzen
    for(var i=0;document.getElementsByTagName("span")[i];i++)
    {
        if(document.getElementsByTagName("span")[i].style.width=="16px") {
            document.getElementsByTagName("span")[i].className="tdBorder"; }
    }

    // Hintergrund
    bgColor="#000000";
    gImgPath="";
    gImgStyle=0;

    // Textdaten
    gTxtOflw=0;
    gTxtStyle=0;
    gSavStyle=0;
    gSavPath="C:\\";

    // Effekte
    gShdw=0; // 3D-Schatten
    gDelBlur=0; 
    gDelGray=0; 
    // Transparenz
    gOpac=0; 
    
    initCfg();
}

function initBgCol(bgC)
{
	rVal=bgC.substr(1,2); 
	gVal=bgC.substr(3,2); 
	bVal=bgC.substr(5,2);

	document.getElementById("sldRed").style.backgroundColor="#"+rVal+"0000";
	document.getElementById("sldGrn").style.backgroundColor="#00"+gVal+"00";
	document.getElementById("sldBlu").style.backgroundColor="#0000"+bVal;

	rVal=hextodez(rVal); 
	gVal=hextodez(gVal); 
	bVal=hextodez(bVal);

	document.getElementById("sldRed").style.pixelLeft=rVal;
	document.getElementById("sldGrn").style.pixelLeft=gVal;
	document.getElementById("sldBlu").style.pixelLeft=bVal;
	document.getElementById("txtRed").value=rVal;
	document.getElementById("txtGrn").value=gVal;
	document.getElementById("txtBlu").value=bVal;

	document.getElementById("colorPrvw").style.backgroundColor=bgC;
}

function chgVal(sld) {
	var tdBgC=document.getElementById("colorPrvw"); 
	var newCol;

	cCol=tdBgC.style.backgroundColor;

	rVal=cCol.substr(1,2); // alter Farbwert Rot
	gVal=cCol.substr(3,2); // alter Farbwert Grün
	bVal=cCol.substr(5,2); // alter Farbwert Blau
	newCol=deztohex(sPosition); // neuer Farbwert

// If more sliders are used, each of them has to be handled separately
	if (sld =="sldRed") {
		tdBgC.style.backgroundColor="#"+newCol+gVal+bVal;
		document.getElementById("txtRed").value=sPosition;
		document.getElementById("sldRed").style.backgroundColor="#"+newCol+"0000";
	}
	if (sld =="sldGrn") {
		tdBgC.style.backgroundColor="#"+rVal+newCol+bVal;
		document.getElementById("txtGrn").value=sPosition;
		document.getElementById("sldGrn").style.backgroundColor="#00"+newCol+"00";
	}
	if (sld =="sldBlu") {
		tdBgC.style.backgroundColor="#"+rVal+gVal+newCol;
		document.getElementById("txtBlu").value=sPosition;
		document.getElementById("sldBlu").style.backgroundColor="#0000"+newCol;
	}
	if (sld =="sldOpac") {
		document.getElementById("txtOpac").value=sPosition;
		gOpac=100-sPosition;
	}
}

/*========================= Open File ==========================*/
function openFil(self)
{
    if(check_upload(self.value)) loadImg(self.value,'imgPrvw',gImgStyle,2);
    else self.value="";

    document.getElementById('txtImgPath').value=self.value;
    
    return self.value;
}

function delImg()
{
    gImgPath="";
    loadImg('','imgPrvw',gImgStyle,2);
    document.getElementById('txtImgPath').value="";
}

/*======================= change Opacity =======================*/
function moveSld(current,sld,val)
{
	current.className="cmdDwn";
	val=Number(val);
	if(sPosition<5&&val<0)
	    sPosition=0;
	else if(sPosition>95&&val>0)
	    sPosition=100;
	else 
	    sPosition=sPosition+val;
	document.getElementById(sld).style.pixelLeft=sPosition;

	chgVal(sld);

}
