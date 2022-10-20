/*====================================================================*/
/*=========================== ContextMenu ============================*/
/*====================================================================*/

var subMenu=0; // SubMenuFlag
var txtObj=0, txtObjSel;

function showMenu() 
{
    var menuType, cltLeft=0, cltTop=0;

    curObj = event.srcElement;

    // Menütyp auswählen
    if(event.srcElement.id.charAt(0)=="C"||txtObj!=0) 
        menuType="editMenu";
    else 
        menuType="conMenu";

    // Mausposition ermitteln
    if(event.clientX > document.body.clientWidth-document.getElementById(menuType+"Tbl").style.pixelWidth)
        cltLeft = event.clientX-document.getElementById(menuType+"Tbl").style.pixelWidth; 
    else
        cltLeft = event.clientX-1; 
    if(event.clientY > document.body.clientHeight-document.getElementById(menuType+"Tbl").style.pixelHeight)
        cltTop = event.clientY-document.getElementById(menuType+"Tbl").style.pixelHeight; 
    else
        cltTop = event.clientY-1; 

    // Menü anzeigen
    eval(menuType + ".style.visibility = 'visible'");
    eval(menuType + ".style.pixelLeft=" + cltLeft);
    eval(menuType + ".style.pixelTop=" + cltTop); 

    /*======== SubMenu ========*/
    if(subMenu) hideSubMenu();

    return false; // Richtiges Kontextmenü verstecken
} 

function hideMenu()
{
    conMenu.style.visibility="hidden";
    hideSubMenu();
}

function cntOver(src)
{
    if(src.className!="menuDis") {
        src.className="menuOn";
    }
    /*======== SubMenu ========*/
    if(subMenu) hideSubMenu();

}

function cntOut(src)
{
    if(src.className!="menuDis") {
        src.className="menuOut";
    }

}

function cntClick(src, val)
{
    if(src.className!="menuDis" && val) {
        hideMenu();
        eval(val);
    }
}

/*========================= Context SubMenu ==========================*/

function showSubMenu(src,name,pos) 
{
    // verstecke Altes, wenn vorhanden
    hideSubMenu();
    
    subMenu=document.getElementById("subMenu"+name);

    if(src.style.color!="#808080")
	src.className="menuOn";
    
    subMenu.style.visibility="visible";
    subMenu.style.pixelLeft=src.parentNode.parentNode.parentNode.style.pixelLeft +
            src.parentNode.parentNode.style.pixelWidth - 5;
    if(!pos) pos=1;
    subMenu.style.pixelTop=src.parentNode.parentNode.parentNode.style.pixelTop+pos;

//    subMenu.style.zIndex=src.parentNode.parentNode.parentNode.style.zIndex+1;

}

function hideSubMenu() 
{
    if(subMenu) {
        subMenu.style.visibility="hidden";
        subMenu=0;
    }
}

function cntSubOver(src,prntSrc)
{
    if(src.style.color!="#808080")
	src.className="menuOn";
    if(prntSrc) document.getElementById(prntSrc).className="menuOn";
}

function cntSubOut(src,prntSrc)
{
    src.className="menuOut";
    if(prntSrc) document.getElementById(prntSrc).className="menuOut";

}

/*========================== edit functions ==========================*/
function txtOps(cmd,para,dlg) // Cut, Copy, Paste
{
    var range,insText;
    if(!dlg) dlg=false;
    
    // Problem: Beim Auswählen des Befehls wird die Selektion aufgehoben

    // Kontextmenü nach Aufruf verstecken
    editMenu.style.visibility="hidden";
    
    if(typeof document.selection!="undefined") {
        txtObj.focus(); 
        
        // Einfügen Formatierungscode (für copy/paste)
        range=document.selection.createRange();
        insText=range.text;

        // Befehl ausführen
        document.execCommand(cmd, dlg, para);

	    // Anpassen der Cursorposition
	    range=document.selection.createRange();
	    if(insText.length==0) 
	        range.move('character',-3);
	    else
	        range.moveStart('character',3+insText.length+3);
	} 
}

