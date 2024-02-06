<?php
// session_id("asd");
// ini_set('session.use_cookies', 1);
// ini_set('session.cookie_lifetime', 3600);

header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");



if(!isset($_SESSION["var"])){
    $miObjeto = new stdClass();
    $miObjeto->nombre = "Danielcasaphp";
    $miObjeto->apellidos = "Rosales Martin";
    $miObjeto->dni = "78588395V";
    $miObjeto->nacimiento = "05/03/2001";
    $miObjeto->postal = "35509";
    $miObjeto->email = "daniel.rosles@gmail.com";
    $miObjeto->fijo = "987654321";
    $miObjeto->movil = "654321987";
    $miObjeto->iban = "ES1234567891234567891234";
    $miObjeto->credito = "123456789123";
    $miObjeto->password = "123456789321d_";
    $miObjeto->password_repeat = "123456789321d_";

    $_SESSION["var"] = $miObjeto;

}





// Verifica si el método de acceso es GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(isset($_GET["sesion"])){
        session_id($_GET["sesion"]);
        session_Start();
        // echo $_GET["sesion"];
    }
    echo json_encode($_SESSION["var"]);
}

// Verifica si el método de acceso es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();

    $miObjeto = new stdClass();
    $miObjeto->nombre =  $_POST['nombre'];
    $miObjeto->apellidos = $_POST["apellidos"] ;
    $miObjeto->dni = $_POST["dni"] ;
    $miObjeto->nacimiento = $_POST["nacimiento"] ;
    $miObjeto->postal = $_POST["postal"] ;
    $miObjeto->email = $_POST["email"] ;
    $miObjeto->fijo = $_POST["fijo"] ;
    $miObjeto->movil = $_POST["movil"] ;
    $miObjeto->iban = $_POST["iban"] ;
    $miObjeto->credito = $_POST["credito"] ;
    $miObjeto->password = $_POST["password"] ;
    $miObjeto->password_repeat = $_POST["password_repeat"] ;

    $_SESSION["var"] = $miObjeto;
    echo json_encode( session_id());
}



?>