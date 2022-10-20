CNote = function (id,zIndL) 
{
    var now = new Date(), cltLeft=0, cltTop=0;

    // Mausposition ermitteln
    if(event)
    {
        if(event.clientX > document.body.clientWidth-128)
            cltLeft = event.clientX-128; 
        else
            cltLeft = event.clientX-1; 
        if(event.clientY > document.body.clientHeight-128)
            cltTop = event.clientY-128; 
        else
            cltTop = event.clientY-1;
    }

    // temporär
    this.div = 0;
    this.made=parseInt(now.getTime()/1000); // auf sek genau
    this.ttwID = 0; // ID für Interval
    
    // wird gespeichert
    this.id = id;
    this.left = cltLeft;
    this.top = cltTop;
    this.width = 128;
    this.height = 128;
    if(!zIndL) zIndL = 1;
    this.zInd = zIndL;
    this.bgCol = "#ffa";
    this.opac = 90;
    this.ttl = 30*86400+this.made; // Tage*Faktor+Erstellungszeitpunkt
    this.ttw = 27*86400+this.made; // 3 Tage Warnzeit
    this.txt = "";

}

CNote.prototype.getDataString = function () //für Save Cookie relevant
{

    var data= this.left + 
    "|" + this.top +
    "|" + this.width +
    "|" + this.height +
    "|" + this.zInd +
    "|" + this.bgCol +
    "|" + this.opac +
    "|" + this.ttl + 
    "|" + this.ttw + 
    "&" + this.txt;
    return data;

}

CNote.prototype.savNote = function () 
{

    var savState=0, string2Sav=this.getDataString();

    savState=setCookie(this.id,string2Sav,this.ttl); 

    if(isNaN(savState)) { // Wenn nicht vollständig gespeichert
        setMsg("<p>"+savState+"</p>(Nur noch <b>"+(4096-document.cookie.length)+
        "</b> Bytes von <b>4096</b> Bytes frei)","color:#C00000","Speichervorgang");
    }
}

CNote.prototype.lodNote = function (data) 
{
    var pos, datProp, datCol, datTxt;
    var propArray=new Array();

    if(!data) return 0; // Argument leer

    // Daten aus String holen
    pos = data.indexOf('&');
    datProp = data.slice(0,pos);
    datTxt = data.slice(pos+1);
    propArray = datProp.split('|');

    // Daten zuordnen
    if(datTxt) this.txt = datTxt;
    if(propArray[0]) this.left = propArray[0];
    if(propArray[1]) this.top = propArray[1];
    if(propArray[2]) this.width = propArray[2]; 
    if(propArray[3]) this.height = propArray[3];
    if(propArray[4]) this.zInd = parseInt(propArray[4]);
    if(propArray[5]) this.bgCol = propArray[5];
    if(propArray[6]) this.opac = propArray[6];
    if(propArray[7]) this.ttl = propArray[7]; // Zeitpunkt 
    if(propArray[8]) this.ttw = propArray[8]; // Zeitpunkt 
    
    return 1; // gespeichertes Div erfolgreich gesetzt
}

CNote.prototype.delNote = function () 
{
    var chk;

    this.div.style.borderStyle="dashed";

    chk = confirm("Element wirklich entfernen?"); // Abfragebestätigung
    if(chk) {
        this.div.style.visibility="hidden"; // Div verstecken
        setCookie(this.id,""); // Cookie verfallen lassen
        return 1;
    }
    else {
        this.div.style.borderStyle="solid";
    }

    return 0;
}

CNote.prototype.drwDiv = function () 
{
    var newDiv = 0;

    if(!this.div) { // Div darf nicht existieren, was nicht möglich ist
        newDiv = document.createElement("div");
        newDiv.id = this.id;
        newDiv.className = "note";
        newDiv.attachEvent('onmousedown',drgstr);
        newDiv.attachEvent('onmouseup',drpstp);
        newDiv.attachEvent('onscroll',drpstp);
        newDiv.attachEvent('onkeyup',txtParse);
        document.body.appendChild(newDiv);
        this.div = document.getElementById(this.id);
    }
    this.div.innerHTML =        this.txt;
    this.div.style.left =       this.left + "px";
    this.div.style.top =        this.top + "px";
    this.div.style.width =      this.width + "px";
    this.div.style.height =     this.height + "px";
    this.div.style.zIndex =     this.zInd;
    this.div.style.background=  this.bgCol;
    this.div.style.filter =     "alpha(opacity="+this.opac+")"+gShadow;
    
    // Overflowverhalten
    this.div.style.overflow =   gOverflow;

    return 1;
}

CNote.prototype.setPos = function (x,y) 
{
    this.left = x;
    this.top = y;
}

CNote.prototype.setSize = function (w,h) 
{
    if(w>15) this.width = this.div.style.pixelWidth = w;
    if(h>15) this.height = this.div.style.pixelHeight = h;
}

CNote.prototype.setWarning = function ()
{
    if(this.ttw-this.made <= 0 && !this.ttwID) // Wenn Warnzeit erreicht
    {   
        this.div.style.borderColor="red";
        this.ttwID = window.setInterval("chgBorder('"+this.id+"')", 400);
    }
    else if(this.ttw-this.made > 0 && this.ttwID) 
    {
            window.clearInterval(this.ttwID);
            this.div.style.borderStyle="solid";
            this.ttwID = 0;
    }
}

function chgBorder(objID) // geht so nicht: CNote.chgBorder = function(objID)
{
    var obj = document.getElementById(objID);

    if(obj.style.borderStyle=="solid") 
    {
        obj.style.borderStyle="dashed";
    }
    else
    {
        obj.style.borderStyle="solid";
    }
}

CNote.prototype.cfgDiv = function (disTime) 
{
    var dlgSets=new Array();
    var backVal=new Array();

    var now = new Date();
    now = parseInt(now.getTime()/1000); // auf sek genau

    //Übergabe Farbwert
    dlgSets[0]=this.bgCol; 
    //Übergabe Transparentwert
    dlgSets[1]=this.opac; 
    dlgSets[2]=this.width;
    dlgSets[3]=this.height;
    dlgSets[4]=this.ttl-now;
    dlgSets[5]=this.ttl-this.ttw;
    dlgSets[6]=disTime;

    backVal=window.showModalDialog("data/cfgDiv.htm",dlgSets,"center:1;help:0;scroll:0;status:0;unadorned:1");

    if(backVal) {
        //Rückgabe Farbwert
        this.bgCol=backVal[0]; 
        //Rückgabe Transparentwert
        this.opac=backVal[1]; 
        //Breite wenn gültiger Wert
        if(!isNaN(backVal[2])) this.width=parseInt(backVal[2]); 
        //Höhe wenn gültiger Wert
        if(!isNaN(backVal[3])) this.height=parseInt(backVal[3]); 
        //Tage wenn gültiger Wert
        if(!isNaN(backVal[4])) this.ttl=parseInt(backVal[4])+this.made; 
        //Tage wenn gültiger Wert
        if(!isNaN(backVal[5])) this.ttw=this.ttl-parseInt(backVal[5]); 
        
        this.drwDiv(); // Div aktualisieren
    }
}
