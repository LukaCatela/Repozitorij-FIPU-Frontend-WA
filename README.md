# FIPUHub

Studentska platforma za dijeljenje projekata, radova — izrađena kao projektni zadatak za kolegij **Web aplikacije** na preddiplomskom studiju Informatike, Fakultet informatike u Puli (FIPU).

---

## Opis projekta

FIPUHub je full-stack web aplikacija koja studentima omogućuje:

- Objavu i pregled studentskih projekata i radova
- Izgradnju osobnog portfolija
- Pretraživanje projekata po naslovu i tagovima
- Povezivanje s kolegama i poslodavcima

---

## Tehnologije

### Frontend

| Tehnologija  | Verzija | Opis                                   |
| ------------ | ------- | -------------------------------------- |
| Vue 3        | ^3.x    | JavaScript framework (Composition API) |
| Vite         | ^5.x    | Build tool                             |
| Vue Router   | ^4.x    | Klijentsko usmjeravanje                |
| Pinia        | ^2.x    | Upravljanje stanjem (state management) |
| Axios        | ^1.x    | HTTP klijent                           |
| Tailwind CSS | ^4.x    | CSS framework                          |
| Lucide Vue   | latest  | Ikone                                  |
| Day.js       | ^1.x    | Formatiranje datuma                    |

### Backend

| Tehnologija        | Verzija | Opis                         |
| ------------------ | ------- | ---------------------------- |
| Node.js            | ^20.x   | JavaScript runtime           |
| Express.js         | ^4.x    | Web framework                |
| MongoDB            | ^7.x    | NoSQL baza podataka          |
| JWT                | —       | Autentikacija korisnika      |
| Bcrypt.js          | ^2.x    | Hashiranje lozinki           |
| Multer             | ^1.x    | Upload datoteka              |
| Cloudinary         | ^2.x    | Pohrana slika i PDF-ova      |
| Helmet             | ^7.x    | Sigurnosni HTTP zaglavlja    |
| Morgan             | ^1.x    | Logiranje HTTP zahtjeva      |
| Express Validator  | ^7.x    | Validacija ulaznih podataka  |
| Express Rate Limit | ^7.x    | Ograničavanje broja zahtjeva |

---

## Implementirane funkcionalnosti

### Autentikacija i autorizacija

- Registracija korisnika s ulogama (`gost`, `student`, `profesor`, `admin`)
- Prijava s JWT tokenom (vrijedi 1 dan)
- Zaštićene rute s autentikacijskim middlewareom
- Ograničavanje broja pokušaja prijave (rate limiting)
- Validacija ulaznih podataka (express-validator)

### Profili korisnika

- Pregled i uređivanje profila (bio, smjer, godina studija, vještine)
- Upload profilne slike (Cloudinary)
- Javni profili dostupni bez prijave
- Automatsko kreiranje praznog profila pri registraciji

### Projekti

- Kreiranje projekata s naslovom, opisom i tagovima
- Upload slika i PDF dokumenata (Cloudinary)
- Javni / privatni projekti
- Pretraživanje po naslovu i tagovima
- Paginacija rezultata
- Prikaz svih projekata pojedinog korisnika

### Upload datoteka

- Pohrana slika u Cloudinary (`fipuhub/images`)
- Pohrana PDF dokumenata u Cloudinary (`fipuhub/documents`)
- Zasebna `media` kolekcija u MongoDB za praćenje datoteka

### Admin panel

- Pregled svih korisnika
- Pregled svih projekata
- Brisanje korisnika i projekata

---

## Struktura projekta

```
FIPUHub/
├── frontend/                  # Vue 3 aplikacija
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Header.vue
│   │   │   └── Footer.vue
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── stores/
│   │   │   └── auth.js        # Pinia auth store
│   │   └── views/
│   │       ├── Homepage.vue
│   │       ├── Login.vue
│   │       ├── Registration.vue
│   │       ├── Profile.vue
│   │       ├── Search.vue
│   │       ├── CreateProject.vue
│   │       ├── SingleProject.vue
│   │       ├── MyProjects.vue
│   │       └── UserProjects.vue
│   └── package.json
│
└── backend/                   # Express.js API
    ├── config/
    │   ├── db.js              # MongoDB konekcija
    │   └── cloudinary.js      # Cloudinary konfiguracija
    ├── middleware/
    │   ├── auth_middleware.js
    │   ├── role_middleware.js
    │   └── validate_middleware.js
    ├── routes/
    │   ├── auth.js
    │   ├── profiles.js
    │   ├── projects.js
    │   ├── users.js
    │   └── media.js
    └── package.json
```

---

## API Rute

### Auth `/auth`

| Metoda | Ruta             | Opis                       |
| ------ | ---------------- | -------------------------- |
| POST   | `/auth/register` | Registracija korisnika     |
| POST   | `/auth/login`    | Prijava                    |
| GET    | `/auth/me`       | Dohvat trenutnog korisnika |

### Profili `/profiles`

| Metoda | Ruta                | Opis                  |
| ------ | ------------------- | --------------------- |
| GET    | `/profiles/me`      | Vlastiti profil       |
| PUT    | `/profiles/me`      | Ažuriranje profila    |
| POST   | `/profiles/img`     | Upload profilne slike |
| GET    | `/profiles/:userId` | Javni profil          |

### Projekti `/projects`

| Metoda | Ruta                     | Opis                |
| ------ | ------------------------ | ------------------- |
| GET    | `/projects`              | Svi javni projekti  |
| POST   | `/projects`              | Kreiranje projekta  |
| GET    | `/projects/me`           | Moji projekti       |
| GET    | `/projects/:id`          | Jedan projekt       |
| GET    | `/projects/user/:userId` | Projekti korisnika  |
| PATCH  | `/projects/:id`          | Ažuriranje projekta |
| DELETE | `/projects/:id`          | Brisanje projekta   |

---

## Pokretanje projekta

### Preduvjeti

- Node.js >= 20
- MongoDB (lokalno ili Atlas)
- Cloudinary račun

### Frontend

```bash
npm install
npm run dev
```

Aplikacija je dostupna na `http://localhost:5173`

---

## Uloge korisnika

| Uloga      | Opis                                                     |
| ---------- | -------------------------------------------------------- |
| `gost`     | Pregledava projekte bez prijave                          |
| `student`  | Objavljuje projekte, uređuje profil                      |
| `profesor` | Komentira i ocjenjuje projekte (nije implementirano jos) |
| `admin`    | Puni pristup, upravljanje korisnicima                    |

---

## Baza podataka — kolekcije

| Kolekcija  | Opis                                    |
| ---------- | --------------------------------------- |
| `users`    | Podaci o korisnicima                    |
| `profiles` | Profilne informacije                    |
| `projects` | Projekti                                |
| `media`    | Slike i PDF datoteke vezane uz projekte |

---

## Autor

**Luka Catela**  
Preddiplomski studij Informatike  
Fakultet informatike u Puli (FIPU)  
Kolegij: Web aplikacije

---

## Licenca

Ovaj projekt izrađen je u obrazovne svrhe kao dio kolegija Web aplikacije na FIPU.
