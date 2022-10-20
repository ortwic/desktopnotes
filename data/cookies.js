// getCkiNbr wird zur Zeit nicht gebraucht
function getCkiNbr()
{
	if(!document.cookie) return 0;
	var extract=document.cookie.split(";");
	if(extract) return extract.length; // Anzahl der Cookieeinträge zurückgeben
}

function getCookie(name)
{
    var data = new Object();
    var strNum, valAll, keyName, subVal;
    var i = 0;
    var clen = document.cookie.length;

    while (i < clen) // Alle Cookies durchlaufen
    {
        strNum = document.cookie.indexOf (";", i); // "Nummer" des Cookies
        if (strNum == -1) strNum = document.cookie.length; // Es gibt nur ein Cookie
        valAll = unescape(document.cookie.substring(i, strNum)); // name=values auslesen
        keyName = valAll.substring(0, valAll.indexOf("=", 0)); // Name des Cookie zurück
        subVal = valAll.substring(valAll.indexOf("=") + 1); // ab '=' Werte zurück
        data[keyName] = (data[keyName]) ? data[keyName] + subVal : subVal;
        i = strNum + 2; // Leerzeichen nach ; überspringen
    }
    
    if(name)
    {
        if(typeof(data[name])!="undefined")
        {
            return data[name]; // gefundenes Cookie zurück
        }
        else return 0; // Gesuchtes Cookie nicht gefunden
    }
    else 
    {
        return data; // Alle Cookies zurück
    }
}

function setCookie(name, value, ttl, path)
{
    var expire = new Date();
    var string2Sav,diff;
    
    if(!path) path = '/';
    
    if(ttl>0) { // Speichere Cookie
        value = escape(value);
        expire.setTime(ttl*1000);
        string2Sav=name + "=" + value + "; expires=" + expire.toGMTString() + ";path=" + path;
        oldCki=getCookie(name);

        if(oldCki!=0) { // Wenn Cookie schon existiert
            diff=value.length-escape(oldCki).length; // Differenz zwischen Neuem und Alten Inhalt
            if(document.cookie.length+diff > 4096) { // Gesamtgröße darf nicht größer 4kB sein!
                return "Zu wenig Speicher frei um &Auml;nderungen zu speichern!";
            }
        } else if(document.cookie.length+string2Sav.length > 4096) { // Zu wenig Speicher für neues Cookie
            return "Zu wenig Speicher frei um neues Element zu speichern!";
        }
        document.cookie = name + "=" + value + "; expires=" + expire.toGMTString() + ";path=" + path;
        if(document.cookie.length<1) { // Nachträgliche Kontrolle, ob Cookie wirklich gespeichert
            alert("Fehler beim Speichern des Cookies.\nZu viele Daten zum Speichern!");
            return 0;
        }
        return 1;              
    } else { // Lösche Cookie
        expire.setTime(0);
        document.cookie = name + "=''; expires=" + expire.toGMTString() + ";path=" + path;
        return 1;
    }
} 
