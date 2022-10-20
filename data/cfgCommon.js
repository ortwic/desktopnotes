/* ======== Registerkarte ======== */
function chgReg(src,reg)
{
    if(src.className!="cmdDis")
    {
    	for(var i=0;document.getElementById("reg"+i);i++) 
        {
    	    if(document.getElementById("regCmd"+i).className!="cmdDis") 
            {
                document.getElementById("regCmd"+i).className="tdBorder";
                document.getElementById("reg"+i).style.display = "none";
            }
        }    
    	src.className="cmdDwn";
        document.getElementById(reg).style.display = "block";
    }
}

function cmdOvr(src)
{
    if(src.className!='cmdDwn'&&src.className!='cmdDis')
        src.className='cmdOvr';
}

function cmdOut(src)
{
    if(src.className=='cmdOvr')
        src.className='tdBorder';
}

/* ======== Checkbox ======== */
function chgRadBtn(src,value)
{
    if(value>0) {
        value=0;
        src.className="cmdOvr";
	} else {
        src.className="cmdDwn";
        value=1;
    }
    return value;
}

function chgBox(group,value)
{
    if(!document.getElementById(group+value)) {value=0;}
    
	for(var i=0;document.getElementById(group+i);i++) {
	    document.getElementById(group+i).className="tdBorder";
    }
	document.getElementById(group+value).className="cmdDwn";

    return value;
}

function chgSubBox(src,value)
{
    if(src.className=="cmdDwn") {
        src.className="cmdOvr";
	} else {
        src.className="cmdDwn";
        value++;
    }

    return value;
}

/*===================== hex/dez-converting =====================*/
function hextodez(hexN) 
{
    if (hexN.length!=2) return0;
    var d1=replacevals(hexN.charAt(0));
    var d2=replacevals(hexN.charAt(1));

    return (16 * d1 + 1 * d2);
}

function replacevals(n) {

    if (n == "a") { n = "10"; }
    if (n == "b") { n = "11"; }
    if (n == "c") { n = "12"; }
    if (n == "d") { n = "13"; }
    if (n == "e") { n = "14"; }
    if (n == "f") { n = "15"; }

    return n
}

function replacevalsreverse(thenum) 
{
    if (thenum == 10) { thenum = "a"; }
    if (thenum == 11) { thenum = "b"; }
    if (thenum == 12) { thenum = "c"; }
    if (thenum == 13) { thenum = "d"; }
    if (thenum == 14) { thenum = "e"; }
    if (thenum == 15) { thenum = "f"; }

    return thenum;
}

function deztohex(num) 
{
	if(num<16) hNum="0"+calc10to16(num);
	else hNum=calc10to16(num);
	return hNum;
}

function calc10to16(num) 
{
    if (num < 16) {
        var thenum = replacevalsreverse(num);
        return thenum;
    } else {
        var themod=num % 16;
        var thenum=((num-themod) / 16);
        thenum = replacevalsreverse(thenum)
        themod = replacevalsreverse(themod)

        return ""+thenum+themod
    }
}

/*===================== Slider =====================*/
// Slider script by Ronald H. Jankowsky (http://rj-edv-beratung.de)
// modified by Ortwin (http://ortwin.qu.am) :-b
// This script is free for use, please leave this notice intact
var sPosition,g_sldGMax;
// document.onmousedown=dragLayer;
document.onmouseup=new Function("dragMe=false");

// Drag and move engine (original code by DynamicDrive.com), don't change unless explicitely indicated
var dragMe=false, kObj, xPos,direction

function moveLayer() 
{
if (event.button==1 && dragMe) {
	oldX = kObj.style.pixelLeft; kObj.style.pixelLeft=temp2+event.clientX-xPos; 
// Limit movement of knob to stay inside layer
	if (kObj.style.pixelLeft > oldX) direction="dn"; else direction="up";
	if (kObj.style.pixelLeft < 0 && direction=="up") {kObj.style.pixelLeft=0; direction="dn";}
	if (kObj.style.pixelLeft > g_sldMax && direction=="dn") {kObj.style.pixelLeft=g_sldMax; direction="up";}
// Set working variable 'showPerc' depending on 100 or 250 scaling
	sPosition=kObj.style.pixelLeft; 

// The following line should be replaced by the function-call with the actual task to perform
	chgVal(kObj.id); 
	return false; }
}

function dragLayer(sldMax) {
    if (!document.all) return;
    if (event.srcElement.className=="sldCtrl") {
	dragMe=true; 
	g_sldMax=sldMax;
	kObj=event.srcElement; 
	temp2=kObj.style.pixelLeft; 
	xPos=event.clientX;
 	document.onmousemove=moveLayer; 
    }
}

function chgSld(sld,src,sldMax) // Change value via textfield
{
	if(isNaN(src.value)||src.value=="") return 0;
	src.value=Number(src.value);
	if(src.value>sldMax) src.value=sldMax;
	if(src.value>=0) {
		document.getElementById(sld).style.pixelLeft=sPosition=Number(src.value);
		// The following line should be replaced by the function-call with the actual task to perform
	    chgVal(sld); 
		return 1;
	}
}
