  // Konstanten
  var gFilName="notes.dat"; // Dateiname zum speichern
  var gVers="0.5.2"; // Version
      document.title+=" "+gVers; // Eigentlich nicht notwendig, da als ActiveDesktop nicht sichtbar

  
  // Variablen für Einstellungsdialog
  var gCfgIdAry=new Array("bgCol","bgImg","bgStyle","txtStyle","menuOpac","menuShdw","delGray","delBlur","txtOflw","savStyle","savPath");
  var gCfgHsh=new Object();

  // Hash, der alle Klasseninstanzen von CNote enthalten wird
  var gNotes=new Object();
  
  //aktuelles Objekt
  var curDiv; 
  // Variablen für Drag'n'Drop
  var startX,startY,Xpos,Ypos,Xval=0,Yval=0,Wpos=0,Hpos=0; 

  // Anmerkung: 2147483647 (=2^31-1) scheint max. zIndex zu sein,
  // (-2147483648 bis 2147483647 ist Bereich des zIndex) deshalb:
  var zMax = Math.pow(2,30);

  // Sonsitges
  var timer,dblclk=0; //für Doppelklick-Workaround
  var gIntId=0;      // aktuelle ID-Nummer für Notes
  var gSelId;         // Selektiertes ClassNote
  var lastId=0;       // zuletzt selektiertes ClassNote
  var lastInd=1;      // Höchste Ebene
  var drgMode=true;   // Dragmodus / Bearbeitungsmodus
  var gShadow="";     // 3D-Schatten Ja/Nein
  var gEditMode=0;    // Typ des Bearbeitungsmodus
  var gOverflow="auto";
  var curObj=0;
  
/*====================================================================*/
/*=========================== Div-Management =========================*/
/*====================================================================*/
function newDiv()
{
    var noteId;
    
    // Neues Div erzeugen
    noteId="note"+gIntId;
    lastInd++;
    gNotes[noteId]=new CNote(noteId,lastInd);
    gNotes[noteId].drwDiv();

    // ID-Nummer hochzählen
    gIntId++;

    return 1;
}

function loadDiv()
{
    var noteId, i=0;
    var dataHsh=new Object(); // Hash für Daten
    var zArray=new Array(); // Array für z-Index

    // Lade gespeicherte Daten
    if (gCfgHsh["savStyle"]==0) {
        dataHsh=getCookie();
    }
    else if (gCfgHsh["savStyle"]>0) {
        dataHsh=getFileData();
    }
    else {
        firstDiv();
        // setMsg("Konnte gespeicherte Notes nicht laden!");
        return 0;
    }

    // Erzeuge Klasseninstanzen
    for(noteId in dataHsh)
    {
        if(noteId!="config")
        {
            // pro Arrayzelle eine Objektinstanz
            gNotes[noteId]=new CNote(noteId,0); 
            // Inhalte aus Cookie holen und laden
            gNotes[noteId].lodNote(dataHsh[noteId]);
            // zIndex in Array speichern
            zArray[i]=gNotes[noteId].zInd;
            i++;
            
            // Index aktualisieren
            if(lastInd<=gNotes[noteId].zInd)
                lastInd=gNotes[noteId].zInd;
                
            // ID-Nummer ausfiltern und speichern (wird aktuelle ID)
            var maxId=parseInt(noteId.slice(noteId.indexOf('e')+1,noteId.length))+1;
            if(gIntId<maxId) gIntId=maxId;
        }
    }
    
    // Wenn zIndex über das Maximum, zIndizes neu vergeben
    if(lastInd > zMax) { 
        zArray=zSort(zArray);
        lastInd=zArray.length+1;
        zMax=1;
    }

    i=0;
    for (k in gNotes) 
    {
        // zIndex neu sortieren, wenn benötigt
        if(zMax==1) { 
            gNotes[k].zInd=zArray[i]; // Neuen zIndex laden
            savDiv(k); // Neuen zIndex speichern
            i++;
        }

        // grafische Darstellung vom Div
        gNotes[k].drwDiv();
        // Löschwarnung wenn aus Cookie geladen
        if(gCfgHsh["savStyle"]==0) gNotes[k].setWarning(); 
    }
    
    return 1;
}

