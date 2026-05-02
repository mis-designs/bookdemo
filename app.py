from pathlib import Path
import re


CARTELLA_PRINCIPALE = Path(r"C:\Users\miskat01\Downloads\quiz_book_img")

ESTENSIONI_IMMAGINI = {".jpg", ".jpeg", ".png", ".webp"}


def numero_capitolo(nome_cartella):
    match = re.search(r"Capitolo_(\d+)", nome_cartella, re.IGNORECASE)
    return int(match.group(1)) if match else 9999


def main():
    if not CARTELLA_PRINCIPALE.exists():
        raise FileNotFoundError(f"Cartella non trovata: {CARTELLA_PRINCIPALE}")

    cartelle = [
        cartella for cartella in CARTELLA_PRINCIPALE.iterdir()
        if cartella.is_dir()
    ]

    cartelle = sorted(cartelle, key=lambda c: numero_capitolo(c.name))

    totale_immagini = 0

    print("Numero immagini per capitolo:\n")

    for cartella in cartelle:
        immagini = [
            file for file in cartella.iterdir()
            if file.is_file() and file.suffix.lower() in ESTENSIONI_IMMAGINI
        ]

        numero_img = len(immagini)
        totale_immagini += numero_img

        print(f"{cartella.name}: {numero_img} immagini")

    print("\nTotale cartelle:", len(cartelle))
    print("Totale immagini:", totale_immagini)


if __name__ == "__main__":
    main()