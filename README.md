# APP 2020

## End of term course project assignment - Programming Web Applications
Initial state author and course instructor: Mariusz Jarocki (https://gitlab.com/mariusz.jarocki)
Initial state taken from https://gitlab.com/mariusz.jarocki/pai2020/-/commit/2a061c1127b2391465d808cfcd5e8ca982d88db5

Things done for assignment:
* "Grupy" controller and page, requests to mongodb to groups collection
* working CRUD from http for groups collection
* groups collection has many to many relationship with persons collection (non normalized; for every update both collections are updated accordingly)
* editing group displays list of all persons with its current members selected
* optimized aggregations to minimize data sent between server and client