function savDiv(noteId)
{
    // nur wenn im Cookiemodus
    if(gCfgHsh["savStyle"]==0) 
    {
        // Speichere Daten in Cookie
        gNotes[noteId].savNote();
    }
}

function delDiv()
{
    var chk, delFilter="";
    
    if(gCfgHsh["delGray"]>0) delFilter=" gray()";
    if(gCfgHsh["delBlur"]>0) delFilter+=" progid:DXImageTransform.Microsoft.Blur(pixelradius="+gCfgHsh["delBlur"]+")";
    //delFilter+=" progid:DXImageTransform.Microsoft.engrave()";
    //delFilter+=" progid:DXImageTransform.Microsoft.emboss()";
    //delFilter+=" progid:DXImageTransform.Microsoft.Pixelate(maxSquare=8)";

    if(lastId) {
        // Nicht betroffene Elemente ausgrauen
        document.getElementById("dsktp").style.filter=delFilter;
        drwFilters(delFilter, lastId);
        
        // Löschfunktion aufrufen
        chk = gNotes[lastId].delNote(); 
        
        // Elemente einfärben
        document.getElementById("dsktp").style.filter="";
        drwFilters();
        if(chk) {
            delete gNotes[lastId]; // Objektinstanz löschen
            if(gCfgHsh["savStyle"]>1) savFilData();
            lastId=0; // Auswahl des letzten Div's aufheben
        }
    }
    else
        setMsg("Kein Element zum L&ouml;schen ausgew&auml;hlt.","","Auswahl",3200);
}

function firstDiv()
{
        noteId="note"+gIntId;
        gNotes[noteId]=new CNote(noteId,1);

        gNotes[noteId].left = document.body.clientWidth/2-160;
        gNotes[noteId].top = document.body.clientHeight/2-160;
        gNotes[noteId].width = 320;
        gNotes[noteId].height = 320;
        gNotes[noteId].txt = "<font size='+1'>Desktop-Notes</font><hr>" + 
    "<br>Alle wichtigen Befehle erreichen Sie über das Kontextmenü, dass sich mit einem Rechtsklick &ouml;ffnen lässt. " +
    "Sie k&ouml;nnen neue Notizen erstellen oder l&ouml;schen. Erst eine Texteingabe oder das Verschieben einer neu " +
    "erstellten Notiz speichert sie. Zum L&ouml;schen muss eine Notiz einfach angeklickt werden und der Befehl " +
    "&quot;L&ouml;schen&quot; aus dem Kontextmenü gewählt werden. Mit gedr&uuml;ckter &quot;Shift&quot; Taste l&auml;sst " +
    "sich die Gr&ouml;&szlig;e der Notizen ver&auml;ndern. Die Haltbarkeitszeit ist auf 30 Tage vorgegeben und "+
    "l&auml;sst sich im Eigenschaftmen&uuml; auf die Sekunde genau festlegen. <br>" +
    "<hr>Im Kontextmenü finden sich noch diverse Verweise auf JavaScript-Referenzen und weitere " +
    "Bedienungshinweise.";

        gNotes[noteId].drwDiv();
        gIntId++;

        return 0;
}

/*==== Funktion wird genutzt, wenn zIndex zu groß ====*/
function zSort(aIn)
{ 
    var i, k, max, len=aIn.length;
    var aOut = new Array(len);

    for(i=0;i<len;i++)
    {
        max=i;
        for(k=0;k<len;k++)
        {
            if(aIn[max] < aIn[k]) max=k;
        }
        aOut[max]=len-i;
        aIn[max]=0;
    }
    return aOut; 
}

/*============================ drag'n'drop ===========================*/

