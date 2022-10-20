var ie = navigator.appVersion.charAt(22);
var wdwSets=window.dialogArguments;
var bgColor=wdwSets[0];
var divOpac=wdwSets[1];
var divWidth=wdwSets[2];
var divHeight=wdwSets[3];
var divTTL=wdwSets[4]; // Zeit bis Verfallsdatum
var divTTW=wdwSets[5]; // Zeit bis Warnung
var disTime=wdwSets[6]; // Flag um Zeit zu deaktivieren
var calTTL;
var sNow = new Date();

var ttlArray = new Array();
var ttwArray = new Array();

window.dialogWidth="252px";
if(ie>6) dialogHeight="300px"; //Ab IE7 wird Parameter anders intepretiert
else dialogHeight="324px";

function onOKclick()
{
	this.className="tdBorder";

	var conf=1,backVal=new Array();

	backVal[0]=bgColor;
	if(divOpac<5) conf=confirm("Warnung!\nSie haben einen sehr hohen Wert für die Transparenz eingegeben. \nDies kann negative Auswirkungen auf die Erkennbarkeit Ihrer Notiz haben.\n\nWirklich übernehmen?");
	if(conf==0) backVal[1]=wdwSets[1];
	else backVal[1]=divOpac;

	backVal[2]=Number(document.getElementById('txtWidth').value);
	backVal[3]=Number(document.getElementById('txtHeight').value);
	if(ttlArray[0]) backVal[4]=getSecs(ttlArray[0],ttlArray[1],ttlArray[2],ttlArray[3]);
    if(ttwArray[0]) backVal[5]=getSecs(ttwArray[0],ttwArray[1],ttwArray[2],ttwArray[3]);

	window.returnValue=backVal;
	window.close();
}

function initCfg()
{
    // Vordefinierte Farbe aus Dialog zuweisen, ansonsten Abbrechen-Bug -> 0 & schwarz
    document.getElementById("dbgclr12").style.backgroundColor = "#ffff80"; // = bgColor;

    for(var iInit=0;iInit<12;iInit++) 
        if(document.getElementById("dbgclr"+iInit).style.backgroundColor==bgColor)
        {
            document.getElementById("dbgclr"+iInit).className="cmdDwn";
            break;
        }

    if(iInit==12)
    {
        document.getElementById("dbgclr"+iInit).className="cmdDwn";
        document.getElementById("dbgclr12").style.backgroundColor = bgColor;
        chgTxtCol(document.getElementById("dbgclr12"), bgColor);
    }

    tmp=document.getElementById("txtOpac");
    tmp.value=Number(100-divOpac);
    chgSld("sldOpac",tmp,100);
    document.getElementById("txtWidth").value=divWidth;
    document.getElementById("txtHeight").value=divHeight;


    if(disTime>0)
    {
        document.getElementById("regCmd1").className="cmdDis";
    }    
    else    
    {
        /*put the calendar initializations in the window's onload() method*/
        calTTL = new Epoch('cal1','flat',document.getElementById('tagTTL'),false);
        
        ttlArray = setTime(divTTL);
        document.getElementById("txtDays").value=ttlArray[0];
        document.getElementById("txtHrs").value=ttlArray[1];
        document.getElementById("txtMin").value=ttlArray[2];
        document.getElementById("txtSec").value=ttlArray[3];
        setCal(divTTL);

        ttwArray = setTime(divTTW);
        document.getElementById("txtWDays").value=ttwArray[0];
        document.getElementById("txtWHrs").value=ttwArray[1];
        document.getElementById("txtWMin").value=ttwArray[2];
        document.getElementById("txtWSec").value=ttwArray[3];
    }
}

/* ======== Hintergrundfarbe ======== */
function chgBox(cur,group)
{
	for(var i=0;document.getElementById(group+i);i++) 
	    document.getElementById(group+i).className="tdBorder";

	cur.className="cmdDwn";

	bgColor=cur.style.backgroundColor;
}

function chgColor(cur,group)
{
    var curColor=cur.style.backgroundColor, newColor;
    
	if(document.getElementById("dlgHelper")) {
		newColor=dlgHelper.ChooseColorDlg(curColor.substr(1,curColor.length));
		cur.style.backgroundColor=newColor;
    
		chgTxtCol(cur,cur.style.backgroundColor);
    }
	else {
		alert("Feature wird von Ihrem Browser nicht unterstützt!");
	}
    chgBox(cur,group);
}

function chgTxtCol(cur,input)
{
    var txtColor;

    // Ändern der Textfarbe
    if(input.length>5)
    {
        txtColor=input.charAt(1)+input.charAt(3);//+input.charAt(5);
        isNaN(txtColor)?cur.style.color="#000080":cur.style.color="#def";
    }
}

/* ======== Transparenz ======== */
function chgVal(sld)
{
	document.getElementById("txtOpac").value=sPosition;
	divOpac=100-sPosition;
}

function moveSld(cur,sld,val)
{
	cur.className="cmdDwn cmdCtrl";
	val=Number(val);
	if(sPosition<5&&val<0)
	    sPosition=0;
	else if(sPosition>95&&val>0)
	    sPosition=100;
	else 
	    sPosition=sPosition+val;
	document.getElementById(sld).style.pixelLeft=sPosition;
	chgVal();
}

/* ======== Haltbarkeitszeit ======== */
function chgTime(fldObj)
{
	var tIn, tOut;
    tIn = parseInt(fldObj.value);

	if(!tIn) return 0;

        if(tIn>59&&fldObj.id!="txtHrs") {
            fldObj.value="";
            alert("Eingaben nur bis 59 zulässig!");
            return 0;
        }
        else {
            tOut=tIn;
        }

	if(isNaN(tOut)) { 
	    fldObj.value="";
	    alert("Bitte nur ganze Zahlen eingeben!");
	    return 0;
	}

	return tOut;
}

function getSecs(d,h,m,s)
{
	if(h.length>1&&h.charAt(0)=="0")
	    h=h.charAt(1);
	if(m.length>1&&m.charAt(0)=="0")
	    m=m.charAt(1);
	if(s.length>1&&s.charAt(0)=="0")
	    s=s.charAt(1);

	return (((parseInt(d)*24+parseInt(h))*60)+parseInt(m))*60+parseInt(s);
}

function setTime(ttl)
{
	var tS4D,tS4H,tS4M;
    var tAll = new Array();

	tAll[0] = parseInt(ttl/86400);
	tS4D = tAll[0]*24;
	tAll[1] = Math.abs(parseInt(ttl/3600-tS4D));
	tS4H = (tS4D+tAll[1])*60;
	tAll[2] = Math.abs(parseInt(ttl/60-tS4H));
	tS4M = (tS4H+tAll[2])*60;
	tAll[3] = Math.abs(parseInt(ttl-tS4M));

	// führende '0' hinzufügen
	if(tAll[1]<10) tAll[1]="0"+tAll[1];
	if(tAll[2]<10) tAll[2]="0"+tAll[2];
	if(tAll[3]<10) tAll[3]="0"+tAll[3];

	return tAll;
}
