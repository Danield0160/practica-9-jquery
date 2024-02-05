show DATABASES;

drop DATABASE if exists practica8bd;

create DATABASE practica8bd;

CREATE USER 'practica8user' @'localhost' IDENTIFIED BY 'Csas1234';

GRANT
    ALL PRIVILEGES ON practica8bd.* TO 'practica8user' @'localhost'
WITH
GRANT OPTION;

FLUSH PRIVILEGES;

use practica8bd;

create table
    usuarios(
        nombre VARCHAR(30),
        apellidos VARCHAR(30),
        dni VARCHAR(30) PRIMARY KEY,
        nacimiento VARCHAR(30),
        postal VARCHAR(30),
        email VARCHAR(30),
        fijo VARCHAR(30),
        movil VARCHAR(30),
        iban VARCHAR(30),
        credito VARCHAR(30),
        password VARCHAR(30),
        password_repeat VARCHAR(30)
    )

TRUNCATE usuarios;

INSERT into usuarios
values (
        "Danielbdcasa",
        "Rosales Martin",
        "78588395V",
        "05/03/2001",
        "35509",
        "daniel.rosles@gmail.com",
        "987654321",
        "654321987",
        "ES1234567891234567891234",
        "123456789123",
        "123456789123a_",
        "123456789123a_"
    );