function drgstr(e)
{
    if(txtObj!=0) // Wenn im Bearbeitungsmodus
    {
        blrDsktp();
        return 0;
    }

    // Drag'n'Drop starten, wenn aktiv
    if(drgMode==true) 
    { 
        var srcObj=event.srcElement;

        // Suche Drag'n'Drop fähiges Element        
        while(srcObj.id.indexOf("note")) // Bis ID "note" enthält
        {
            // Nimm Elternelement
            srcObj=srcObj.parentElement;

            // Bis alle Tags durch sind
            if(srcObj.tagName=="HTML" || srcObj.tagName=="html") 
                return 0;
        }

        // Arbeitsobjekt = Quellobjekt
        curObj=srcObj;
        
        hideMenu(); 

        startX=event.clientX;
        startY=event.clientY;
            
        gSelId=curObj.id;
        lastInd++;
        gNotes[gSelId].zInd=curObj.style.zIndex=lastInd;

        // Ausgangsposition für mov(); festlegen
        Xpos=curObj.style.pixelLeft;
        Ypos=curObj.style.pixelTop; 
        Wpos=curObj.style.pixelWidth;
        Hpos=curObj.style.pixelHeight;

        document.onmousemove=mov;

        // letztes Div verliert Focus
        if(lastId) gNotes[lastId].div.style.borderColor="#808080";
        if(gCfgHsh["savStyle"]>1) savFilData();
        // neues Div erhält Focus
        gNotes[gSelId].div.style.borderColor="#FFF";    

        return 1;
    }
}

function mov(e)
{
  if(gSelId) {
    if(window.event.shiftKey) {
        Xval=event.clientX-startX+Wpos;
        Yval=event.clientY-startY+Hpos;
        gNotes[gSelId].setSize(Xval,Yval); //schnelle Methode
    }
    else {
        Xval=event.clientX-startX;
        Yval=event.clientY-startY;
        curObj.style.left = Xpos+Xval;
        curObj.style.top = Ypos+Yval;
    }
    // Soll das beim ziehen das Selection-Objekt richtig darstellen
    if(document.selection && document.selection.empty) document.selection.empty();
  }
}

function drpstp(e)
{
    // Drag'n'Drop stoppen, wenn aktiv
    if(drgMode==true) {
        if(curObj==0 || !gSelId) return 0; // Da bei IE beim dblclk nur mouseup,

        /*======== Doppelklick Workaround =========*/

        // IE registriert nur 'mouseup' beim Doppelklick
        if(window.event.type=="mouseup") dblclk++; // Doppelklick scharf machen

        // Selbes Objekt muss angeklickt sein
        if(dblclk>1 && lastId==gSelId) { 
            dblclk=0;
            clearTimeout(timer);
            editContent(gSelId);
        }
        else // Doppelklick nach 1.2s entschärfen 
            timer = setTimeout("dblclk=0",1200);
        /*=========================================*/

        // Neue Position in Klasse speichern
        gNotes[gSelId].setPos(parseInt(curObj.style.left),parseInt(curObj.style.top));
        // Cookie speichern
        savDiv(gSelId); 

        lastId=gSelId;
        gSelId=""; //aktuelles Objekt verliert Focus
        // Auswahl Drag-Objekt löschen
        curObj=0;
    }
    else {
        // Wenn im WYSIWYG-Mode
        if(gEditMode==0) {
            // markierten Text parsen
            txtParse();
            return 0;
        }
    }
 
    return 1;
}

