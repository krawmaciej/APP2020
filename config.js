// default data and config

var config = module.exports = {

    frontendDir: './public',
    port: 8888,
    dbUrl: "mongodb://localhost:27017",
    database: "app2020",

    exampleUsers: [
        {"login":"admin","password":"admin1","role":1},
        {"login":"test","password":"test1","role":2}
    ],

    examplePersons: [
        {"firstName":"Jan","lastName":"Jurkiewicz","email":"jan.jurkiewicz@zarzad.firma.com","yearofbirth":1982},
        {"firstName":"Andrzej","lastName":"Czapliński","email":"andrzej.czaplinski@zarzad.firma.com","yearofbirth":1978},
        {"firstName":"Piotr","lastName":"Makieła","email":"piotr.makiela@zarzad.firma.com","yearofbirth":1978},
        {"firstName":"Krzysztof","lastName":"Będkowski","email":"krzysztof.bedkowski@administracja.firma.com","yearofbirth":1997},
        {"firstName":"Stanisław","lastName":"Gunia","email":"stanislaw.gunia@administracja.firma.com","yearofbirth":2001},
        {"firstName":"Tomasz","lastName":"Strzelecki","email":"tomasz.strzelecki@administracja.firma.com","yearofbirth":1971},
        {"firstName":"Paweł","lastName":"Wiecheć","email":"pawel.wiechec@administracja.firma.com","yearofbirth":1977},
        {"firstName":"Józef","lastName":"Lebioda","email":"jozef.lebioda@administracja.firma.com","yearofbirth":1994},
        {"firstName":"Marcin","lastName":"Urbaniak","email":"marcin.urbaniak@administracja.firma.com","yearofbirth":1968},
        {"firstName":"Marek","lastName":"Pasikowski","email":"marek.pasikowski@produkcja.firma.com","yearofbirth":1976},
        {"firstName":"Michał","lastName":"Pyra","email":"michal.pyra@produkcja.firma.com","yearofbirth":1976},
        {"firstName":"Grzegorz","lastName":"Chyła","email":"grzegorz.chyla@produkcja.firma.com","yearofbirth":1964},
        {"firstName":"Jerzy","lastName":"Ceglarz","email":"jerzy.ceglarz@produkcja.firma.com","yearofbirth":1964},
        {"firstName":"Tadeusz","lastName":"Zduniak","email":"tadeusz.zduniak@produkcja.firma.com","yearofbirth":1987},
        {"firstName":"Adam","lastName":"Franke","email":"adam.franke@produkcja.firma.com","yearofbirth":1969},
        {"firstName":"Łukasz","lastName":"Grochocki","email":"lukasz.grochocki@produkcja.firma.com","yearofbirth":1984},
        {"firstName":"Zbigniew","lastName":"Legierski","email":"zbigniew.legierski@produkcja.firma.com","yearofbirth":1999},
        {"firstName":"Ryszard","lastName":"Pielak","email":"ryszard.pielak@produkcja.firma.com","yearofbirth":1986},
        {"firstName":"Dariusz","lastName":"Iwan","email":"dariusz.iwan@produkcja.firma.com","yearofbirth":1983},
        {"firstName":"Henryk","lastName":"Jastrząb","email":"henryk.jastrzab@produkcja.firma.com","yearofbirth":1997},
        {"firstName":"Mariusz","lastName":"Borowik","email":"mariusz.borowik@produkcja.firma.com","yearofbirth":1965},
        {"firstName":"Kazimierz","lastName":"Jędrysiak","email":"kazimierz.jedrysiak@produkcja.firma.com","yearofbirth":1968},
        {"firstName":"Wojciech","lastName":"Orlikowski","email":"wojciech.orlikowski@produkcja.firma.com","yearofbirth":1971},
        {"firstName":"Robert","lastName":"Richter","email":"robert.richter@produkcja.firma.com","yearofbirth":2002},
        {"firstName":"Mateusz","lastName":"Ignasiak","email":"mateusz.ignasiak@produkcja.firma.com","yearofbirth":1966},
        {"firstName":"Marian","lastName":"Michalczyk","email":"marian.michalczyk@produkcja.firma.com","yearofbirth":1967},
        {"firstName":"Rafał","lastName":"Markiewicz","email":"rafal.markiewicz@produkcja.firma.com","yearofbirth":1990},
        {"firstName":"Jacek","lastName":"Karasiński","email":"jacek.karasinski@kontrola.jakosci.firma.com","yearofbirth":1986},
        {"firstName":"Janusz","lastName":"Żaba","email":"janusz.zaba@kontrola.jakosci.firma.com","yearofbirth":1971},
        {"firstName":"Mirosław","lastName":"Kubera","email":"miroslaw.kubera@kontrola.jakosci.firma.com","yearofbirth":1990},
        {"firstName":"Maciej","lastName":"Bednarski","email":"maciej.bednarski@kontrola.jakosci.firma.com","yearofbirth":1994},
        {"firstName":"Sławomir","lastName":"Tomasiak","email":"slawomir.tomasiak@kontrola.jakosci.firma.com","yearofbirth":2001},
        {"firstName":"Jarosław","lastName":"Kostka","email":"jaroslaw.kostka@kontrola.jakosci.firma.com","yearofbirth":1988},
        {"firstName":"Kamil","lastName":"Sułkowski","email":"kamil.sulkowski@kontrola.jakosci.firma.com","yearofbirth":1998},
        {"firstName":"Wiesław","lastName":"Bajorek","email":"wieslaw.bajorek@kontrola.jakosci.firma.com","yearofbirth":2002},
        {"firstName":"Roman","lastName":"Prorok","email":"roman.prorok@kontrola.jakosci.firma.com","yearofbirth":1981},
        {"firstName":"Władysław","lastName":"Papaj","email":"wladyslaw.papaj@kontrola.jakosci.firma.com","yearofbirth":1997},
        {"firstName":"Jakub","lastName":"Kalemba","email":"jakub.kalemba@kontrola.jakosci.firma.com","yearofbirth":1991},
        {"firstName":"Artur","lastName":"Jokiel","email":"artur.jokiel@kontrola.jakosci.firma.com","yearofbirth":2001},
        {"firstName":"Zdzisław","lastName":"Rybak","email":"zdzislaw.rybak@kontrola.jakosci.firma.com","yearofbirth":1984},
        {"firstName":"Edward","lastName":"Wołowiec","email":"edward.wolowiec@kontrola.jakosci.firma.com","yearofbirth":1988},
        {"firstName":"Mieczysław","lastName":"Stefańczyk","email":"mieczyslaw.stefanczyk@kontrola.jakosci.firma.com","yearofbirth":1966},
        {"firstName":"Damian","lastName":"Nakielski","email":"damian.nakielski@transport.firma.com","yearofbirth":1971},
        {"firstName":"Dawid","lastName":"Zębala","email":"dawid.zebala@transport.firma.com","yearofbirth":1988},
        {"firstName":"Przemysław","lastName":"Mitka","email":"przemyslaw.mitka@transport.firma.com","yearofbirth":1981},
        {"firstName":"Sebastian","lastName":"Sieczka","email":"sebastian.sieczka@transport.firma.com","yearofbirth":1999},
        {"firstName":"Czesław","lastName":"Gontarek","email":"czeslaw.gontarek@transport.firma.com","yearofbirth":1995},
        {"firstName":"Leszek","lastName":"Kaszubowski","email":"leszek.kaszubowski@transport.firma.com","yearofbirth":1983},
        {"firstName":"Daniel","lastName":"Jachym","email":"daniel.jachym@transport.firma.com","yearofbirth":1974},
        {"firstName":"Waldemar","lastName":"Sośnicki","email":"waldemar.sosnicki@transport.firma.com","yearofbirth":1980},
        {"firstName":"Jan","lastName":"Prałat","email":"jan.pralat@kadry.firma.com","yearofbirth":1973},
        {"firstName":"Andrzej","lastName":"Sobolewski","email":"andrzej.sobolewski@kadry.firma.com","yearofbirth":1998},
        {"firstName":"Piotr","lastName":"Malarz","email":"piotr.malarz@kadry.firma.com","yearofbirth":1980},
        {"firstName":"Krzysztof","lastName":"Przygodzki","email":"krzysztof.przygodzki@ksiegowosc.firma.com","yearofbirth":1992},
        {"firstName":"Stanisław","lastName":"Dobrzycki","email":"stanislaw.dobrzycki@ksiegowosc.firma.com","yearofbirth":1999},
        {"firstName":"Tomasz","lastName":"Demski","email":"tomasz.demski@ksiegowosc.firma.com","yearofbirth":1991},
        {"firstName":"Paweł","lastName":"Kluski","email":"pawel.kluski@ksiegowosc.firma.com","yearofbirth":1985},
        {"firstName":"Józef","lastName":"Koziara","email":"jozef.koziara@ksiegowosc.firma.com","yearofbirth":1974},
        {"firstName":"Marcin","lastName":"Gładysz","email":"marcin.gladysz@ksiegowosc.firma.com","yearofbirth":1971},
        {"firstName":"Marek","lastName":"Bugała","email":"marek.bugala@marketing.firma.com","yearofbirth":1987},
        {"firstName":"Michał","lastName":"Gorzkowski","email":"michal.gorzkowski@marketing.firma.com","yearofbirth":1963},
        {"firstName":"Grzegorz","lastName":"Fiedor","email":"grzegorz.fiedor@marketing.firma.com","yearofbirth":1983},
        {"firstName":"Jerzy","lastName":"Pierzchała","email":"jerzy.pierzchala@marketing.firma.com","yearofbirth":1987},
        {"firstName":"Tadeusz","lastName":"Jarzębski","email":"tadeusz.jarzebski@marketing.firma.com","yearofbirth":1965},
        {"firstName":"Adam","lastName":"Stawiarski","email":"adam.stawiarski@marketing.firma.com","yearofbirth":1982},
        {"firstName":"Łukasz","lastName":"Trojan","email":"lukasz.trojan@marketing.firma.com","yearofbirth":2001},
        {"firstName":"Zbigniew","lastName":"Głażewski","email":"zbigniew.glazewski@it.firma.com","yearofbirth":1966},
        {"firstName":"Ryszard","lastName":"Kozik","email":"ryszard.kozik@it.firma.com","yearofbirth":1973},
        {"firstName":"Dariusz","lastName":"Sakowicz","email":"dariusz.sakowicz@it.firma.com","yearofbirth":1982},
        {"firstName":"Henryk","lastName":"Pieczka","email":"henryk.pieczka@it.firma.com","yearofbirth":1996},
        {"firstName":"Mariusz","lastName":"Kryczka","email":"mariusz.kryczka@it.firma.com","yearofbirth":1983},
        {"firstName":"Kazimierz","lastName":"Pytlik","email":"kazimierz.pytlik@programisci.firma.com","yearofbirth":1982},
        {"firstName":"Wojciech","lastName":"Sałata","email":"wojciech.salata@programisci.firma.com","yearofbirth":2002},
        {"firstName":"Robert","lastName":"Pohl","email":"robert.pohl@programisci.firma.com","yearofbirth":1985},
        {"firstName":"Mateusz","lastName":"Żurawski","email":"mateusz.zurawski@programisci.firma.com","yearofbirth":1987},
        {"firstName":"Marian","lastName":"Wiktorski","email":"marian.wiktorski@wdrozeniowcy.firma.com","yearofbirth":1993},
        {"firstName":"Rafał","lastName":"Nowaczyk","email":"rafal.nowaczyk@wdrozeniowcy.firma.com","yearofbirth":1979},
        {"firstName":"Jacek","lastName":"Michniewicz","email":"jacek.michniewicz@wdrozeniowcy.firma.com","yearofbirth":1968},
        {"firstName":"Janusz","lastName":"Nalepka","email":"janusz.nalepka@wdrozeniowcy.firma.com","yearofbirth":1965},
        {"firstName":"Mirosław","lastName":"Zamorski","email":"miroslaw.zamorski@wdrozeniowcy.firma.com","yearofbirth":1983},
        {"firstName":"Maciej","lastName":"Stepnowski","email":"maciej.stepnowski@handel.firma.com","yearofbirth":1981},
        {"firstName":"Sławomir","lastName":"Kurowski","email":"slawomir.kurowski@handel.firma.com","yearofbirth":1973},
        {"firstName":"Jarosław","lastName":"Wolszczak","email":"jaroslaw.wolszczak@handel.firma.com","yearofbirth":1982},
        {"firstName":"Kamil","lastName":"Malek","email":"kamil.malek@handel.firma.com","yearofbirth":1972},
        {"firstName":"Wiesław","lastName":"Łopata","email":"wieslaw.lopata@handel.firma.com","yearofbirth":1977},
        {"firstName":"Roman","lastName":"Talaśka","email":"roman.talaska@handel.firma.com","yearofbirth":1995},
        {"firstName":"Władysław","lastName":"Siemianowski","email":"wladyslaw.siemianowski@handel.firma.com","yearofbirth":1975},
        {"firstName":"Jakub","lastName":"Polaczek","email":"jakub.polaczek@handel.firma.com","yearofbirth":1998},
        {"firstName":"Artur","lastName":"Antczak","email":"artur.antczak@handel.firma.com","yearofbirth":1981},
        {"firstName":"Zdzisław","lastName":"Zadrożna","email":"zdzislaw.zadrozna@handel.firma.com","yearofbirth":1969},
        {"firstName":"Edward","lastName":"Miksa","email":"edward.miksa@handel.firma.com","yearofbirth":1981},
        {"firstName":"Mieczysław","lastName":"Łysik","email":"mieczyslaw.lysik@handel.firma.com","yearofbirth":1998},
        {"firstName":"Damian","lastName":"Purzycki","email":"damian.purzycki@handel.firma.com","yearofbirth":1979},
        {"firstName":"Dawid","lastName":"Matecki","email":"dawid.matecki@staz.firma.com","yearofbirth":1982},
        {"firstName":"Przemysław","lastName":"Dziadosz","email":"przemyslaw.dziadosz@staz.firma.com","yearofbirth":1996},
        {"firstName":"Sebastian","lastName":"Żydek","email":"sebastian.zydek@staz.firma.com","yearofbirth":1994},
        {"firstName":"Czesław","lastName":"Kłosowski","email":"czeslaw.klosowski@staz.firma.com","yearofbirth":1997},
        {"firstName":"Leszek","lastName":"Wojtyczka","email":"leszek.wojtyczka@staz.firma.com","yearofbirth":1993},
        {"firstName":"Daniel","lastName":"Adamczyk","email":"daniel.adamczyk@staz.firma.com","yearofbirth":1994},
        {"firstName":"Waldemar","lastName":"Ciura","email":"waldemar.ciura@staz.firma.com","yearofbirth":1994}
    ],

    exampleGroups: [
        {"name":"Zarząd", "description":"Zarządza firmą"},
        {"name":"Kadry", "description":"Grupa kadr"},
        {"name":"IT", "description":"Odpowiedzialna za działanie systemu"}
    ]

};