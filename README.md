# Finansinis neraštingumas

## Projekto aprašymas

„Finansinis neraštingumas“ – tai studentams skirta asmeninių finansų valdymo web programėlė, kurios tikslas yra padėti vartotojams geriau suprasti savo finansinius įpročius, atsakingiau planuoti biudžetą bei stebėti pajamas ir išlaidas.

Projektas orientuotas į jaunimo finansinio raštingumo didinimą, suteikiant paprastą, vizualiai aiškų ir lengvai naudojamą skaitmeninį įrankį. Programėlė leidžia vartotojui registruoti finansines operacijas, analizuoti išlaidų kategorijas, planuoti mėnesio biudžetą ir susipažinti su praktiniais finansiniais patarimais.

## Projekto tikslas

Sukurti funkcionalią web programėlę, kuri padėtų studentams:

- sekti asmenines pajamas ir išlaidas;
- planuoti mėnesio biudžetą;
- analizuoti išlaidų pasiskirstymą pagal kategorijas;
- stebėti finansinius įpročius;
- ugdyti atsakingesnį požiūrį į pinigų valdymą.

## Tikslinė auditorija

Pagrindinė programėlės tikslinė auditorija – studentai ir jauni žmonės, kurie nori paprastai ir aiškiai valdyti savo asmeninius finansus. Šiai vartotojų grupei aktualu turėti nesudėtingą įrankį, kuris nereikalautų specialių finansinių žinių, bet padėtų priimti atsakingesnius kasdienius finansinius sprendimus.

## Pagrindinės funkcijos

Programėlėje įgyvendintos šios funkcijos:

- pajamų įvedimas;
- išlaidų įvedimas;
- išlaidų priskyrimas kategorijoms;
- mėnesio biudžeto planavimas;
- taupymo tikslo nustatymas;
- pajamų, išlaidų ir likučio apžvalga;
- išlaidų analizė grafikuose;
- finansinių patarimų pateikimas;
- vartotojo duomenų išsaugojimas naršyklėje;
- galimybė ištrinti savo duomenis ir pradėti iš naujo.

## Technologijos

Projektui įgyvendinti naudotos šios technologijos:

- **React** – vartotojo sąsajos kūrimui;
- **Vite** – projekto paleidimui ir build procesui;
- **JavaScript** – programėlės logikai;
- **CSS** – vartotojo sąsajos stiliams;
- **Recharts** – duomenų vizualizacijai grafikuose;
- **Lucide React** – ikonoms;
- **localStorage** – vartotojo duomenų saugojimui naršyklėje.

## Duomenų saugojimas

Šioje projekto versijoje vartotojo duomenys saugomi naršyklėje naudojant `localStorage`. Tai reiškia, kad kiekvienas vartotojas turi atskirus duomenis savo įrenginyje arba naršyklėje. Vartotojų duomenys nėra bendrinami tarpusavyje ir nėra saugomi išorinėje duomenų bazėje.

Toks sprendimas pasirinktas dėl projekto paprastumo, greito veikimo ir galimybės naudoti programėlę be registracijos sistemos. Ateityje projektą būtų galima plėsti pridedant vartotojų prisijungimą ir duomenų bazę.

## Programėlės struktūra

Programėlę sudaro šios pagrindinės dalys:

1. **Finansų apžvalga**  
   Pateikiama bendra mėnesio pajamų, išlaidų, likučio ir biudžeto informacija.

2. **Pajamų ir išlaidų įvedimas**  
   Vartotojas gali pridėti naujas pajamas arba išlaidas, nurodydamas sumą, datą, kategoriją ir pastabą.

3. **Biudžeto planavimas**  
   Vartotojas gali nustatyti mėnesio išlaidų biudžetą ir taupymo tikslą.

4. **Finansiniai patarimai**  
   Pateikiami trumpi patarimai, skirti finansinio raštingumo ugdymui.

5. **Apie projektą**  
   Trumpai aprašoma programėlės paskirtis, funkcijos ir naudojimo būdas.
