### Zadanie A:
Fizyka w symulacji opiera się na aktualizacji parametrów obiektu w głównej pętli programu:
* **Wystrzał (Inicjalizacja):** Prędkość początkowa obiektu jest obliczana na podstawie wartości ustawionych na suwakach (Siła wystrzału oraz Kąt wystrzału). Za pomocą funkcji trygonometrycznych (sinus i cosinus) wektor siły jest rozkładany na dwie niezależne składowe: prędkość poziomą (oś X) i pionową (oś Y).
* **Grawitacja:** Symulacja przyciągania ziemskiego polega na cyklicznym odejmowaniu ustalonej wartości grawitacji od pionowej składowej prędkości w każdej klatce animacji. Skutkuje to zwalnianiem obiektu podczas wznoszenia oraz jego przyspieszaniem podczas opadania.
* **Kolizje i utrata energii:** Skrypt na bieżąco monitoruje współrzędne obiektu. W momencie uderzenia w krawędż, odpowiedni wektor prędkości jest odwracany, co symuluje odbicie. Dodatkowo, przy każdym uderzeniu prędkość jest redukowana o określony procent (tłumienie), co imituje stratę energii kinetycznej i ostatecznie doprowadza do zatrzymania obiektu.
<img width="1004" height="728" alt="image" src="https://github.com/user-attachments/assets/328f8236-b0d0-4122-a752-b7f8ab985232" />
<img width="1249" height="897" alt="image" src="https://github.com/user-attachments/assets/7783d329-bfc8-4387-9abf-0d7493501555" />

### Zadanie B:
Ruch obiektów w tej scenie oparty jest na kinematyce i równaniach parametrycznych okręgu, gdzie kluczową rolę odgrywa upływający czas:
* **Orbita Ziemi:** W tle działania sceny stale inkrementowana jest globalna zmienna czasu. Ziemia wykorzystuje tę zmienną jako argument dla funkcji trygonometrycznych (sinus, cosinus), co pozwala jej na płynne przemieszczanie się po stałym okręgu wokół centralnego punktu sceny (Słońca).
* **Orbita Księżyca:** Księżyc realizuje własny ruch obrotowy z większą prędkością kątową, jednak jego środek obrotu jest dynamiczny. Zamiast krążyć wokół stałego punktu, obiekt w czasie rzeczywistym odczytuje (za pomocą czujników współrzędnych) aktualną pozycję Ziemi w osiach X i Y. Współrzędne te są dodawane do wyników funkcji trygonometrycznych Księżyca, dzięki czemu płynnie podąża on za Ziemią.
<img width="369" height="326" alt="image" src="https://github.com/user-attachments/assets/2cca99da-9bb6-45e5-9ab2-4fa82c3e90a9" />
<img width="726" height="499" alt="image" src="https://github.com/user-attachments/assets/a80c6b65-c212-4d67-bdbc-77284073828c" />
<img width="843" height="465" alt="image" src="https://github.com/user-attachments/assets/ba10a025-1429-460e-84f1-41efa6622a3f" />

<img width="1196" height="899" alt="image" src="https://github.com/user-attachments/assets/73601cc5-121a-4b5c-9725-9aecd5347d96" />