/*======================= edit text of div's =========================*/
function editContent(cellId)
{
    dblclk=0; // Vermeidung eines 2. Aufrufes der Funktion
    
    var srcObj,editForm;
    
    if(cellId) {
        srcObj=document.getElementById(cellId);
        if(gEditMode==0) {
            drgMode=false;
            txtObj=srcObj; // lokal zu global
            txtObj.contentEditable = true;
            txtObj.focus();
            
            // Anpassen des Hintergrunds für Schriftfarbe
            document.getElementById("fntClr").style.background=gNotes[lastId].bgCol;
            // Bearbeitungssymbolleiste sichtbar machen
            editForm = document.getElementById("editForm");
            editForm.style.pixelLeft = txtObj.style.pixelLeft;
            if(txtObj.style.pixelTop + txtObj.style.pixelHeight + editForm.style.pixelHeight > document.body.clientHeight)
                editForm.style.pixelTop = txtObj.style.pixelTop - editForm.style.pixelHeight; // darüber
            else
                editForm.style.pixelTop = txtObj.style.pixelTop + txtObj.style.pixelHeight; // darunter
            // Sichtbar machen
            editForm.style.display = "block";
        } 
        else if(gEditMode==1) {   
            var txtbox = "Con_"+cellId; // name darf nicht mit 'n' anfangen!

            srcObj.style.padding="0px";
            srcObj.innerHTML = "<TEXTAREA ID='" + txtbox + 
                "'>" + srcObj.innerHTML + "</TEXTAREA>";

            txtObj=document.getElementById(txtbox); // für Edit-Menü
            txtObj.style.width = gNotes[lastId].div.style.pixelWidth - 2;
            txtObj.style.height = gNotes[lastId].div.style.pixelHeight - 4;

            // Focus erst nach 20ms setzen, um Setzung zu garantieren (Bug im IE?)
            setTimeout("document.getElementById(\""+txtbox+"\").focus();",20)
        }
        else if(gEditMode==2)
            setMsg("Textbearbeitung gesperrt!","color:#D80000;font-weight:bold");
    }
    else
        setMsg("Kein Element zum Bearbeiten ausgew&auml;hlt.","","Auswahl",3200);
}

function editQuit()
{
    if(document.getElementById("editForm").style.display=="block")
    {
        gNotes[lastId].div.contentEditable=false; // Editmodus beenden
        gNotes[lastId].txt=gNotes[lastId].div.innerHTML;
        savDiv(lastId);
        document.getElementById("editForm").style.display="none";
    }
}

function setCell(cell) 
{
    if(parseInt(gEditMode)==1 && cell.tagName!="textarea") 
    {
        cell.parentElement.style.padding="2px";
        gNotes[lastId].txt = cell.value;
        cell.parentElement.innerHTML = cell.value;
        savDiv(lastId); 
    }
}

/*======================= open Config-Dialog =========================*/

function cfgWdw(cfgName) 
{
    var dlgSets=new Array();
    var backVal=new Array();
    
    switch (cfgName) {
        case "cfgDiv": 
            if(lastId) {
                gNotes[lastId].cfgDiv(gCfgHsh["savStyle"]);
                savDiv(lastId); // Note in Cookie speichern
                if(gCfgHsh["savStyle"]==0) gNotes[lastId].setWarning();
            }
            else
                setMsg("Kein Element ausgew&auml;hlt.","","Auswahl",3200);
            break;
        case "cfgDsktp":
            if(gCfgHsh) dlgSets=gCfgHsh; // Wenn Inhalt vorhanden
            //else dlgSets[0]=DeskTop.style.backgroundColor; //überflüssig

            backVal=window.showModalDialog("data/cfgDsktp.htm",dlgSets,"center:1;help:0;scroll:0;status:0;unadorned:1");

            if(backVal) {
                setDsktp(backVal); // Einstellung im Cookie speichern
                drwDsktp(backVal); // Darstellung aktualisieren
                drwFilters(); // Zeichne Filter neu (3D-Schatten)

                // Wenn Daten in Datei gespeichert werden
                if(backVal["savStyle"]>0) {
                    // Dateipfad neu initialisieren
                    initFSO(backVal["savPath"], gFilName);
                    // "Daten Speichern" einblenden
                    document.getElementById("cntSav").className="";
                } else {
                    // Ansonsten "Daten Speichern" ausblenden
                    document.getElementById("cntSav").className="menuDis";
                }
            }
            break;
        case "cfgInfo":
            dlgSets[0] = gVers;
            window.showModalDialog("data/cfgInfo.htm",dlgSets,"center:1;help:0;scroll:0;status:0;unadorned:1");
            break;
    return 1;
    }
}

