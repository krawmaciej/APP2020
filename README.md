# APP 2020

## Struktura projektu

Począwszy od 21 marca 2020, projekt będzie rozwijany w nieco innym schemacie plikowym.

Cały frontend jest składowany w katalogu public. Wewnątrz tego katalogu mamy podkatalogi na css-y, fonty i javascript frontendowy. Pliki html gromadzimy na poziomie głównym, inne komponenty linkowane są przez odwołania względne (np. js/app.js).

Backend, jak poprzednio, zawarty jest w głównym katalogu projektu. Podzieliłem go jednak na kilka plików:
* server.js - plik startowy i scalający resztę, serwer statycznej treści udostępniający katalog public (w oparciu o node-static), parsowanie query stringa i payloadu; jeżeli dla urla /aaa/bbb istnieje w module rest funkcja aaa.bbb, url ten jest traktowany jako żądanie jej wywołania;
* config.js - konfiguracja projektu
* lib.js - funkcje wspólne, m.in. wysyłanie danych i błędów, kompletowanie payloadu
* rest.js - moduł z kodem usług restowych
* common.js - wspólne obiekty dla wielu modułów

Program domyślnie (config.js) korzysta z silnika bazy danych MongoDB, uruchomionego na lokalnym komputerze (localhost).