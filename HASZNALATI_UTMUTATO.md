# FreedomPDF Használati Útmutató

Ez a dokumentum segít a FreedomPDF alkalmazás elindításában és használatában. A leírást úgy készítettük el, hogy technikai előképzettség nélkül is követhető legyen.

## Tartalomjegyzék
1. [Elindítás Windowson (Leggyorsabb módszer)](#1-elindítás-windowson-leggyorsabb-módszer)
2. [Kézi telepítés (Mac és Windows)](#2-kézi-telepítés-mac-és-windows)
3. [Alternatív módszer: Docker](#3-alternatív-módszer-docker)
4. [A program használata](#4-a-program-használata)

---

## 1. Elindítás Windowson (Leggyorsabb módszer)

Ha Windows rendszert használsz, készítettünk egy segédeszközt, ami majdnem mindent megcsinál helyetted.

1.  Nyisd meg a letöltött mappát.
2.  Keresd meg a `start_windows.bat` fájlt.
3.  Kattints rá duplán.

**Mi fog történni?**
*   **Ellenőrzés:** A program megnézi, hogy a működéshez szükséges "Node.js" telepítve van-e.
    *   *Ha nincs:* A program szól, és automatikusan megnyitja a letöltési oldalt. Töltsd le az "LTS" verziót, telepítsd fel (csak kattints a "Next"-re végig), majd indítsd el újra a `start_windows.bat` fájlt.
*   **Telepítés:** Ha ez az első indítás, a program letölti a szükséges kiegészítőket (ez eltarthat pár percig).
*   **Indítás:** Elindul a szerver, és egy fekete ablakban futni kezd. **Ezt az ablakot ne zárd be!**
*   **Böngésző:** Pár másodperc múlva automatikusan megnyílik a böngésződ a programmal. Ha mégsem, írd be a címsorba: `http://localhost:3000`

---

## 2. Kézi telepítés (Mac és Windows)

Ha Mac-et használsz, vagy a fenti módszer nem működött, kövesd ezeket a lépéseket.

### 1. lépés: Node.js telepítése
A program futtatásához szükség van a Node.js környezetre.
1.  Látogass el ide: [https://nodejs.org/](https://nodejs.org/)
2.  Töltsd le az **LTS** (ajánlott) verziót.
3.  Telepítsd fel a gépedre.

### 2. lépés: A program előkészítése
1.  Nyisd meg a "Terminált" (Mac) vagy a "Parancssort" / "PowerShellt" (Windows).
2.  Navigálj abba a mappába, ahová letöltötted a programot.
    *   Tipp: Írd be, hogy `cd `, majd húzd be a mappát az ablakba, és nyomj Entert.
3.  Írd be a következő parancsot, és nyomj Entert:
    ```bash
    npm install
    ```
    *   Várd meg, amíg végez (több sornyi szöveg jelenik meg).

### 3. lépés: Indítás
1.  Írd be a következő parancsot:
    ```bash
    npm run dev
    ```
2.  Ha azt látod, hogy "Ready" vagy "started server", nyisd meg a böngészőt.
3.  Írd be a címsorba: `http://localhost:3000`

---

## 3. Alternatív módszer: Docker

Ha a fenti módszerek nem működnek, és van a gépen Docker telepítve (vagy a rendszergazda ezt javasolja), használhatod ezt a módszert. Ez teljesen elszigetelt környezetben futtatja a programot.

1.  Győződj meg róla, hogy a **Docker Desktop** fut.
2.  Nyisd meg a terminált a program mappájában.
3.  Futtasd ezt a parancsot:
    ```bash
    docker-compose up --build
    ```
4.  Várj, amíg a folyamat véget ér (első alkalommal sokáig tarthat).
5.  Nyisd meg a böngészőt: `http://localhost:3000`

---

## 4. A program használata

A program célja PDF fájlok kezelése és koordináták konvertálása.

1.  **Fájl feltöltése:**
    *   A kezdőképernyőn találsz egy feltöltő mezőt.
    *   Húzd rá a PDF fájlt, vagy kattints rá és tallózd ki.
    *   Biztonsági okokból a fájl neve megváltozik egy egyedi azonosítóra a rendszerben.

2.  **Megtekintés:**
    *   A feltöltés után a PDF megjelenik a képernyőn.

3.  **Problémamegoldás:**
    *   Ha a program nem tölt be, ellenőrizd a fekete ablakot (terminált), hogy fut-e még.
    *   Ha hibát ír ki, próbáld meg újraindítani: zárd be az ablakot, és indítsd el újra a `start_windows.bat` fájlt vagy a parancsot.
