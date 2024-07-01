CREATE TABLE Employe (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT,
    POSTE INTEGER,
    runtime REAL,
    code_tidiness REAL,
    total_tache INTEGER,
    total_warnings INTEGER,
    test_coverage REAL
);

CREATE TABLE File (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT,
    code_tidiness REAL,
    runtime REAL,
    warnings INTEGER,
    coverage REAL
);