/*====================================================================*/
/*========================== FileSystemObject ========================*/
/*====================================================================*/
function savFilData()
{
    var data=new Array();
    var id=0, msg=0;
    
    for (id in gNotes) 
    {
        // nur wenn zIndex geändert wurden
        data[id]=gNotes[id].getDataString();
    }

    msg=setFileData(data);
    if(msg!=1) 
        setMsg(msg);
    return 0;
}

function lodFilData(file)
{
    var data=new Array(), dataString;

    if(!file) return 0;
    if(file==1) {
        data=getFileData();
        dataString=gCfgHsh["savPath"]+gFilName;
    } 
    if(file==2) {
        data=getCookie();
        dataString="Cookie";
    }
    
    dataString+="<br><textarea rows='20' cols='80'>";
    
    for(id in data)
    {
        // Schreibe Zeile
        dataString += id + "=" + data[id] + "\n\n";
    }
    dataString+="</textarea>";
    
    setMsg(dataString);
}

/*====================================================================*/
/*============================ Desktop Cfg ===========================*/
/*====================================================================*/

function drwDsktp(data)
{
    var ctmOpac, filterData;

    // Hintergrundfarbe
    if(data["bgCol"]) {
        document.getElementsByTagName("body")[0].style.background=data["bgCol"];
        DeskTop.style.backgroundColor=data["bgCol"]; 
    }
    loadImg(data["bgImg"],"dsktp",data["bgStyle"],0); 

    // 3D-Schatten
    if(data["menuShdw"]>0)
        gShadow = " progid:DXImageTransform.Microsoft.shadow(color=black, direction=135);";
    else
        gShadow = "";

    /*============== Kontextmenü ==============*/
    // Wenn Daten in Datei gespeichert werden
    if(gCfgHsh["savStyle"]>0) 
    {
        // Dateipfad initialisieren
        initFSO(gCfgHsh["savPath"], gFilName);
    } else {
        // Ansonsten "Daten Speichern" ausblenden
        document.getElementById("cntSav").className="menuDis";
    }
    if(data["menuOpac"]) ctmOpac=data["menuOpac"];
    else ctmOpac=0;

    // Kontextmenüschatten
    if(conMenu) { // Wenn Kontextmenü existiert
        filterData="alpha(opacity=" +(100-parseInt(ctmOpac))+ ")" +gShadow;
        conMenu.style.filter=filterData; // Kontextmenü
        document.getElementById("subMenuExp").style.filter=filterData;
        editMenu.style.filter=filterData;
        document.getElementById("editForm").style.filter=filterData; // Div-Edit Toolbar
    }
    /*=========================================*/ 
    
    // MsgBox-Opazität und -Schatten
    if(document.getElementById("msgBox")) {
        document.getElementById("msgBox").style.filter=filterData;
    }
    
    // Textmodus zuweisen
    gEditMode=data["txtStyle"];
    // Overflowverhalten
    switch (parseInt(data["txtOflw"])) {
        case 1:
            gOverflow="visible";
            break;
        case 2:
            gOverflow="hidden";
            break;
        case 3:
            gOverflow="scroll";
            break;
        default:
            gOverflow="auto";
            break;
    }
}

function drwFilters(addFilter, excl)
{
    var divObj;

    if(!addFilter) {addFilter="";}
    
    for (i in gNotes) 
    {
        // Prüfe, ob Element existent
        if(document.getElementById(gNotes[i].id)) {
            divObj=document.getElementById(gNotes[i].id);
        } else {
            return 0;
        }
        if(i!=excl) { // nicht auf Ausschluss anwenden
            divObj.style.filter="alpha(opacity=" +gNotes[i].opac+ ")" +gShadow +addFilter;
        }
    }
}

