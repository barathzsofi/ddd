# bookStore
##1. Követelményanalízis

- Követelmények összegyűjtése

  - Funkcionális elvárások:
  
    + Vendégként szeretnék tudni regisztrálni.
    + Vendégként szeretnék az elérhető könyvek között böngészni.
    + Vendégként szeretném az elérhető könyvek adatait megnézni.
    + Vendégként szeretném a legjobban keresett könyvek listáját megtekinteni a főoldalon.
    + Felhasználóként szeretnék tudni bejelentkezni.
    + Felhasználóként szeretnék tudni kijelentkezni.
    + Felhasználóként szeretném tudni szerkeszteni a saját profilomat.
    + Felhasználóként szeretnék tudni könyvet a kosárba tenni, kosárból kivenni.
    + Felhasználóként szeretnék tudni könyvre kérést leadni (raktárról el nem érhető, idegen nyelvű, meghatározott kiadású stb)
    + Felhasználóként szeretném a megrendeléseim, kéréseim listáját megtekinteni, 
    + Felhasználóként szeretnék tudni az aktív megrendelésekhez, kérésekhez kommentet fűzni
    + Adminként szeretném a felhasználók listáját megtekinteni
    + Adminként szeretném az aktuális megrendelések, kérések listáját megtekinteni, azokat szerkeszteni, törölni
    + Adminként szeretnék tudni új könyvet felvenni, meglévő könyvek adatait módosítani, könyvet törölni
    + Adminként szeretnék tudni új műfajt felvenni, meglévőket szerkeszteni, törölni
    
  - Nem funkcionális követelmények
  
    + Felhasználóbarát, ergonomikus elrendezés és kinézet
    + Gyors működés
    + Biztonságos működés: jelszavak tárolása, funkciókhoz való hozzáférés
    
- Szakterületi fogalomjegyzék

  - Könyv: Olyan, szövegből és ábrából álló, fizikai (papír) információhordozójú, nem periodikus (irodalmi vagy szakmai célú) publikáció, amely 49 vagy több oldalból áll, terjedelmi szempontból a borítót nem számítva. 
  A könyv nyomdaipari sokszorosítással előállított tömegtermék.
  
  - Műfajok
    + Disztópia: A disztópia egy társadalom víziója, mely ellentétes az utópiával. Gyakran negatív jövőképet mutat. A disztopikus társadalmakban gyakran az életkörülmények nyomorúságosak, a szenvedés, a szegénység, az elnyomás, az erőszak, járványok és szennyeződések jellemzik.
    + Fantasy: A Fantasy fő jellemzője, hogy a tartalma többnyire olyan elképzelt, mitikus jellegű, valamilyen tekintetben mindig irreális, az író által teremtett, csak annak fantáziájában létező alternatív világokba, mint keretbe van ágyazva, mely felépítésében, fizikai és etikai törvényeiben, értékeiben, élőlényeiben, rokonságot mutat a vallások és mítoszok által megteremtett képzeletbeli világokkal.
    + Horror: A horror olyan irodalmi műfaj, amelynek középpontjában a félelem áll. Habár alapvetően irodalmi művekről van szó, megjelenhet más ágazatokban is, melyek közül a legtipikusabb a film.
    + Krimi: A krimi vagy bűnügyi regény az epika (elbeszélő irodalom) egy népszerű tematikus műfaja, amely a bűntények felderítésével, elkövetésük bemutatásával, illetve lélektani indítóokaik vizsgálatával, valamint a bűnözők, nyomozók („detektívek”) és bűnügyi rendőrök világával foglalkozik.
    + Posztapokaliptikus: Egy látomásszerű világkép, melyben egy világméretű katasztrófa zajlott le és emiatt a világ megváltozott. Ez a katasztrófa utáni állapot legtöbbször negatív, baljós és sivár.
    + Romantikus: Olyan alkotások, amelyekben a felfokozott életérzés kifejezése, a reményvesztettség, a csalódás, a világfájdalom vagy éppen az ezzel ellentétes forradalmi hevület és lángoló életöröm van jelen.
    + Sci-fi: A sci-fi az angol science fiction kifejezés. Jelentése: tudományos-fantasztikus. A tudományos-fantasztikus mű olyan irodalmi alkotás, mely legtöbbször valódi vagy képzeletbeli tudományoknak a társadalomra, vagy egyes egyénekre gyakorolt hatását mutatja be. Ezeknek a műveknek a közös jellemzői, hogy zömében egy lehetséges jövőben játszódó képzeletbeli történetek.
    + Urban Fantasy: Hasonlít a történelmi fantasyhoz, de mai korban játszódik, ahol a mágia és/vagy a mitikus lények többé-kevésbé titokban jelen vannak.
	

