T120B165 Saityno taikomųjų programų projektavimas 

1. Sprendžiamo uždavinio aprašymas  
1.1. Sistemos paskirtis  
Projekto tikslas – suteikti galimybę vartotojams tvarkyti muzikos duomenis (atlikėjus, albumus ir dainas), dalintis savo kolekcijomis bei lengvai atrasti naują muziką.  

Veikimo principas – pačią kuriamą platformą sudaro dvi dalys: internetinė aplikacija, kuria naudosis vartotojai, „Publisher“ rolę turintys vartotojai bei administratorius ir aplikacijų programavimo sąsaja (API).  
Registruotas naudotojas galės naršyti muzikos įrašus, o tie, kuriems administratorius suteiks **Publisher** rolę, galės kurti atlikėjus, albumus bei įkelti dainas.  

---

1.2. Funkciniai reikalavimai  
Neregistruotas sistemos naudotojas galės:  
1. Peržiūrėti platformos pradinį puslapį;  
3. Prisiregistruoti prie internetinės aplikacijos.  

Registruotas sistemos naudotojas galės:  
1. Atsijungti nuo internetinės aplikacijos;  
2. Prisijungti prie platformos;  
3. Peržiūrėti kitų naudotojų paskelbtus atlikėjus, albumus ir dainas;  

Naudotojas, turintis **Publisher** rolę, galės:  
1. Kurti / tvarkyti savo muzikos kolekciją:  
   1.1. Pridėti atlikėją (**Artist**);  
   1.2. Pridėti albumą (**Album**) ir susieti su atlikėju;  
   1.3. Pridėti dainą (**Song**) ir susieti su albumu;  
2. Redaguoti ir šalinti savo pridėtus atlikėjus, albumus ir dainas;  

Administratorius galės:  
1. Suteikti ar atimti **Publisher** rolę;  
2. Šalinti naudotojus;  
3. Šalinti netinkamus įrašus (atlikėjus, albumus, dainas).  

---

2. Sistemos architektūra  
Sistemos sudedamosios dalys:  
- **Kliento pusė (angl. Front-end)** – naudojant React bei typescript technologijas
- **Serverio pusė (angl. Back-End)** – naudojant Python django technologiją
- **Duomenų bazė (angl. Database)** – naudojant MySQL technologiją 

![Architektura.png](https://github.com/Pamakstys/T120B165-Saityno-taikomuju-programu-projektavimas/blob/main/architektura.png)