function setDsktp(dataHsh) // Desktop aus Hash speichern
{
    var i = 0;
    var now = new Date(), savState, ckiData="";
    var ttl=2922*86400+now.getTime()/1000; // Einstellung f. 8 Jahre

    if(dataHsh) {
        while(gCfgIdAry[i])
        {
            if(!dataHsh[gCfgIdAry[i]]) dataHsh[gCfgIdAry[i]]=0; // leere Inhalte mit 0 füllen
            ckiData+=dataHsh[gCfgIdAry[i]]+'|'; // Daten in String verpacken
            gCfgHsh[gCfgIdAry[i]]=dataHsh[gCfgIdAry[i]]; // Daten global aktualisieren
            i++;
        }
    } else {
        setMsg("Keine gespeicherte Konfiguration gefunden.","color:navy","Desktopeinstellungen");
        return 0;
    }

    savState=setCookie("config",ckiData.slice(0,ckiData.length-1),ttl);
    
    if(savState!=1) {
        setMsg("<p>Konnte Einstellungen f&uuml;r Desktop nicht speichern!</p>(Nur noch <b>"+
        (4096-document.cookie.length)+
        "</b> Bytes von <b>4096</b> Bytes frei)","color:#C00000","Speichervorgang",0);
    }
}

function getDsktp(data) // Desktop aus String laden (nur bei vorhandenem "config"-Cookie)
{
    var i=0;
    var aryData=new Array(); 
    
    if(data) {
        aryData=data.split('|');
        while(aryData[i])
        {
            gCfgHsh[gCfgIdAry[i]]=aryData[i];
            i++;
        }
        return 1;
    } else {
        setMsg("Keine gespeicherte Konfiguration gefunden.","color:navy","Desktopeinstellungen");
        return 0;
    }
}

function blrDsktp() 
{
    var srcObj=event.srcElement;

    if(txtObj!=0) // Wenn im Bearbeitungsmodus
    {
        // Wenn Klick auf Menüeinträge -> Abbruch
        if(event.srcElement.tagName=="td"||event.srcElement.tagName=="TD") return 0;
            
        // Prüfe, ob in bearbeitendes Div geklickt wurde
        while(srcObj.id.indexOf(txtObj.id)) // Solange ID nicht mit txtObj identisch
        {
            // Nimm Elternelement
            srcObj=srcObj.parentElement;

            // Bis alle Tags durch sind
            if(srcObj.tagName=="HTML" || srcObj.tagName=="html") 
            {
                if(parseInt(gEditMode)==0) // WYSIWYG-Modus
                { 
                    editQuit(); // contentEditable beenden und Menü's verstecken 
                } 
                else if(parseInt(gEditMode)==1) // HTML-Modus
                {
                    setCell(txtObj);
                }
                // Objekt zerstören
                txtObj=0;
                // Drag'n'Drop erlauben
                drgMode=true;
                // Cut'n'Paste Menü verstecken
                editMenu.style.visibility="hidden";
                break;
            }
        }
    }
    else 
    {
        // Alle möglichen Kontextmenüs verstecken
        hideMenu();
        if(lastId) // Sicherstellung, das letztes Objekt existiert 
        { 
            gNotes[lastId].div.style.borderColor="#808080";
            if(gCfgHsh["savStyle"]>1) savFilData();
            lastId=0;
        }
    }
}

/*============================ Desktop Msg ===========================*/
function setMsg(msg,stil,title,timer)
{
    var msgBox=document.getElementById("msgBox");

    if(!title) title="Desktop-Notes "+gVers;
    
    document.getElementById("msgBoxTitle").innerHTML = "&nbsp;" + title; 
    document.getElementById("msgBoxText").innerHTML = "<span style='" +stil+ "'>" +msg+ "</span>";

    // Position erst nach Inhalt, damit Maße korrekt bestimmt werden
    msgBox.style.left = (document.body.clientWidth-msgBox.childNodes[0].style.pixelWidth-3) /2;
    msgBox.style.top = (document.body.clientHeight-msgBox.childNodes[0].style.pixelHeight) /2;
    msgBox.style.visibility = "visible";
 
    if(timer) setTimeout("hideMsg()",parseInt(timer));
}

function hideMsg()
{
    document.getElementById("msgBox").style.visibility = "hidden";
}