- Használatieset-modell

  - Szerepkörök
    + Vendég: Raktáron lévő könyvek között böngészhet, megtekintheti azok adatait.
    + Felhasználó: A vendég szerepkörön túl könyveket kosárba helyezhet, megrendelést adhat le, raktárról nem elérhető, különleges könyvek felkutatására adhat le igényt, ezzel kapcsolatban a munkatársak megjegyzéseit megtekintheti, válaszolhat rájuk, saját megrendeléseit kilistázhatja.
    + Admin: A felhasználó szerepkörén túl új raktáron lévő könyvet vehet fel, a könyvek adatait módosíthatja, törölheti a raktáron lévő könyveket. Felhasználók, megrendelések listáját megtekintheti módosíthatja azokat. Megrendelésekhez kommentet fűzhet, állapotukat átállíthatja. Új műfajt vehet fel, meglévőt törölhet.
			
  - Használati esetek
    	![Használati eset diagram](img/haszn_eset_diag.png)
  - Folyamatok
  	+ felhasználó:
		- Bejelentkezés folyamata
			![Bejelentkezési folyamat meghatározása](img/folyamat_bejelentk.png)
		- Rendelés folyamata
			![Rendelés folyamatának meghatározása](img/folyamat_rendeles.png)

##2. Tervezés

- Architektúra terv

	- Oldaltérkép
    
		- Publikus:
			- Főoldal
				+ Könyv adatainak megtekintése
			- Könyvek böngészése
				+ Könyv adatainak megtekintése
			- Belépés
			- Regisztráció
		- Felhasználó:
			- Kilépés
			- Profiladatok
				+ Profiladatok szerkesztése
				+ Kérés felvitele
			- Könyvek böngészése
				+ Könyv adatainak megtekintése
					+ Könyv kosárba tétele
			- Kosár tartalmának listája
				+ Kosár tartalmának módosítása
				+ Megrendelés feladása
			- Megrendelések/kérések listája
				+ Megrendelés részletei
				+ Kommentek megtekintése
				+ Új komment
		- Admin:
			- Felhasználók listája
			- Megrendelések/kérések listája
				+ Megrendelés/kérés adatainak megtekintése
					+ Komment fűzése
				+ Megrendelés státuszának módosítása
				+ Megrendelés törlése
			- Könyvek listája
				+ Új könyv felvétele
				+ Könyv adatainak megtekintése
					+ Könyv adatainak szerkesztése
					+ Könyv törlése
	- Végpontok
		- GET /: főoldal
		- GET /book: könyvlista
		- GET /book/:id : könyv megtekintése
		- GET /bookList: könyvek listája admin számára
		- GET /book/:id/editBook: könyv szerkesztése, űrlap megjelenítése
		- POST /book/:id/editBook: könyv szerkesztése, adatok küldése
		- GET /book/:id/deleteBook: könyv törlése
		- GET /createBook: új könyv, űrlap megjelenítése
		- POST /createBook: új könyv, adatok küldése
		- GET /login: bejelentkező oldal
		- POST /login: bejelentkezési adatok felküldése
		- GET /logout: kijelentkezés
		- GET /signup: regisztrációs oldal
		- POST /signup: regisztrációs adatok felküldése
		- GET /profile: profiladatok
		- GET /profile/edit: profiladatok szerkesztése, ürlap megjelenítése
		- POST /profile/edit: profiladatok szerkesztése, adatok küldése
		- GET /orderList: megrendelések/kérések listája
		- GET /putInBasket/:id : könyv kosárba helyezése
		- GET /basket: kosár tartalma
		- GET /order: megrendelés leadása
		- GET /orderDetails/:id : megrendelés részletei
		- POST /doComment: megrendeléshez, kéréshez komment fűzése
		- GET /emptybasket: kosár tartalmának törlése
		- GET /deleteFromBasket/:id : törlés a kosárból
		- GET /newrequest: új kérés, ürlap megjelenítése
		- POST /newrequest: új kérés, adatok küldése
		- GET /editOrder/:id : megrendelés/kérés szerkesztése, űrlap megjelenítése
		- POST /editOrder/:id : megrendelés/kérés szerkesztése, adatok küldése
		- GET /editOrder/:id/delete: megrendelés törlése
		- GET /users: felhasználók listája
		- GET /book/category/:id : könyvek kategória szerinti szűrése
		- GET /categoryList: kategóriák listája
		- GET /createCategory: új kategória, űrlap megjelenítése
		- POST /createCategory: új kategória, adatok küldése
		- GET /categoryList/delete/:id : kategória törlése
		- GET /categoryList/edit/:id : kategória szerkesztése, űrlap megjelenítése
		- POST /categoryList/edit/:id : kategória szerkesztése, adatok küldése




- Felhasználóifelület-modell

	+ Oldalvázlatok
		- Főoldal
			![Főoldal](img/index.png)
		- Regisztrációs oldal
			 ![Regisztráció](img/signUp.png)
		- Bejelentkezés
			 ![Bejelentkezés](img/signIn.png)
		- Böngészés
			 ![Böngészés](img/explorer.png)
		- Könyv adatlapja
			 ![Könyv](img/book.png)
		- Kérési igény leadása
			 ![Új kérés](img/request.png)
		- Saját megrendelések listája
			 ![Megrendelések](img/orderlist.png)
    
- Osztálymodell

	+ Adatmodell
		- ![Adatmodell](img/adatmodell.png)
	+ Adatbázisterv
		- ![Adatbázisterv](img/adatbazisterv.png)
	+ Állapotdiagram
		- Rendelés
			- ![Állapotdiagram](img/allapotd_rend.png)
		- Kérés
			- ![Állapotdiagram](img/allapotd_keres.png)