function txtFrm(cmd,para,dlg) 
{
    var range, fntSize=2;
    if(!dlg) dlg=false;
    
    if(typeof document.selection!="undefined") {
        txtObj.focus(); 
        
        range=document.selection.createRange();

        switch(cmd) {
            case "BR":
                range.pasteHTML("<br />"); // write Only
                break;
            case "P":
                range.pasteHTML("<p>"+range.htmlText+"</p>");
                break;
            case "HR":
                range.pasteHTML("<hr />");
                break;
            /*case "Bold":
                range.pasteHTML("<b>"+range.text+"</b>");
                break;
            case "Italic":
                range.pasteHTML("<i>"+range.text+"</i>");
                break;*/
            case "FontSizeRel":
                if(!isNaN(parseInt(range.parentElement().size)))
                    fntSize=range.parentElement().size;
    //setMsg(range.parentElement().tagName + "=" + fntSize + "\n" + range.htmlText);
                
                if(para=="+1") fntSize++;
                else if(para=="-1") fntSize--;
                else fntSize=para;

                if(fntSize>0 && fntSize<8)
                {
                    if(document.getElementById("fntSze")) // wenn Objekt existiert
                        document.getElementById("fntSze").options[fntSize-1].selected=true;
                    document.execCommand('FontSize', dlg, fntSize);
                }
                break;
            default:
                document.execCommand(cmd, dlg, para);
                break;
	    }
        
        // Anpassen der Cursorposition
        
	    range=document.selection.createRange();
	    if(range.htmlText.length==0) 
	        range.move('character',-3);
	    else
	        range.moveStart('character',3+range.htmlText.length+3);
        
	} 
}

function txtParse()
{
    var range="", i=0, j=0;
    var curTag, aryTag= new Array();
    //var regExp = new RegExp(".e","i"), result = 0;
    var fntFace = document.getElementById("fntFce");
    var fntColor = document.getElementById("fntClr");
    
    if(txtObj) {
        // gesamten Text merken
        txtAll=txtObj.innerHTML;
        
        if(typeof document.selection!="undefined") {
            txtObj.focus(); 
            
            // Ausgewählten Text merken
            range=document.selection.createRange();
            
            curTag=range.parentElement();
            // Solange noch im DIV
            while(curTag.id.slice(0,4)!="note") 
            {
                // Wenn nicht mehr DIV
                if(curTag.tagName=="BODY") break;
                
                // Jedes Tag in Array
                aryTag[i]=curTag; //.tagName+", "+i;
                
                // Nächthöheres Element
                curTag=curTag.parentElement;
                
                i++;
            }
            
            // Eigenschaften zurücksetzen
            document.getElementById("B").className="tdTlB";
            document.getElementById("I").className="tdTlB";
            document.getElementById("U").className="tdTlB";
            document.getElementById("A").className="tdTlB";
            document.getElementById("center").className="tdTlB";
            document.getElementById("right").className="tdTlB";
            fntColor.options[0].selected="true";
            fntFace.options[0].selected="true";
            document.getElementById("fntSze").options[1].selected="true";
            
            // Symbole markieren
            while(i>0)
            {
                i--;
                switch(aryTag[i].tagName)
                {
                    case "B", "STRONG":
                        document.getElementById("B").className="cmdDwn";
                        break;
                    case "I", "EM":
                        document.getElementById("I").className="cmdDwn";
                        break;
                    case "U":
                        document.getElementById("U").className="cmdDwn";
                        break;
                    case "A":
                        document.getElementById("A").className="cmdDwn";
                        break;
                    case "UL":
                        document.getElementById("UL").className="cmdDwn";
                        break;
                    case "OL":
                        document.getElementById("OL").className="cmdDwn";
                        break;
                    case "P":
                        if(aryTag[i].align!="") {
                            document.getElementById("left").className="tdTlB";
                            document.getElementById(aryTag[i].align).className="cmdDwn";
                        }
                        break;
                    case "FONT":
                        if(aryTag[i].color) {
                            for(j=0;j<fntColor.length;j++) 
                            {
                                if(fntColor.options[j].style.color==aryTag[i].color) {
                                    fntColor.options[j].selected="true";
                                    break;
                                }
                            }
                        }
                        if(aryTag[i].face!="") { // Schriftart wählen
                            for(j=0;j<fntFace.length;j++) 
                            {
                                if(fntFace.options[j].innerText==aryTag[i].face) {
                                    fntFace.options[j].selected="true";
                                    break;
                                }
                            }
                        }
                        if(aryTag[i].size) { // Größe von 1 bis 7 wählen
                            document.getElementById("fntSze").options[aryTag[i].size-1].selected="true";
                        }
                        break;
                }
            }            
        }
        
        /*tmp=          "Array: <br>";
        if(aryTag[0]) tmp+=aryTag[0].tagName+"<br>";
        if(aryTag[1]) tmp+=aryTag[1].tagName+"<br>";
        if(aryTag[2]) tmp+=aryTag[2].tagName+"<br>";
        if(aryTag[3]) tmp+=aryTag[3].tagName+"<br>";
        if(aryTag[4]) tmp+=aryTag[4].tagName+"<br>";
        if(aryTag[5]) tmp+=aryTag[5].tagName+"<br>";
        if(aryTag[6]) tmp+=aryTag[6].tagName+"<br>";
        
        setMsg(tmp);*/
    }
}

function frmOvr(src)
{
    if(src.className!='cmdDwn')
        src.className='cmdOvr';
}

function frmOut(src)
{
    if(src.className=='cmdOvr')
        src.className='tdTlB';
}
