var lFSO=0, lTxtPath="", lFilName="";

function initFSO(path, name)
{
    lTxtPath=path;
    lFilName=name;
    if(!lFSO) lFSO = new ActiveXObject("Scripting.FileSystemObject");
}

function getFileData(name) 
{
    var file=0;
    var data=new Object();
    var curId=0, curVal=0;

    // Überprüfe ob Datei existiert
    if(!lFSO || !lFSO.FileExists(lTxtPath + lFilName))
    {
        alert("Datei nicht gefunden!");
        return 0;
    }
    
    file=lFSO.GetFile(lTxtPath + lFilName);
    // Überprüfe, ob Datei Inhalt hat
    if(!file.Size) 
    {
        alert("Daten nicht gefunden!");
        return 0;
    }
    
    // Open File as TextStream forReading(1)
    file=file.OpenAsTextStream(1,0);
    
    while(!file.AtEndOfStream)
    {
        curVal=file.ReadLine();
        curId=curVal.slice(0,curVal.indexOf('='));
        data[curId]=unescape(curVal.slice(curVal.indexOf('=')+1,curVal.length));
    }
    file.Close();
    
    if(data[name])
    {
        return data[name];
    }
    else 
    {
        return data;
    }
}

function setFileData(data) 
{
    var file=0;
    var name=0;
    var status=1;
    
    // Überprüfe ob Verzeichnis existiert
    if(!lFSO.FolderExists(lTxtPath)) 
    {
        alert("Pfad nicht gefunden.");
        return 0;
    }

    // Überprüfe ob Datei schon existiert
    if(!lFSO.FileExists(lTxtPath + lFilName))
    {
        // Erzeuge Textdatei
        lFSO.CreateTextFile(lTxtPath + lFilName,true ,true);
        status="Datei wurde neu erstellt.";
    }
    // Open File as TextStream forWriting(2)
    file=lFSO.GetFile(lTxtPath + lFilName).OpenAsTextStream(2,0);

    // Jeden Inhalt vom Hash in Datei schreiben
    for(name in data)
    {
        // Schreibe Zeile
        file.WriteLine(name + "=" + escape(data[name]));
    }

    file.Close();
    return status;
}

// ungebraucht
function getFolder()
{
    var folder=0;
    for(var i=0;i<3;i++) 
    { 
        folder=lFSO.GetSpecialFolder(i);
    }
}