/*====================================================================*/
/*====================== export data of div's ========================*/
/*====================================================================*/
function expDiv(typ)
{
    hideSubMenu();

    var expData, k = 0;
    var expDok = window.open("about:blank","_blank");
    
    expData = "<html><head>\n<title>Exportierte Daten '" + typ +
        "'</title>\n</head>\n<body>";
        
    if(typ=='CODE')
    {
        expData+="<textarea id='cookie' style='width:100%;height:100%;'>";
        for (i in gNotes) {
            expData+=gNotes[i].id + "=" + gNotes[i].getDataString()+"\n\n";
        }
        expData+="</textarea>";
    } else 
    {
        expData += "\n<style type='text/css'>\n<!--\nbody{font-family:Arial;font-size:10pt;background:white;" +
            "margin: 16px 20px 16px 20px;}textarea{color:black;font-family:Arial;font-size:10pt;" +
            "border:solid 1px #808080;background:white;width:100%;height:16em;overflow:auto;}" +
            "h3{color:#808080;font-size:12pt;font-style:italic;margin: 1em 0 0 0;}\ntd{font-size:10pt}" +
            "-->\n</style>\n";
        if(typ=='TEXT') 
        {
            expData += "\n<table style='width:100%;border:0'>\n";
            for (i in gNotes) 
            {
                if(gNotes[i].txt!=""&&document.getElementById(gNotes[i].id).style.visibility!="hidden")
                {
                    expData+="<tr colspan='3'><td><h3>ID: " + gNotes[i].id + "</h3></td></tr>\n" + 
                        "<tr><td rowspan='6' width='60%'><textarea>" + gNotes[i].txt + "</textarea>" + 
                        "</td><td width='20%'>Position:</td><td width='20%'>" + gNotes[i].left + " / " + gNotes[i].top + "</td></tr>" +
                        "<tr><td>Breite/H&ouml;he:</td><td>" + gNotes[i].width + " / " + gNotes[i].height + "</td></tr>" +
                        "<tr><td>Z-Index:</td><td>" + gNotes[i].zInd + "</td></tr>" +
                        "<tr><td>Farbe:</td><td>" + gNotes[i].bgCol + "</td></tr>" +
                        "<tr><td>Transparenz:</td><td>" + gNotes[i].opac + "</td></tr>" + 
                        "<tr><td>Verfallsdatum:</td><td>" + new Date(gNotes[i].ttl*1000) + "</td></tr>";
                }
            }
            expData += "</table>\n";
        } else if(typ=='HTML') 
        {
            expData += "<style type='text/css'>\n<!--\n.note{color:black;font-size:10pt;white-space:pre;" +
                "display:block;border:solid 1px #808080;padding:2px;overflow:auto;}" +
                "hr{color:#808080;height:1;border-width:1px 0 0 0;border-color:gray}\n-->\n</style>";
            expData += "\n<table style='width:100%;border:0'>\n<tr>";
            for (i in gNotes) 
            {
                if(document.getElementById(gNotes[i].id).style.visibility!="hidden")
                {
                    expData+="\n<td style='vertical-align:top'><h3>ID: "+gNotes[i].id+"</h3>" + 
                        "<div class='note' style='" + 
                        "width:" + gNotes[i].width + ";height:" + gNotes[i].height + 
                        ";filter:alpha(opacity=" + gNotes[i].opac +
                        ");background:" + gNotes[i].bgCol + ";'>" +
                        gNotes[i].txt + "</div></td>";
                    k++;
                    if(k%4==0) 
                        expData+="</tr>\n<tr>";
                }
            }
            expData += "</tr></table>\n";
        }  
    }
        
    expData += "</body></html>";
    expDok.document.write(expData);
}

/*====================================================================*/
/*========================== error handling ==========================*/
/*====================================================================*/
function errorhandling (msg, fil, lin) 
{
    Fehler = //"<font size='+3'>Fehlermeldung</font><hr>" + 
    "<p><b>Fehler:</b><br>" + msg +
    "<p><b>Datei:</b><br>" + fil +
    "<p><b>Zeile:</b><br>" + lin;
    //"<p><a href='javascript:history.back()'>Zur&uuml;ck</a>";
    //document.write(Fehler);
    setMsg(Fehler,"","Fehlermeldung");
    return true;
}
