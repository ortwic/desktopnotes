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
